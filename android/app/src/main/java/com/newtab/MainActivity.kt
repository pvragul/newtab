package com.newtab

import android.content.Intent
import android.net.Uri
import android.os.Bundle
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate

class MainActivity : ReactActivity() {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  override fun getMainComponentName(): String = "NewTab"

  /**
   * Returns the instance of the [ReactActivityDelegate]. We use [DefaultReactActivityDelegate]
   * which allows you to enable New Architecture with a single boolean flags [fabricEnabled]
   */
  override fun createReactActivityDelegate(): ReactActivityDelegate =
      DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)

  private fun isHomeIntent(intent: Intent?): Boolean {
    return intent?.action == Intent.ACTION_MAIN &&
      intent.categories?.contains(Intent.CATEGORY_HOME) == true
  }

  private fun normalizeIntent(intent: Intent?) {
    if (isHomeIntent(intent)) {
      intent?.data = Uri.parse("newtab://home")
    }
  }

  override fun onCreate(savedInstanceState: Bundle?) {
    normalizeIntent(intent)
    super.onCreate(savedInstanceState)
  }

  override fun onNewIntent(intent: Intent?) {
    normalizeIntent(intent)
    super.onNewIntent(intent)
    setIntent(intent)
  }

}
