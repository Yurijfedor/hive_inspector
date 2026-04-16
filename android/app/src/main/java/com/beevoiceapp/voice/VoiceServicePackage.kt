package com.beevoiceapp.voice

import com.facebook.react.ReactPackage
import com.facebook.react.bridge.*
import com.facebook.react.uimanager.ViewManager
import com.beevoiceapp.voice.VoiceServiceModule

class VoiceServicePackage : ReactPackage {
    override fun createNativeModules(reactContext: ReactApplicationContext)
        = listOf(VoiceServiceModule(reactContext))

    override fun createViewManagers(reactContext: ReactApplicationContext)
        = emptyList<ViewManager<*, *>>()
}