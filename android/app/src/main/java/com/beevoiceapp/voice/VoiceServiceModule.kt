package com.beevoiceapp.voice

import android.content.Intent
import android.os.Build
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class VoiceServiceModule(private val reactCtx: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactCtx) {

    companion object {
        @Volatile
        var reactContext: ReactApplicationContext? = null
    }

    init {
        reactContext = reactCtx
    }

    override fun getName(): String = "VoiceService"

    @ReactMethod
    fun startService() {
        val context = reactCtx

        val intent = Intent(context, VoiceForegroundService::class.java)

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            context.startForegroundService(intent)
        } else {
            context.startService(intent)
        }
    }

    @ReactMethod
    fun stopService() {
        val context = reactCtx

        val intent = Intent(context, VoiceForegroundService::class.java)
        context.stopService(intent)
    }
}