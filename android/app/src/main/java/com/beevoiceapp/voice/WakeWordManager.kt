package com.beevoiceapp.voice

import android.content.Context
import android.util.Log
import ai.picovoice.porcupine.*

class WakeWordManager(
    private val context: Context,
    private val onWakeWordDetected: () -> Unit
) {

    private var porcupineManager: PorcupineManager? = null

    fun start() {
        if (porcupineManager != null) return

        val accessKey = "cpqxgiTZb2iwT+o4OV1eURostH1Z993FkSqytpvhrIKaNVbHC0PCug=="

        try {
            porcupineManager = PorcupineManager.Builder()
                .setAccessKey(accessKey)
                .setKeyword(Porcupine.BuiltInKeyword.BUMBLEBEE) // 👈 як у тебе
                .build(
                    context,
                    PorcupineManagerCallback {
                        Log.d("WakeWord", "🔥 Wake word detected")
                        onWakeWordDetected()
                    }
                )

            porcupineManager?.start()

            Log.d("WakeWord", "🐝 Porcupine started")

        } catch (e: Exception) {
            Log.e("WakeWord", "Error initializing Porcupine", e)
        }
    }

    fun stop() {
        try {
            porcupineManager?.stop()
            porcupineManager?.delete()
            porcupineManager = null

            Log.d("WakeWord", "🐝 Porcupine stopped")

        } catch (e: Exception) {
            Log.e("WakeWord", "Error stopping Porcupine", e)
        }
    }
}