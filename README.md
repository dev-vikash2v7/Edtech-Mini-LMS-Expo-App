##  Setup Instructions 

###  Prerequisites
- Node.js (v18 or higher )
- npm or yarn
- Git
- Android Studio (for Android Emulator)
- Xcode (for iOS Simulator)

---

##  Installation & Running

### 1. Clone the repository

```bash
git clone https://github.com/dev-vikash2v7/Edtech-Mini-LMS-Expo-App
cd Edtech-Mini-LMS-Expo-App
 ```

2. **Install dependencies**:
   ```bash
   npm install
   npm install -g  eas-cli
   ```
3. **npx expo login**:
   ```bash
   npx expo login
   ```

3. **INITIALIZE EAS (FIRST TIME ONLY)**:
   ```bash
   npx expo prebuild

   npx eas build:configure
   ```

4. **CREATE DEVELOPMENT BUILD**:
   ```bash
   npx eas build -p android --profile preview # android
   npx eas build -p ios --profile preview # ios
   ```

5. **RUN DEVELOPMENT BUILD**:
   ```bash
   npx expo start --dev-client # App opened in device
   ```

## Environment Variables Needed

Create .env file in root add these variable
```env
EXPO_PUBLIC_API_URL=https://api.freeapi.app/api/v1
```

## Key Architectural Decisions

Local Image : Download image locally and use it.

Framework: Built with Expo + React Native for cross-platform (Android & iOS) development.

Routing: Uses Expo Router for clean, file-based navigation.

Styling: Implemented with NativeWind for scalable and consistent UI.

State Management: Centralized auth using React Context (AuthContext) with secure token storage via Expo SecureStore.

Offline Support: Uses AsyncStorage + custom hooks to cache user data, bookmarks, and courses for offline access.

Network Handling: Integrated NetInfo for detecting offline mode and fallback to cached data.

Notifications: Handle Foreground and Background Custom notification logic for 24 hours auto reminders and bookmarks.



## Known Issues / Limitations

Dev Build Caching: Changes like splash screen or native configs require rebuilding .

WebView Loading Issues: Some external or local assets may fail to load reliably.

Public API Limits: Uses free API (freeapi.app), which may have rate limits or instability.

Offline Sync Delay: Switching between online/offline data can cause slight delay due to network detection.

Image Failures: Remote images may break; handled via local fallback but still dependent on source quality.