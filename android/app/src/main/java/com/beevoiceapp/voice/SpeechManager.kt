package com.beevoiceapp.voice

import android.content.Context
import android.media.AudioFormat
import android.media.AudioRecord
import android.media.MediaRecorder
import android.util.Log
import org.vosk.Model
import org.vosk.Recognizer
import java.io.File

class SpeechManager(
    private val context: Context,
    private val onResult: (String) -> Unit
) {

    companion object {
        private const val TAG = "SpeechManager"
        private const val SAMPLE_RATE = 16000
    }

    private var model: Model? = null
    private var recognizer: Recognizer? = null
    private var audioRecord: AudioRecord? = null
    private var isListening = false

    fun start() {
        if (isListening) return

        try {
            Log.d(TAG, "📦 Preparing Vosk model")

            // 🔥 1. Правильний шлях до моделі
            val modelPath = File(context.filesDir, "model")

            // 🔥 2. Копіюємо з assets якщо ще не копіювали
            if (!modelPath.exists()) {
                Log.d(TAG, "📦 Copying model from assets...")
                AssetHelper.copyAssetFolder(
                    context,
                    "model",
                    modelPath.absolutePath
                )
            }

            // 🔥 3. Ініціалізація через filesDir
            model = Model(modelPath.absolutePath)
            recognizer = Recognizer(model, SAMPLE_RATE.toFloat())

            val bufferSize = AudioRecord.getMinBufferSize(
                SAMPLE_RATE,
                AudioFormat.CHANNEL_IN_MONO,
                AudioFormat.ENCODING_PCM_16BIT
            )

            audioRecord = AudioRecord(
                MediaRecorder.AudioSource.MIC,
                SAMPLE_RATE,
                AudioFormat.CHANNEL_IN_MONO,
                AudioFormat.ENCODING_PCM_16BIT,
                bufferSize
            )

            audioRecord?.startRecording()
            isListening = true

            Thread {
                val buffer = ByteArray(bufferSize)

                Log.d(TAG, "🎤 Vosk listening (AudioRecord)")

                while (isListening) {
                    val read = audioRecord?.read(buffer, 0, buffer.size) ?: 0

                    if (read > 0) {
                        val isFinal =
                            recognizer?.acceptWaveForm(buffer, read) ?: false

                        if (isFinal) {
                            val result = recognizer?.result
                            val text = extractText(result)

                            if (text.isNotBlank()) {
                                Log.d(TAG, "✅ Final: $text")
                                stop()
                                onResult(text)
                                break
                            }
                        }
                    }
                }
            }.start()

        } catch (e: Exception) {
            Log.e(TAG, "❌ Error starting Vosk", e)
        }
    }

    fun stop() {
        isListening = false

        try {
            audioRecord?.stop()
        } catch (_: Exception) {}

        audioRecord?.release()
        audioRecord = null

        recognizer?.close()
        recognizer = null

        model?.close()
        model = null

        Log.d(TAG, "🛑 Vosk stopped")
    }

    private fun extractText(json: String?): String {
        if (json == null) return ""
        val regex = """"text"\s*:\s*"(.+?)"""".toRegex()
        return regex.find(json)?.groupValues?.get(1) ?: ""
    }
}