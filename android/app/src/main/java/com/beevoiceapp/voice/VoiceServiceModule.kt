package com.beevoiceapp.voice

import android.content.Intent
import com.facebook.react.bridge.*
import com.beevoiceapp.voice.VoiceForegroundService

class VoiceServiceModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName() = "VoiceService"

    @ReactMethod
    fun startService() {
        val context = reactApplicationContext
        val intent = Intent(context, VoiceForegroundService::class.java)
        context.startForegroundService(intent)
    }

    @ReactMethod
    fun stopService() {
        val context = reactApplicationContext
        val intent = Intent(context, VoiceForegroundService::class.java)
        context.stopService(intent)
    }
}