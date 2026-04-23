package com.newtab.lockscreen

import android.app.admin.DevicePolicyManager
import android.content.ComponentName
import android.content.Context
import com.facebook.react.bridge.*

class LockScreenModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName() = "ScreenLocker"

    @ReactMethod
    fun lockScreen() {
        val context = reactApplicationContext
        val dpm = context.getSystemService(Context.DEVICE_POLICY_SERVICE) as DevicePolicyManager
        val compName = ComponentName(context, MyDeviceAdminReceiver::class.java)

        if (dpm.isAdminActive(compName)) {
            dpm.lockNow()
        }
    }
}