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

    private var currentState: State = State.IDLE

    // 🔧 PUBLIC API

    fun start() {
        Log.d(TAG, "VoiceCore started")
        setState(State.WAKE_LISTENING)

        startWakeWord()
    }

    fun stop() {
        Log.d(TAG, "VoiceCore stopped")

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
        Log.d(TAG, "Starting wake word detection")

        // TODO: тут буде Porcupine init

        // 🔥 Поки що емуляція:
        simulateWakeWord()
    }

    private fun stopWakeWord() {
        Log.d(TAG, "Stopping wake word detection")
        // TODO: stop Porcupine
    }

    private fun onWakeWordDetected() {
        Log.d(TAG, "Wake word detected")

        val map = Arguments.createMap()
        map.putString("event", "wake_word")

        emitEvent("onWakeWord", map)

        setState(State.SPEECH_LISTENING)

        startSpeechRecognition()
    }

    // 🗣 SPEECH

    private fun startSpeechRecognition() {
        Log.d(TAG, "Starting speech recognition")

        // TODO: тут буде Vosk start

        // 🔥 Поки що емуляція:
        simulateSpeech()
    }

    private fun stopSpeech() {
        Log.d(TAG, "Stopping speech recognition")
        // TODO: stop Vosk
    }

    private fun onSpeechResult(text: String) {
        Log.d(TAG, "Speech result: $text")

        val map = Arguments.createMap()
        map.putString("text", text)

        emitEvent("onSpeechResult", map)

        setState(State.PROCESSING)

        // після обробки повертаємось до wake word
        restartCycle()
    }

    private fun restartCycle() {
        stopSpeech()
        setState(State.WAKE_LISTENING)
        startWakeWord()
    }

    // 🧪 MOCK (тимчасово)

    private fun simulateWakeWord() {
        Thread {
            Thread.sleep(5000)
            onWakeWordDetected()
        }.start()
    }

    private fun simulateSpeech() {
        Thread {
            Thread.sleep(3000)
            onSpeechResult("вулик номер 12 сила сильна мед 5")
        }.start()
    }
}