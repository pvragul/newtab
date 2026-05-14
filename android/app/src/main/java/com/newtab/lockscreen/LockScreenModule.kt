package com.newtab.lockscreen

import android.app.admin.DevicePolicyManager
import android.content.ComponentName
import android.content.Context
import com.facebook.react.bridge.*

class LockScreenModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName() = "ScreenLocker"

    @ReactMethod
    fun isAccessibilityServiceEnabled(promise: Promise) {
        promise.resolve(LockAccessibilityService.isRunning())
    }

    @ReactMethod
    fun openAccessibilitySettings() {
        val intent = android.content.Intent(android.provider.Settings.ACTION_ACCESSIBILITY_SETTINGS)
        intent.addFlags(android.content.Intent.FLAG_ACTIVITY_NEW_TASK)
        reactApplicationContext.startActivity(intent)
    }

    @ReactMethod
    fun lockScreen(promise: Promise) {
        // Try Accessibility Service first (supports biometrics)
        if (LockAccessibilityService.isRunning()) {
            if (LockAccessibilityService.lockScreen()) {
                promise.resolve("ACCESSIBILITY_LOCK")
                return
            }
        }

        // Fallback to Device Admin (immediate, but disables biometrics)
        try {
            val context = reactApplicationContext
            val dpm = context.getSystemService(Context.DEVICE_POLICY_SERVICE) as DevicePolicyManager
            val compName = ComponentName(context, MyDeviceAdminReceiver::class.java)

            if (dpm.isAdminActive(compName)) {
                dpm.lockNow()
                promise.resolve("ADMIN_LOCK")
            } else {
                val intent = android.content.Intent(DevicePolicyManager.ACTION_ADD_DEVICE_ADMIN)
                intent.putExtra(DevicePolicyManager.EXTRA_DEVICE_ADMIN, compName)
                intent.putExtra(DevicePolicyManager.EXTRA_ADD_EXPLANATION, "Allow NewTab to lock the screen. Enable Accessibility Service for fingerprint/face unlock support.")
                val currentActivity = reactApplicationContext.currentActivity
                if (currentActivity != null) {
                    currentActivity.startActivity(intent)
                } else {
                    intent.addFlags(android.content.Intent.FLAG_ACTIVITY_NEW_TASK)
                    context.startActivity(intent)
                }
                promise.reject("NOT_ACTIVE", "Permission required. For fingerprint/face unlock support, please enable the 'NewTab' Accessibility Service in your phone settings.")
            }
        } catch (e: Exception) {
            promise.reject("ERROR", e.message)
        }
    }
}