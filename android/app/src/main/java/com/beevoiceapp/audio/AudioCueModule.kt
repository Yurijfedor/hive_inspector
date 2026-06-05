package com.beevoiceapp.audio

import android.media.AudioManager
import android.media.ToneGenerator

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class AudioCueModule(
    reactContext: ReactApplicationContext
) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "AudioCue"
    }

    @ReactMethod
    fun playBeep() {

        val tone = ToneGenerator(
            AudioManager.STREAM_NOTIFICATION,
            100
        )

        tone.startTone(
            ToneGenerator.TONE_CDMA_ONE_MIN_BEEP,
            300
        )
    }

    @ReactMethod
    fun playDoubleBeep() {

        val tone = ToneGenerator(
            AudioManager.STREAM_NOTIFICATION,
            100
        )

        tone.startTone(
            ToneGenerator.TONE_CDMA_ONE_MIN_BEEP,
            250
        )

        Thread {
            try {
                Thread.sleep(350)

                tone.startTone(
                    ToneGenerator.TONE_CDMA_ONE_MIN_BEEP,
                    250
                )
            } catch (_: Exception) {
            }
        }.start()
    }

    @ReactMethod
    fun playErrorBeep() {

        val tone = ToneGenerator(
            AudioManager.STREAM_NOTIFICATION,
            100
        )

        tone.startTone(
            ToneGenerator.TONE_SUP_ERROR,
            300
        )
    }
}