package com.newtab.lockscreen

import android.app.admin.DevicePolicyManager
import android.content.ComponentName
import android.content.Context
import com.facebook.react.bridge.*

class LockScreenModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName() = "ScreenLocker"

    @ReactMethod
    fun lockScreen(promise: Promise) {
        try {
            val context = reactApplicationContext
            val dpm = context.getSystemService(Context.DEVICE_POLICY_SERVICE) as DevicePolicyManager
            val compName = ComponentName(context, MyDeviceAdminReceiver::class.java)

            if (dpm.isAdminActive(compName)) {
                dpm.lockNow()
                promise.resolve(null)
            } else {
                val intent = android.content.Intent(DevicePolicyManager.ACTION_ADD_DEVICE_ADMIN)
                intent.putExtra(DevicePolicyManager.EXTRA_DEVICE_ADMIN, compName)
                intent.putExtra(DevicePolicyManager.EXTRA_ADD_EXPLANATION, "Allow NewTab to lock the screen on double tap.")
                val currentActivity = reactApplicationContext.currentActivity
                if (currentActivity != null) {
                    currentActivity.startActivity(intent)
                } else {
                    intent.addFlags(android.content.Intent.FLAG_ACTIVITY_NEW_TASK)
                    context.startActivity(intent)
                }
                promise.reject("NOT_ACTIVE", "Device Admin permission required. Please enable it to lock screen.")
            }
        } catch (e: Exception) {
            promise.reject("ERROR", e.message)
        }
    }
}