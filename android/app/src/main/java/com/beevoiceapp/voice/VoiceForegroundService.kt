package com.beevoiceapp.voice

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.Service
import android.content.Context
import android.content.Intent
import android.os.Build
import android.os.IBinder
import android.util.Log
import androidx.core.app.NotificationCompat
import com.facebook.react.bridge.WritableMap
import com.facebook.react.modules.core.DeviceEventManagerModule

class VoiceForegroundService : Service() {

    companion object {
        private const val TAG = "VoiceService"
        private const val CHANNEL_ID = "beevoice_channel"
        private const val CHANNEL_NAME = "BeeVoice Background Service"
        private const val NOTIFICATION_ID = 1
    }

    private var isRunning = false
    private lateinit var voiceCore: VoiceCore

    override fun onCreate() {
        super.onCreate()
        Log.d(TAG, "🟢 Service onCreate")

        createNotificationChannel()

        voiceCore = VoiceCore(this) { event, data ->
            sendEventToJS(event, data)
        }
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        Log.d(TAG, "🚀 Service onStartCommand")

        if (!isRunning) {
            val notification = createNotification()
            startForeground(NOTIFICATION_ID, notification)

            voiceCore.start()
            isRunning = true

            Log.d(TAG, "✅ VoiceCore started")
        } else {
            Log.d(TAG, "⚠️ Service already running")
        }

        return START_STICKY
    }

    override fun onDestroy() {
        super.onDestroy()

        Log.d(TAG, "🔴 Service onDestroy")

        if (isRunning) {
            voiceCore.stop()
            isRunning = false
        }

        stopForeground(true)
        stopSelf()
    }

    override fun onBind(intent: Intent?): IBinder? = null

    // 🔔 Notification

    private fun createNotification(): Notification {
        return NotificationCompat.Builder(this, CHANNEL_ID)
            .setContentTitle("BeeVoice працює")
            .setContentText("Слухаю команду...")
            .setSmallIcon(android.R.drawable.ic_btn_speak_now)
            .setOngoing(true)
            .setPriority(NotificationCompat.PRIORITY_LOW)
            .build()
    }

    private fun createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                CHANNEL_ID,
                CHANNEL_NAME,
                NotificationManager.IMPORTANCE_LOW
            )

            val manager = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
            manager.createNotificationChannel(channel)
        }
    }

    // 📡 Native → JS

    private fun sendEventToJS(event: String, params: WritableMap) {
        val reactContext = VoiceServiceModule.reactContext

        if (reactContext == null) {
            Log.e(TAG, "❌ ReactContext is NULL")
            return
        }

        Log.d(TAG, "📡 Sending event: $event")

        reactContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            .emit(event, params)
    }
}