package com.beevoiceapp.audio

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.media.AudioDeviceInfo
import android.media.AudioFormat
import android.media.AudioManager
import android.media.AudioRecord
import android.media.MediaRecorder
import android.os.Build
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import kotlin.math.sqrt

class BluetoothAudioModule(
    reactContext: ReactApplicationContext
) : ReactContextBaseJavaModule(reactContext) {

    private val audioManager: AudioManager =
        reactContext.getSystemService(Context.AUDIO_SERVICE) as AudioManager

    private var testAudioRecord: AudioRecord? = null
    private var testRecordingThread: Thread? = null

    override fun getName(): String {
        return "BluetoothAudio"
    }

    // ============================================================
    // GET AUDIO DEVICES
    // ============================================================

    @ReactMethod
    fun getAudioDevices(promise: Promise) {
        try {
            println("🎧 [BluetoothAudio] getAudioDevices() START")

            val result = Arguments.createMap()
            val inputs = Arguments.createArray()
            val outputs = Arguments.createArray()

            val devices =
                audioManager.getDevices(AudioManager.GET_DEVICES_ALL)

            println(
                "🎧 [BluetoothAudio] Total devices: ${devices.size}"
            )

            for (device in devices) {

                println(
                    "🎧 [BluetoothAudio] DEVICE: " +
                        "id=${device.id}, " +
                        "type=${device.type}, " +
                        "name=${device.productName}, " +
                        "source=${device.isSource}, " +
                        "sink=${device.isSink}"
                )

                val info = Arguments.createMap()

                info.putInt("id", device.id)
                info.putInt("type", device.type)

                info.putString(
                    "typeName",
                    getDeviceTypeName(device.type)
                )

                info.putString(
                    "productName",
                    device.productName?.toString() ?: ""
                )

                info.putBoolean("isInput", device.isSource)
                info.putBoolean("isOutput", device.isSink)

                if (device.isSource) {
                    inputs.pushMap(info)
                }

                if (device.isSink) {
                    outputs.pushMap(info)
                }
            }

            result.putArray("inputs", inputs)
            result.putArray("outputs", outputs)

            promise.resolve(result)

        } catch (e: Exception) {

            println(
                "❌ [BluetoothAudio] " +
                    "getAudioDevices() ERROR: ${e.message}"
            )

            promise.reject(
                "AUDIO_DEVICE_ERROR",
                e
            )
        }
    }

    // ============================================================
    // TEST SCO -> AUDIO RECORD
    // ============================================================

    @ReactMethod
    fun testBluetoothScoAudioRecord(promise: Promise) {

        println(
            "🎧 [BluetoothAudio] " +
                "testBluetoothScoAudioRecord() START"
        )

        try {

            stopBluetoothAudioRecordInternal()

            if (Build.VERSION.SDK_INT < Build.VERSION_CODES.M) {
                promise.reject(
                    "UNSUPPORTED_ANDROID",
                    "AudioDeviceInfo requires Android 6+"
                )
                return
            }

            println(
                "🎧 [BluetoothAudio] Android SDK: " +
                    "${Build.VERSION.SDK_INT}"
            )

            // ----------------------------------------------------
            // FIND BLUETOOTH SCO INPUT
            // ----------------------------------------------------

            val inputDevices =
                audioManager.getDevices(
                    AudioManager.GET_DEVICES_INPUTS
                )

            println(
                "🎧 [BluetoothAudio] " +
                    "Input devices count: ${inputDevices.size}"
            )

            for (device in inputDevices) {

                println(
                    "🎧 [BluetoothAudio] INPUT: " +
                        "id=${device.id}, " +
                        "type=${device.type}, " +
                        "typeName=${getDeviceTypeName(device.type)}, " +
                        "name=${device.productName}"
                )
            }

            val bluetoothInput =
                inputDevices.firstOrNull {
                    it.type == AudioDeviceInfo.TYPE_BLUETOOTH_SCO
                }

            if (bluetoothInput == null) {

                println(
                    "❌ [BluetoothAudio] " +
                        "Bluetooth SCO input NOT FOUND"
                )

                promise.reject(
                    "BLUETOOTH_INPUT_NOT_FOUND",
                    "Bluetooth SCO input device was not found"
                )

                return
            }

            println(
                "🎧 [BluetoothAudio] " +
                    "Bluetooth SCO input FOUND: " +
                    "id=${bluetoothInput.id}, " +
                    "name=${bluetoothInput.productName}"
            )

            // ----------------------------------------------------
            // ANDROID 11 / LEGACY SCO
            // ----------------------------------------------------

            if (Build.VERSION.SDK_INT < Build.VERSION_CODES.S) {

                println(
                    "🎧 [BluetoothAudio] " +
                        "Using legacy Bluetooth SCO path"
                )

                println(
                    "🎧 [BluetoothAudio] " +
                        "Current audio mode: ${audioManager.mode}"
                )

                audioManager.mode =
                    AudioManager.MODE_IN_COMMUNICATION

                println(
                    "🎧 [BluetoothAudio] " +
                        "Requested MODE_IN_COMMUNICATION"
                )

                println(
                    "🎧 [BluetoothAudio] " +
                        "Audio mode after request: ${audioManager.mode}"
                )

                // ------------------------------------------------
                // RECEIVER
                // ------------------------------------------------

                val receiver =
                    object : BroadcastReceiver() {

                        override fun onReceive(
                            context: Context?,
                            intent: Intent?
                        ) {

                            if (
                                intent?.action !=
                                AudioManager.ACTION_SCO_AUDIO_STATE_UPDATED
                            ) {
                                return
                            }

                            val state =
                                intent.getIntExtra(
                                    AudioManager.EXTRA_SCO_AUDIO_STATE,
                                    AudioManager.SCO_AUDIO_STATE_ERROR
                                )

                            println(
                                "🎧 [BluetoothAudio] " +
                                    "SCO broadcast state: $state"
                            )

                            when (state) {

                                AudioManager.SCO_AUDIO_STATE_CONNECTING -> {

                                    println(
                                        "🔄 [BluetoothAudio] " +
                                            "SCO_AUDIO_STATE_CONNECTING"
                                    )
                                }

                                AudioManager.SCO_AUDIO_STATE_CONNECTED -> {

                                    println(
                                        "✅ [BluetoothAudio] " +
                                            "SCO_AUDIO_STATE_CONNECTED"
                                    )

                                    try {
                                        reactApplicationContext
                                            .unregisterReceiver(this)
                                    } catch (_: Exception) {
                                    }

                                    println(
                                        "🎤 [BluetoothAudio] " +
                                            "SCO connected. " +
                                            "Creating AudioRecord..."
                                    )

                                    createAndStartAudioRecord(
                                        bluetoothInput,
                                        promise
                                    )
                                }

                                AudioManager.SCO_AUDIO_STATE_DISCONNECTED -> {

                                    println(
                                        "⚠️ [BluetoothAudio] " +
                                            "SCO_AUDIO_STATE_DISCONNECTED"
                                    )
                                }

                                AudioManager.SCO_AUDIO_STATE_ERROR -> {

                                    println(
                                        "❌ [BluetoothAudio] " +
                                            "SCO_AUDIO_STATE_ERROR"
                                    )

                                    try {
                                        reactApplicationContext
                                            .unregisterReceiver(this)
                                    } catch (_: Exception) {
                                    }

                                    promise.reject(
                                        "BLUETOOTH_SCO_ERROR",
                                        "Bluetooth SCO connection failed"
                                    )
                                }
                            }
                        }
                    }

                // ------------------------------------------------
                // REGISTER RECEIVER
                // ------------------------------------------------

                println(
                    "🎧 [BluetoothAudio] " +
                        "Registering SCO receiver..."
                )

                reactApplicationContext.registerReceiver(
                    receiver,
                    IntentFilter(
                        AudioManager.ACTION_SCO_AUDIO_STATE_UPDATED
                    )
                )

                println(
                    "🎧 [BluetoothAudio] " +
                        "SCO receiver registered"
                )

                // ------------------------------------------------
                // START SCO
                // ------------------------------------------------

                println(
                    "🎧 [BluetoothAudio] " +
                        "Starting Bluetooth SCO..."
                )

                audioManager.startBluetoothSco()

                println(
                    "🎧 [BluetoothAudio] " +
                        "startBluetoothSco() called"
                )

                println(
                    "🎧 [BluetoothAudio] " +
                        "isBluetoothScoOn BEFORE = " +
                        "${audioManager.isBluetoothScoOn}"
                )

                audioManager.isBluetoothScoOn = true

                println(
                    "🎧 [BluetoothAudio] " +
                        "isBluetoothScoOn AFTER = " +
                        "${audioManager.isBluetoothScoOn}"
                )

                println(
                    "🎧 [BluetoothAudio] " +
                        "Waiting for SCO_CONNECTED..."
                )

                // Promise буде завершена всередині receiver.
                return
            }

            // ----------------------------------------------------
            // ANDROID 12+
            // ----------------------------------------------------

            promise.reject(
                "ANDROID_12_PATH_NOT_IMPLEMENTED",
                "Modern Bluetooth communication path is not implemented yet"
            )

        } catch (e: Exception) {

            println(
                "❌ [BluetoothAudio] " +
                    "testBluetoothScoAudioRecord() ERROR: " +
                    "${e.message}"
            )

            e.printStackTrace()

            promise.reject(
                "BLUETOOTH_SCO_AUDIO_ERROR",
                e
            )
        }
    }

    // ============================================================
    // CREATE AUDIO RECORD AFTER SCO CONNECTED
    // ============================================================

    private fun createAndStartAudioRecord(
        bluetoothInput: AudioDeviceInfo,
        promise: Promise
    ) {

        try {

            val sampleRate = 16000

            val channelConfig =
                AudioFormat.CHANNEL_IN_MONO

            val audioEncoding =
                AudioFormat.ENCODING_PCM_16BIT

            val minBufferSize =
                AudioRecord.getMinBufferSize(
                    sampleRate,
                    channelConfig,
                    audioEncoding
                )

            println(
                "🎤 [BluetoothAudio] " +
                    "AudioRecord minBufferSize: $minBufferSize"
            )

            if (
                minBufferSize == AudioRecord.ERROR ||
                minBufferSize == AudioRecord.ERROR_BAD_VALUE
            ) {

                promise.reject(
                    "AUDIO_RECORD_BUFFER_ERROR",
                    "Invalid AudioRecord buffer size: $minBufferSize"
                )

                return
            }

            val bufferSize =
                maxOf(
                    minBufferSize,
                    sampleRate / 2
                )

            println(
                "🎤 [BluetoothAudio] " +
                    "Creating AudioRecord after SCO..."
            )

            val audioRecord =
                AudioRecord(
                    MediaRecorder.AudioSource.MIC,
                    sampleRate,
                    channelConfig,
                    audioEncoding,
                    bufferSize
                )

            println(
                "🎤 [BluetoothAudio] " +
                    "AudioRecord created"
            )

            println(
                "🎤 [BluetoothAudio] " +
                    "AudioRecord state: ${audioRecord.state}"
            )

            if (
                audioRecord.state !=
                AudioRecord.STATE_INITIALIZED
            ) {

                audioRecord.release()

                promise.reject(
                    "AUDIO_RECORD_INIT_FAILED",
                    "AudioRecord could not be initialized"
                )

                return
            }

            // ----------------------------------------------------
            // PREFERRED DEVICE
            // ----------------------------------------------------

            println(
                "🎧 [BluetoothAudio] " +
                    "Setting preferred Bluetooth device..."
            )

            val preferredDeviceSet =
                audioRecord.setPreferredDevice(
                    bluetoothInput
                )

            println(
                "🎧 [BluetoothAudio] " +
                    "setPreferredDevice(): " +
                    "$preferredDeviceSet"
            )

            val preferredDevice =
                audioRecord.preferredDevice

            if (preferredDevice != null) {

                println(
                    "🎧 [BluetoothAudio] " +
                        "Preferred device: " +
                        "id=${preferredDevice.id}, " +
                        "type=${preferredDevice.type}, " +
                        "name=${preferredDevice.productName}"
                )
            }

            // ----------------------------------------------------
            // START RECORDING
            // ----------------------------------------------------

            println(
                "🎤 [BluetoothAudio] " +
                    "Starting AudioRecord..."
            )

            audioRecord.startRecording()

            println(
                "🎤 [BluetoothAudio] " +
                    "Recording state: " +
                    "${audioRecord.recordingState}"
            )

            if (
                audioRecord.recordingState !=
                AudioRecord.RECORDSTATE_RECORDING
            ) {

                audioRecord.release()

                promise.reject(
                    "AUDIO_RECORD_START_FAILED",
                    "AudioRecord did not start"
                )

                return
            }

            testAudioRecord = audioRecord

            // ----------------------------------------------------
            // AUDIO MONITORING
            // ----------------------------------------------------

            testRecordingThread =
                Thread {

                    val buffer =
                        ShortArray(1600)

                    println(
                        "🎤 [BluetoothAudio] " +
                            "Audio monitoring started"
                    )

                    while (
                        !Thread.currentThread().isInterrupted &&
                        testAudioRecord === audioRecord
                    ) {

                        try {

                            val read =
                                audioRecord.read(
                                    buffer,
                                    0,
                                    buffer.size
                                )

                            if (read > 0) {

                                var sumSquares = 0.0

                                for (i in 0 until read) {

                                    val sample =
                                        buffer[i].toDouble()

                                    sumSquares +=
                                        sample * sample
                                }

                                val rms =
                                    sqrt(
                                        sumSquares / read
                                    )

                                println(
                                    "🎤 [BluetoothAudio] " +
                                        "Audio RMS: " +
                                        "%.2f".format(rms)
                                )

                            } else {

                                println(
                                    "⚠️ [BluetoothAudio] " +
                                        "AudioRecord.read(): $read"
                                )
                            }

                        } catch (e: Exception) {

                            println(
                                "❌ [BluetoothAudio] " +
                                    "Audio read error: " +
                                    "${e.message}"
                            )

                            break
                        }
                    }

                    println(
                        "🎤 [BluetoothAudio] " +
                            "Audio monitoring stopped"
                    )
                }

            testRecordingThread?.start()

            promise.resolve(
                "Bluetooth SCO connected and AudioRecord started: " +
                    "${bluetoothInput.productName}"
            )

        } catch (e: Exception) {

            println(
                "❌ [BluetoothAudio] " +
                    "createAndStartAudioRecord() ERROR: " +
                    "${e.message}"
            )

            e.printStackTrace()

            promise.reject(
                "AUDIO_RECORD_ERROR",
                e
            )
        }
    }

    // ============================================================
    // STOP
    // ============================================================

    @ReactMethod
    fun stopBluetoothAudioRecord() {

        println(
            "🎤 [BluetoothAudio] " +
                "stopBluetoothAudioRecord()"
        )

        stopBluetoothAudioRecordInternal()
    }

    private fun stopBluetoothAudioRecordInternal() {

        testRecordingThread?.interrupt()
        testRecordingThread = null

        val record = testAudioRecord
        testAudioRecord = null

        if (record != null) {

            try {

                if (
                    record.recordingState ==
                    AudioRecord.RECORDSTATE_RECORDING
                ) {
                    record.stop()
                }

            } catch (e: Exception) {

                println(
                    "⚠️ [BluetoothAudio] " +
                        "AudioRecord stop error: " +
                        "${e.message}"
                )
            }

            try {
                record.release()
            } catch (e: Exception) {

                println(
                    "⚠️ [BluetoothAudio] " +
                        "AudioRecord release error: " +
                        "${e.message}"
                )
            }
        }

        // Зупиняємо legacy SCO після завершення тесту.
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.S) {

            try {
                audioManager.isBluetoothScoOn = false
                audioManager.stopBluetoothSco()

                println(
                    "🎧 [BluetoothAudio] " +
                        "Bluetooth SCO stopped"
                )
            } catch (e: Exception) {

                println(
                    "⚠️ [BluetoothAudio] " +
                        "SCO stop error: ${e.message}"
                )
            }
        }
    }

    // ============================================================
    // DEVICE TYPE NAME
    // ============================================================

    private fun getDeviceTypeName(type: Int): String {

        return when (type) {

            AudioDeviceInfo.TYPE_BUILTIN_MIC ->
                "BUILTIN_MIC"

            AudioDeviceInfo.TYPE_BUILTIN_SPEAKER ->
                "BUILTIN_SPEAKER"

            AudioDeviceInfo.TYPE_BLUETOOTH_SCO ->
                "BLUETOOTH_SCO"

            AudioDeviceInfo.TYPE_BLUETOOTH_A2DP ->
                "BLUETOOTH_A2DP"

            AudioDeviceInfo.TYPE_WIRED_HEADSET ->
                "WIRED_HEADSET"

            AudioDeviceInfo.TYPE_WIRED_HEADPHONES ->
                "WIRED_HEADPHONES"

            AudioDeviceInfo.TYPE_USB_HEADSET ->
                "USB_HEADSET"

            AudioDeviceInfo.TYPE_USB_DEVICE ->
                "USB_DEVICE"

            AudioDeviceInfo.TYPE_USB_ACCESSORY ->
                "USB_ACCESSORY"

            else ->
                "TYPE_$type"
        }
    }
}