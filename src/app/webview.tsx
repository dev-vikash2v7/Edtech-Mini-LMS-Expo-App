import { showToast } from '@/utils/toast';
import { useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, Image, StyleSheet, Text, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { useAuth } from '@/hooks/useAuth';
import { useEnrolled } from '@/hooks/useEnrolled';
import { useRef, useMemo, useEffect } from 'react';

export default function WebScreen() {
  const params = useLocalSearchParams();
  const { user } = useAuth();
  const { isEnrolled, toggleEnrolled, loading } = useEnrolled(user?._id);
  const webviewRef = useRef<WebView>(null);

  const course = {
    id: params.id as string,
    title: params.title,
    description: params.description,
    instructorName: params.instructorName,
    instructorAvatar: params.instructorAvatar,
    price: params.price,
    thumbnail: params.thumbnail,
    category: params.category,
    images: params.images
  };

  const localImageUri = Image.resolveAssetSource(require('@/images/course.jpg')).uri;

  const html = useMemo(() => `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <style>
            body {
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
                margin: 0;
                padding: 0;
                background-color: #f5f7fb;
                color: #333;
                padding-bottom: 90px;
                padding-top :30px
            }
            .hero {
                width: 100%;
                height: 240px;
                object-fit: cover;
                background-color: #ddd;
            }
            .container {
                padding: 24px;
                background: white;
                border-top-left-radius: 24px;
                border-top-right-radius: 24px;
                margin-top: -24px;
                position: relative;
                box-shadow: 0 -4px 10px rgba(0,0,0,0.02);
            }
            .tag {
                background: #e0e7ff;
                color: #4f46e5;
                padding: 6px 12px;
                border-radius: 20px;
                font-size: 11px;
                font-weight: 700;
                display: inline-block;
                margin-bottom: 12px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
            .title {
                font-size: 24px;
                font-weight: 800;
                margin: 0 0 16px 0;
                line-height: 1.3;
                color: #111827;
            }
            .instructor-card {
                display: flex;
                align-items: center;
                padding: 16px;
                background: #f8fafc;
                border-radius: 16px;
                margin-bottom: 28px;
            }
            .instructor-avatar {
                width: 52px;
                height: 52px;
                border-radius: 26px;
                margin-right: 14px;
                background-color: #cbd5e1;
                object-fit: cover;
                border: 2px solid white;
            }
            .instructor-info {
                display: flex;
                flex-direction: column;
            }
            .instructor-title {
                font-size: 13px;
                color: #64748b;
                margin-bottom: 2px;
                font-weight: 500;
            }
            .instructor-name {
                font-weight: 700;
                font-size: 16px;
                color: #0f172a;
            }
            .section-title {
                font-size: 18px;
                font-weight: 700;
                margin: 0 0 12px 0;
                color: #0f172a;
            }
            .description {
                font-size: 15px;
                line-height: 1.6;
                color: #475569;
            }
            .bottom-bar {
                position: fixed;
                bottom: 0;
                left: 0;
                right: 0;
                background: white;
                padding: 16px 24px;
                border-top: 1px solid #f1f5f9;
                display: flex;
                justify-content: space-between;
                align-items: center;
                box-shadow: 0 -10px 15px -3px rgba(0, 0, 0, 0.05);
            }
            .price-container {
                display: flex;
                flex-direction: column;
            }
            .price-label {
                font-size: 12px;
                color: #64748b;
                font-weight: 600;
                margin-bottom: 2px;
            }
            .price {
                font-size: 24px;
                font-weight: 800;
                color: #16a34a;
                margin: 0;
            }
            .enroll-btn {
                background: #4f46e5;
                color: white;
                border: none;
                padding: 14px 28px;
                border-radius: 14px;
                font-size: 16px;
                font-weight: 700;
                cursor: pointer;
            }
            .enroll-btn.enrolled {
                background: #10b981;
                color: white;
            }
            .enroll-btn:active {
                background: #4338ca;
            }
        </style>
      </head>
      <body>
        <img src="${localImageUri}" class="hero" onerror="this.src='${localImageUri}'" />
        
        <div class="container">
            <div class="tag">${course.category}</div>
            <h1 class="title">${course.title}</h1>
            
            <div class="instructor-card">
                <img src="${course.instructorAvatar}" class="instructor-avatar" onerror="this.src='https://via.placeholder.com/100'" />
                <div class="instructor-info">
                    <span class="instructor-title">Course Instructor</span>
                    <span class="instructor-name">${course.instructorName}</span>
                </div>
            </div>

            <h2 class="section-title">About this course</h2>
            <div class="description">${course.description}</div>
        </div>

        <div class="bottom-bar">
            <div class="price-container">
                <span class="price-label">Total Price</span>
                <span class="price">₹${course.price}</span>
            </div>
            <button class="enroll-btn ${isEnrolled(course.id) ? 'enrolled' : ''}" id="enrollBtn" onclick="sendMessage()">${isEnrolled(course.id) ? 'Enrolled ✅' : 'Enroll Now'}</button>
        </div>

        <script>
            document.addEventListener('message', function(event) {
                try {
                    const data = JSON.parse(event.data);
                    if (data.type === 'HEADERS') {
                        const headerDisplay = document.createElement('div');
                        headerDisplay.className = 'tag';
                        headerDisplay.style.backgroundColor = '#dcfce7';
                        headerDisplay.style.color = '#166534';
                        headerDisplay.style.marginLeft = '8px';
                        headerDisplay.innerText = 'App: ' + data.headers['X-App-Name'];
                        
                        const container = document.querySelector('.container');
                        container.insertBefore(headerDisplay, container.children[1]); 
                    }
                } catch(e) { }
            });

            window.addEventListener('message', function(event) {
                try {
                    const data = JSON.parse(event.data);
                    if (data.type === 'HEADERS') {
                        const headerDisplay = document.createElement('div');
                        headerDisplay.className = 'tag';
                        headerDisplay.style.backgroundColor = '#dcfce7';
                        headerDisplay.style.color = '#166534';
                        headerDisplay.style.marginLeft = '8px';
                        headerDisplay.innerText = 'App: ' + data.headers['X-App-Name'];
                        
                        const container = document.querySelector('.container');
                        container.insertBefore(headerDisplay, container.children[1]); 
                    }
                    if (data.type === 'UPDATE_ENROLL') {
                        const btn = document.getElementById('enrollBtn');
                        if (btn) {
                            if (data.isEnrolled) {
                                btn.innerText = 'Enrolled ✅';
                                btn.classList.add('enrolled');
                            } else {
                                btn.innerText = 'Enroll Now';
                                btn.classList.remove('enrolled');
                            }
                        }
                    }
                } catch(e) { }
            });

            function sendMessage() {
                window.ReactNativeWebView.postMessage(
                    JSON.stringify({ type: 'ENROLL', message: 'User clicked enroll' })
                );
            }
        </script>
      </body>
    </html>
  `, [course.id, course.title, course.thumbnail, course.category, course.description, course.price, loading]);

  useEffect(() => {
    if (loading) return;
    webviewRef.current?.injectJavaScript(`
      window.postMessage(JSON.stringify({
        type: 'UPDATE_ENROLL',
        isEnrolled: ${isEnrolled(course.id)}
      }), '*');
      true;
    `);
  }, [isEnrolled, course.id]);

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={[StyleSheet.absoluteFillObject, styles.center]}>
          <ActivityIndicator size="large" color="#4f46e5" />
        </View>
      ) : (
        <WebView
          ref={webviewRef}
          originWhitelist={['*']}
        source={{
          html,
          headers: {
            'X-App-Name': 'EdTechApp',
            'X-User-Type': 'student',
          },
        }}
        startInLoadingState={true}
        renderLoading={() => (
          <View style={[StyleSheet.absoluteFillObject, styles.center]}>
            <ActivityIndicator size="large" color="#4f46e5" />
          </View>
        )}
        renderError={() => (
          <View style={[StyleSheet.absoluteFillObject, styles.center]}>
            <Text style={styles.errorText}>Failed to load course content. Please try again.</Text>
          </View>
        )}
        injectedJavaScript={`
          window.postMessage(JSON.stringify({
            type: 'HEADERS',
            headers: {
              'X-App-Name': 'EdTechApp',
              'X-User-Type': 'student',
            }
          }), '*');
          true; 
        `}
        onMessage={(event) => {
          const data = JSON.parse(event.nativeEvent.data);

          if (data.type === 'ENROLL') {
            toggleEnrolled(course.id);
            const currentlyEnrolled = isEnrolled(course.id);
            if (!currentlyEnrolled) {
              showToast('Success 🎉', 'You enrolled in this course!', 'success');
            } else {
              showToast('Unenrolled', 'You have unenrolled from this course.', 'info');
            }
          }
        }}
      />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fb',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f7fb',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 16,
    fontWeight: '500',
  }
});