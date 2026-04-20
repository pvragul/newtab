package com.newtab.system

import android.content.Intent
import android.content.Context
import android.content.pm.PackageManager
import android.provider.Settings
import com.facebook.react.bridge.*

class SystemSettingsModule(
  private val reactContext: ReactApplicationContext
) : ReactContextBaseJavaModule(reactContext) {

  override fun getName(): String = "SystemSettings"

  @ReactMethod
  fun openDisplaySettings() {
    val intent = Intent(Settings.ACTION_DISPLAY_SETTINGS)
    intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK
    reactContext.startActivity(intent)
  }
  
  @ReactMethod
  fun openDefaultLauncherSettings(promise: Promise) {
    try {
      val intent = Intent(Settings.ACTION_HOME_SETTINGS).apply {
        addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
      }
      reactContext.startActivity(intent)
      promise.resolve(true)
    } catch (e: Exception) {
      promise.reject("OPEN_APP_ERROR", e.message, e)
    }
  }

  fun checkIsDefaultLauncher(context: Context): Boolean {
    val intent = Intent(Intent.ACTION_MAIN).apply {
      addCategory(Intent.CATEGORY_HOME)
    }

    val pm = context.packageManager
    val resolveInfo = pm.resolveActivity(intent, PackageManager.MATCH_DEFAULT_ONLY)

    return resolveInfo?.activityInfo?.packageName == context.packageName
  }

  @ReactMethod
  fun isDefaultLauncher(promise: Promise) {
    try {
      promise.resolve(checkIsDefaultLauncher(reactContext))
    } catch (e: Exception) {
      promise.reject("CHECK_FAILED", e)
    }
  }

}
