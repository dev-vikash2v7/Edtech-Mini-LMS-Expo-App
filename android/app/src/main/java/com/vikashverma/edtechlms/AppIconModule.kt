package com.vikashverma.edtechlms

import android.content.ComponentName
import android.content.pm.PackageManager
import com.facebook.react.bridge.*



class AppIconModule(private val reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName() = "AppIconModule"

    @ReactMethod
    fun changeIcon(aliasName: String, promise: Promise) {
        try {
            val pm = reactContext.packageManager
            val packageName = reactContext.packageName

            val aliases = listOf(
                "MainActivityAlias",
                "MainActivityIcon1",
                "MainActivityIcon2",
                "MainActivityIcon3"
            )

            if (!aliases.contains(aliasName)) {
                promise.reject("ERROR", "Invalid alias")
                return
            }

            for (alias in aliases) {
                val component = ComponentName(packageName, "$packageName.$alias")

                pm.setComponentEnabledSetting(
                    component,
                    if (alias == aliasName)
                        PackageManager.COMPONENT_ENABLED_STATE_ENABLED
                    else
                        PackageManager.COMPONENT_ENABLED_STATE_DISABLED,
                    PackageManager.DONT_KILL_APP
                )
            }

            promise.resolve("Icon changed")

        } catch (e: Exception) {
            promise.reject("ERROR", e)
        }
    }
}

          
