package com.beevoiceapp.brightness

import android.app.Activity
import android.view.WindowManager
import com.facebook.react.bridge.*

class BrightnessModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    private var originalBrightness: Float? = null

    override fun getName() = "BrightnessModule"

    @ReactMethod
    fun enableFieldMode() {
        val activity: Activity = currentActivity ?: return

        activity.runOnUiThread {
            val window = activity.window
            val params = window.attributes

            // Зберігаємо поточну яскравість
            if (originalBrightness == null) {
                originalBrightness = params.screenBrightness
            }

            // Мінімальна яскравість (0.0 - 1.0)
            params.screenBrightness = 0.02f
            window.attributes = params

            // Не даємо екрану вимикатись
            window.addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON)
        }
    }

    @ReactMethod
    fun disableFieldMode() {
        val activity: Activity = currentActivity ?: return

        activity.runOnUiThread {
            val window = activity.window
            val params = window.attributes

            // Відновлюємо яскравість
            params.screenBrightness = originalBrightness ?: -1f
            window.attributes = params

            // Дозволяємо екрану гаснути
            window.clearFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON)

            originalBrightness = null
        }
    }
}