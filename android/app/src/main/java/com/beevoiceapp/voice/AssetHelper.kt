package com.beevoiceapp.voice

import android.content.Context
import java.io.File
import java.io.FileOutputStream

object AssetHelper {

    fun copyAssetFolder(context: Context, assetFolder: String, destPath: String) {
        val assetManager = context.assets
        val files = assetManager.list(assetFolder) ?: return

        val destDir = File(destPath)
        if (!destDir.exists()) destDir.mkdirs()

        for (file in files) {
            val fullPath = "$assetFolder/$file"
            val subFiles = assetManager.list(fullPath)

            if (subFiles.isNullOrEmpty()) {
                copyFile(context, fullPath, "$destPath/$file")
            } else {
                copyAssetFolder(context, fullPath, "$destPath/$file")
            }
        }
    }

    private fun copyFile(context: Context, assetPath: String, destPath: String) {
        val input = context.assets.open(assetPath)
        val output = FileOutputStream(destPath)

        input.copyTo(output)

        input.close()
        output.close()
    }
}