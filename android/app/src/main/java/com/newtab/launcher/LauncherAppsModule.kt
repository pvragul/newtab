package com.newtab.launcher

import android.content.Intent
import android.content.ComponentName
import android.content.pm.ApplicationInfo
import android.content.pm.PackageManager
import android.graphics.*
import android.graphics.drawable.BitmapDrawable
import android.graphics.drawable.Drawable
import android.net.Uri
import android.provider.Settings
import com.facebook.react.bridge.*
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactMethod
import java.io.File
import java.io.FileOutputStream

class LauncherAppsModule(
  private val reactContext: ReactApplicationContext
) : ReactContextBaseJavaModule(reactContext) {

  override fun getName() = "LauncherApps"

  /**
   * Returns all launchable apps with cached icon URI
   */
  @ReactMethod
  fun getLaunchableApps(promise: Promise) {
    try {
      val pm = reactContext.packageManager
      val intent = Intent(Intent.ACTION_MAIN).apply {
        addCategory(Intent.CATEGORY_LAUNCHER)
      }

      val apps = pm.queryIntentActivities(intent, 0)
        .map { resolveInfo ->
          val appInfo = resolveInfo.activityInfo.applicationInfo
          val packageName = appInfo.packageName
          val isSystemApp = (appInfo.flags and ApplicationInfo.FLAG_SYSTEM) != 0
          val isUpdatedSystemApp = (appInfo.flags and ApplicationInfo.FLAG_UPDATED_SYSTEM_APP) != 0
          Arguments.createMap().apply {
            putString("name", pm.getApplicationLabel(appInfo).toString())
            putString("packageName", packageName)
            putString("activityName", resolveInfo.activityInfo.name)
            putString("iconUri", getCachedIconUri(packageName))
            putBoolean("isSystemApp", isSystemApp)
            putBoolean("isUpdatedSystemApp", isUpdatedSystemApp)
            putString("installer", try {
                    pm.getInstallerPackageName(appInfo.packageName)
                } catch (e: Exception) {
                    null
                })
          }
        }
        .sortedBy { it.getString("name") }

      promise.resolve(Arguments.makeNativeArray(apps))
    } catch (e: Exception) {
      promise.reject("ERR_LAUNCHER_APPS", e)
    }
  }

  /**
   * Converts any Drawable (including AdaptiveIconDrawable) to Bitmap
   */
  private fun drawableToBitmap(drawable: Drawable): Bitmap {
    if (drawable is BitmapDrawable) {
      return drawable.bitmap
    }

    val width = drawable.intrinsicWidth.takeIf { it > 0 } ?: 128
    val height = drawable.intrinsicHeight.takeIf { it > 0 } ?: 128

    val bitmap = Bitmap.createBitmap(width, height, Bitmap.Config.ARGB_8888)
    val canvas = Canvas(bitmap)
    drawable.setBounds(0, 0, canvas.width, canvas.height)
    drawable.draw(canvas)

    return bitmap
  }

  /**
   * Caches app icon to disk and returns file:// URI
   */
  private fun getCachedIconUri(packageName: String): String {
    val cacheDir = reactContext.cacheDir
    val iconFile = File(cacheDir, "$packageName.png")

    if (!iconFile.exists()) {
      val pm = reactContext.packageManager
      val drawable = pm.getApplicationIcon(packageName)
      val bitmap = drawableToBitmap(drawable)

      FileOutputStream(iconFile).use {
        bitmap.compress(Bitmap.CompressFormat.PNG, 100, it)
      }
    }

    return Uri.fromFile(iconFile).toString()
  }

  @ReactMethod
  fun openApp(packageName: String, activityName: String?, promise: Promise) {
    try {
      val pm = reactApplicationContext.packageManager

      val intent: Intent = if (!activityName.isNullOrEmpty()) {
        Intent().apply {
          component = ComponentName(packageName, activityName)
          addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        }
      } else {
        pm.getLaunchIntentForPackage(packageName)
          ?: run {
            promise.reject("NO_INTENT", "Cannot launch app")
            return
          }
      }

      intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
      reactApplicationContext.startActivity(intent)
      promise.resolve(true)

    } catch (e: Exception) {
      promise.reject("OPEN_APP_ERROR", e.message, e)
    }
  }

  @ReactMethod
  fun openAppInfo(packageName: String, promise: Promise) {
    try {
      val intent = Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS).apply {
        data = Uri.fromParts("package", packageName, null)
        addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
      }
      reactContext.startActivity(intent)
      promise.resolve(true)
    } catch (e: Exception) {
      promise.reject("OPEN_APP_INFO_ERROR", e.message, e)
    }
  }

  @ReactMethod
  fun uninstallApp(packageName: String, promise: Promise) {
    try {
      val intent = Intent(Intent.ACTION_DELETE).apply {
        data = Uri.parse("package:$packageName")
        addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
      }
      reactContext.startActivity(intent)
      promise.resolve(true)
    } catch (e: Exception) {
      promise.reject("UNINSTALL_ERROR", e.message, e)
    }
  }
}
