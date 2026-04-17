package com.beevoiceapp.voice

import android.content.Context
import android.util.Log
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.WritableMap

class VoiceCore(
    private val context: Context,
    private val emitEvent: (String, WritableMap) -> Unit
) {

    companion object {
        private const val TAG = "VoiceCore"
    }

    // 🔄 STATES
    enum class State {
        IDLE,
        WAKE_LISTENING,
        SPEECH_LISTENING,
        PROCESSING
    }

    @Volatile
    private var isActive = false

    private var currentState: State = State.IDLE

    // 🔧 PUBLIC API

    fun start() {
        if (isActive) {
            Log.d(TAG, "⚠️ Already started")
            return
        }

        Log.d(TAG, "🔥 START CALLED")

        isActive = true
        setState(State.WAKE_LISTENING)

        startWakeWord()
    }

    fun stop() {
        Log.d(TAG, "🛑 STOP CALLED")

        isActive = false

        stopWakeWord()
        stopSpeech()

        setState(State.IDLE)
    }

    // 🧠 STATE MANAGEMENT

    private fun setState(newState: State) {
        currentState = newState

        val map = Arguments.createMap()
        map.putString("state", newState.name)

        emitEvent("onStateChanged", map)
    }

    // 🎤 WAKE WORD

    private fun startWakeWord() {
        if (!isActive) return

        Log.d(TAG, "Starting wake word detection")

        // TODO: Porcupine init

        simulateWakeWord()
    }

    private fun stopWakeWord() {
        Log.d(TAG, "Stopping wake word detection")
        // TODO: stop Porcupine
    }

    private fun onWakeWordDetected() {
        if (!isActive) {
            Log.d(TAG, "⛔ Wake ignored (inactive)")
            return
        }

        Log.d(TAG, "🔥 Wake word detected")

        val map = Arguments.createMap()
        map.putString("event", "wake_word")

        emitEvent("onWakeWord", map)

        setState(State.SPEECH_LISTENING)

        startSpeechRecognition()
    }

    // 🗣 SPEECH

    private fun startSpeechRecognition() {
        if (!isActive) return

        Log.d(TAG, "Starting speech recognition")

        // TODO: Vosk start

        simulateSpeech()
    }

    private fun stopSpeech() {
        Log.d(TAG, "Stopping speech recognition")
        // TODO: stop Vosk
    }

    private fun onSpeechResult(text: String) {
        if (!isActive) {
            Log.d(TAG, "⛔ Speech ignored (inactive)")
            return
        }

        Log.d(TAG, "Speech result: $text")

        val map = Arguments.createMap()
        map.putString("text", text)

        emitEvent("onSpeechResult", map)

        setState(State.PROCESSING)

        restartCycle()
    }

    private fun restartCycle() {
        if (!isActive) return

        stopSpeech()
        setState(State.WAKE_LISTENING)
        startWakeWord()
    }

    // 🧪 MOCK (тимчасово, але контрольований)

    private fun simulateWakeWord() {
        Thread {
            Log.d(TAG, "⏳ waiting for wake word...")
            Thread.sleep(5000)

            if (!isActive) {
                Log.d(TAG, "⛔ cancelled wake word")
                return@Thread
            }

            onWakeWordDetected()
        }.start()
    }

    private fun simulateSpeech() {
        Thread {
            Log.d(TAG, "⏳ listening speech...")
            Thread.sleep(3000)

            if (!isActive) {
                Log.d(TAG, "⛔ cancelled speech")
                return@Thread
            }

            onSpeechResult("вулик номер 12 сила сильна мед 5")
        }.start()
    }
}