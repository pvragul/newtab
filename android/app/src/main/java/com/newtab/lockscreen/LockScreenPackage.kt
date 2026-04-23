package com.newtab.lockscreen

import com.facebook.react.ReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ViewManager

class LockScreenPackage : ReactPackage {
    override fun createNativeModules(reactContext: ReactApplicationContext)
        = listOf(LockScreenModule(reactContext))

    override fun createViewManagers(reactContext: ReactApplicationContext)
        = emptyList<ViewManager<*, *>>()
}