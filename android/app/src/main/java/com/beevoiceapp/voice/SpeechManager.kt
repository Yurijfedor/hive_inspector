package com.beevoiceapp.voice

import android.content.Context
import android.util.Log
import org.vosk.Model
import org.vosk.Recognizer
import org.vosk.android.RecognitionListener
import org.vosk.android.SpeechService

class SpeechManager(
    private val context: Context,
    private val onFinalText: (String) -> Unit
) : RecognitionListener {

    companion object {
        private const val TAG = "SpeechManager"
    }

    private var model: Model? = null
    private var speechService: SpeechService? = null
    private var isListening = false

    fun start() {
        if (isListening) return

        try {
            Log.d(TAG, "📦 Loading Vosk model...")

            model = Model("model")

            val recognizer = Recognizer(model, 16000.0f)

            speechService = SpeechService(recognizer, 16000.0f)
            speechService?.startListening(this)

            isListening = true

            Log.d(TAG, "🎤 Vosk started")

        } catch (e: Exception) {
            Log.e(TAG, "❌ Failed to init Vosk", e)
        }
    }

    fun stop() {
        if (!isListening) return

        Log.d(TAG, "🛑 Stopping Vosk")

        speechService?.stop()
        speechService?.shutdown()
        speechService = null

        model?.close()
        model = null

        isListening = false
    }

    // 🎧 CALLBACKS

    override fun onPartialResult(hypothesis: String?) {
        Log.d(TAG, "🟡 Partial: $hypothesis")
    }

    override fun onResult(hypothesis: String?) {
        Log.d(TAG, "🔵 Result: $hypothesis")
    }

    override fun onFinalResult(hypothesis: String?) {
        val text = extractText(hypothesis)

        if (text.isNotBlank()) {
            Log.d(TAG, "✅ Final result: $text")

            stop() // 👈 як у твоєму TS (v.stop())

            onFinalText(text)
        }
    }

    override fun onError(e: Exception?) {
        Log.e(TAG, "❌ Error", e)
        stop()
    }

    override fun onTimeout() {
        Log.d(TAG, "⏱ Timeout")
        stop()
    }

    private fun extractText(json: String?): String {
        if (json == null) return ""

        val regex = """"text"\s*:\s*"(.+?)"""".toRegex()
        return regex.find(json)?.groupValues?.get(1) ?: ""
    }
}