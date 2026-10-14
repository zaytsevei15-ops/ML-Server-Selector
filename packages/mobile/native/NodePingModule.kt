package com.mlselector.nodeping

import com.facebook.react.ReactPackage
import com.facebook.react.bridge.*
import com.facebook.react.uimanager.ViewManager
import java.util.concurrent.Executors
import java.util.concurrent.TimeUnit
import java.util.concurrent.atomic.AtomicBoolean

// System ICMP executable, not a shell. Never accept hostnames or arbitrary arguments.
class NodePingModule(context: ReactApplicationContext) : ReactContextBaseJavaModule(context) {
    private val executor = Executors.newSingleThreadExecutor()
    private val busy = AtomicBoolean(false)
    @Volatile private var process: Process? = null
    override fun getName() = "NodePing"

    private fun publicIPv4(ip: String): Boolean {
        val parts = ip.split('.')
        if (parts.size != 4 || parts.any { !it.matches(Regex("[0-9]{1,3}")) || (it.length > 1 && it.startsWith("0")) }) return false
        val n = parts.map { it.toInt() }
        if (n.any { it !in 0..255 }) return false
        val a = n[0]; val b = n[1]; val c = n[2]
        return !(a == 0 || a == 10 || a == 127 || a >= 224 ||
            (a == 100 && b in 64..127) || (a == 169 && b == 254) ||
            (a == 172 && b in 16..31) || (a == 192 && (b == 168 || (b == 0 && c in listOf(0, 2)))) ||
            (a == 198 && (b in 18..19 || (b == 51 && c == 100))) || (a == 203 && b == 0 && c == 113))
    }

    @ReactMethod fun measure(ip: String, promise: Promise) {
        if (!publicIPv4(ip)) { promise.reject("INVALID_IP", "Public IPv4 required"); return }
        if (!busy.compareAndSet(false, true)) { promise.reject("BUSY", "Measurement already running"); return }
        executor.execute {
            try {
                val builder = ProcessBuilder("/system/bin/ping", "-n", "-c", "3", "-W", "2", "-w", "8", ip)
                builder.environment()["LC_ALL"] = "C"
                val p = builder.redirectErrorStream(true).start()
                process = p
                if (!p.waitFor(10, TimeUnit.SECONDS)) {
                    p.destroyForcibly()
                    promise.reject("PING_TIMEOUT", "ICMP measurement timed out")
                } else {
                    val output = p.inputStream.bufferedReader().use { it.readText().take(8192) }
                    if (output.contains("Operation not permitted", true) || output.contains("Permission denied", true)) {
                        promise.reject("ICMP_UNAVAILABLE", "System ICMP unavailable")
                    } else if (!Regex("[0-3] packets transmitted").containsMatchIn(output)) {
                        promise.reject("ICMP_UNAVAILABLE", "Unsupported system ping output")
                    } else {
                        // Avoid treating time<1 as an exact RTT. Android normally emits decimal time=.
                        val replies = Regex("icmp_seq[= ]([0-9]+).*?time=([0-9]+(?:\\.[0-9]+)?)\\s*ms").findAll(output)
                            .associate { it.groupValues[1] to it.groupValues[2].toDouble() }.values.take(3)
                        val samples = Arguments.createArray()
                        replies.forEach { samples.pushDouble(it) }
                        val result = Arguments.createMap()
                        result.putString("ip", ip)
                        result.putArray("samplesMs", samples)
                        result.putInt("sent", 3)
                        result.putDouble("measuredAt", System.currentTimeMillis().toDouble())
                        promise.resolve(result)
                    }
                }
            } catch (_: Exception) { promise.reject("ICMP_UNAVAILABLE", "System ICMP unavailable") }
            finally { process?.destroy(); process = null; busy.set(false) }
        }
    }
    override fun invalidate() {
        process?.destroyForcibly()
        executor.shutdownNow()
        super.invalidate()
    }
}

class NodePingPackage : ReactPackage {
    override fun createNativeModules(context: ReactApplicationContext): List<NativeModule> = listOf(NodePingModule(context))
    override fun createViewManagers(context: ReactApplicationContext): List<ViewManager<*, *>> = emptyList()
}