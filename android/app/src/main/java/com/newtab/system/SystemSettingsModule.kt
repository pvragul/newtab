package com.newtab.system

import android.content.Intent
import android.content.Context
import android.content.pm.PackageManager
import android.provider.Settings
import android.net.Uri
import android.os.PowerManager
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

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
      val intent = Intent(Settings.ACTION_HOME_SETTINGS)
      intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
      reactContext.startActivity(intent)
      promise.resolve(true)
    } catch (e: Exception) {
      promise.reject("OPEN_APP_ERROR", e.message, e)
    }
  }

  private fun checkIsDefaultLauncher(context: Context): Boolean {
    val intent = Intent(Intent.ACTION_MAIN)
    intent.addCategory(Intent.CATEGORY_HOME)

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

  /* ---------------- Battery Optimization ---------------- */

  private fun isBatteryOptimizationIgnoredInternal(): Boolean {
    val pm = reactContext.getSystemService(Context.POWER_SERVICE) as PowerManager
    return pm.isIgnoringBatteryOptimizations(reactContext.packageName)
  }

  @ReactMethod
  fun isBatteryOptimizationIgnored(promise: Promise) {
    try {
      promise.resolve(isBatteryOptimizationIgnoredInternal())
    } catch (e: Exception) {
      promise.reject("CHECK_FAILED", e)
    }
  }

  @ReactMethod
  fun requestDisableBatteryOptimization(promise: Promise) {
    try {
      val intent = Intent(Settings.ACTION_REQUEST_IGNORE_BATTERY_OPTIMIZATIONS)
      intent.data = Uri.parse("package:${reactContext.packageName}")
      intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
      reactContext.startActivity(intent)
      promise.resolve(true)
    } catch (e: Exception) {
      promise.reject("REQUEST_FAILED", e)
    }
  }
}