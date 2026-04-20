package com.newtab.launcher

import android.content.Intent
import android.content.ComponentName
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

          Arguments.createMap().apply {
            putString("name", pm.getApplicationLabel(appInfo).toString())
            putString("packageName", packageName)
            putString("activityName", resolveInfo.activityInfo.name)
            putString("iconUri", getCachedIconUri(packageName))
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

  /**
   * Exposed method to fetch icon URI individually (optional)
   */
  @ReactMethod
  fun getAppIconUri(packageName: String, promise: Promise) {
    try {
      promise.resolve(getCachedIconUri(packageName))
    } catch (e: PackageManager.NameNotFoundException) {
      promise.reject("ICON_NOT_FOUND", "App icon not found")
    } catch (e: Exception) {
      promise.reject("ICON_ERROR", e)
    }
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
  fun getAppMeta(packageName: String, promise: Promise) {
    try {
      val pm = reactApplicationContext.packageManager
      val appInfo = pm.getApplicationInfo(packageName, 0)
      val name = pm.getApplicationLabel(appInfo).toString()
      val iconUri = getCachedIconUri(packageName)

      val map = Arguments.createMap()
      map.putString("packageName", packageName)
      map.putString("name", name)
      map.putString("icon", iconUri)

      promise.resolve(map)
    } catch (e: Exception) {
      promise.reject("APP_NOT_FOUND", e)
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
