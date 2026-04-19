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

    enum class State {
        IDLE,
        WAKE_LISTENING,
        SPEECH_LISTENING,
        PROCESSING
    }

    @Volatile
    private var isActive = false

    private var currentState: State = State.IDLE

    private var wakeWordManager: WakeWordManager? = null
    private var speechManager: SpeechManager? = null

    // 🔧 PUBLIC API

   // fun start() {
       // if (isActive) {
           // Log.d(TAG, "⚠️ Already started")
            //return
        //}

        //Log.d(TAG, "🔥 START CALLED")

        //isActive = true

        //wakeWordManager = WakeWordManager(context) {
            //onWakeWordDetected()
        //}

        //setState(State.WAKE_LISTENING)
        //startWakeWord()
    //}

    fun start() {
        if (isActive) return

        Log.d(TAG, "🔥 START TEST VOSK ONLY")

        isActive = true

        setState(State.SPEECH_LISTENING)

        startSpeechRecognition()
    }
    
    fun stop() {
        Log.d(TAG, "🛑 STOP CALLED")

        isActive = false

        stopWakeWord()
        stopSpeech()

        setState(State.IDLE)
    }

    // 🧠 STATE

    private fun setState(newState: State) {
        currentState = newState

        val map = Arguments.createMap()
        map.putString("state", newState.name)

        emitEvent("onStateChanged", map)
    }

    // 🎤 WAKE WORD

    private fun startWakeWord() {
        if (!isActive) return

        Log.d(TAG, "🎧 Starting wake word detection")

        wakeWordManager?.start()
    }

    private fun stopWakeWord() {
        Log.d(TAG, "🛑 Stopping wake word detection")

        wakeWordManager?.stop() // ⚠️ ВАЖЛИВО: всередині має бути delete()
    }

    private fun onWakeWordDetected() {
        if (!isActive) return

        Log.d(TAG, "🔥 Wake word detected")

        emitEvent("onWakeWord", Arguments.createMap())

        // 1️⃣ Повністю звільняємо мікрофон
        stopWakeWord()
        wakeWordManager = null // 🔥 КРИТИЧНО

        // 2️⃣ Даємо Android час
        Thread {
            try {
                Thread.sleep(800) // 🔥 БУЛО 500 → тепер 800 стабільніше
            } catch (e: Exception) {}

            if (!isActive) return@Thread

            Log.d(TAG, "🎯 Starting Vosk after mic release")

            setState(State.SPEECH_LISTENING)
            startSpeechRecognition()
        }.start()
    }

    // 🗣 SPEECH (VOSK)

    private fun startSpeechRecognition() {
        if (!isActive) return

        Log.d(TAG, "🎤 Starting speech recognition")

        // safety reset
        speechManager?.stop()
        speechManager = null

        speechManager = SpeechManager(context) { text ->
            onSpeechResult(text)
        }

        speechManager?.start()
    }

    private fun stopSpeech() {
        Log.d(TAG, "🛑 Stopping speech recognition")

        speechManager?.stop()
        speechManager = null
    }

    private fun onSpeechResult(text: String) {
        if (!isActive) {
            Log.d(TAG, "⛔ Speech ignored (inactive)")
            return
        }

        Log.d(TAG, "🧠 Speech result: $text")

        val map = Arguments.createMap()
        map.putString("text", text)

        emitEvent("onSpeechResult", map)

        setState(State.PROCESSING)

        restartCycle()
    }

    private fun restartCycle() {
        if (!isActive) return

        stopSpeech()

        
        wakeWordManager = WakeWordManager(context) {
            onWakeWordDetected()
        }

        setState(State.WAKE_LISTENING)
        startWakeWord()
    }
}