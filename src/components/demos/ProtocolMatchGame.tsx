import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle2, XCircle, RotateCcw, Trophy } from "lucide-react"
import { cn } from "@/lib/utils"
import { api } from "@/lib/api"

interface MatchPair {
    protocol: string
    port: string
}

// Data fetched from API

export default function ProtocolMatchGame() {
    const [selectedProtocol, setSelectedProtocol] = useState<string | null>(null)
    const [matches, setMatches] = useState<Record<string, string>>({})
    const [wrongPair, setWrongPair] = useState<{ protocol: string; port: string } | null>(null)
    const [shakeProtocol, setShakeProtocol] = useState<string | null>(null)
    const [pairs, setPairs] = useState<MatchPair[]>([])
    const [shuffledPorts, setShuffledPorts] = useState<string[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        api.get('/api/demos/protocol_match')
            .then(res => {
                const data = res.data
                setPairs(data)
                // Shuffle ports uniquely
                const ports = data.map((p: MatchPair) => p.port)
                for (let i = ports.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [ports[i], ports[j]] = [ports[j], ports[i]];
                }
                setShuffledPorts(ports)
                setLoading(false)
            })
            .catch(err => {
                console.error(err)
                setLoading(false)
            })
    }, [])

    const isCompleted = pairs.length > 0 && Object.keys(matches).length === pairs.length
    const correctMap: Record<string, string> = {}
    pairs.forEach((p) => (correctMap[p.protocol] = p.port))

    const matchedPorts = new Set(Object.values(matches))

    const handleProtocolClick = (protocol: string) => {
        if (matches[protocol]) return // already matched
        setSelectedProtocol(protocol === selectedProtocol ? null : protocol)
        setWrongPair(null)
    }

    const handlePortClick = (port: string) => {
        if (!selectedProtocol || matchedPorts.has(port)) return

        if (correctMap[selectedProtocol] === port) {
            // Correct match
            setMatches((prev) => ({ ...prev, [selectedProtocol]: port }))
            setSelectedProtocol(null)
            setWrongPair(null)
        } else {
            // Wrong match
            setWrongPair({ protocol: selectedProtocol, port })
            setShakeProtocol(selectedProtocol)
            setTimeout(() => {
                setWrongPair(null)
                setShakeProtocol(null)
            }, 800)
        }
    }

    const handleReset = () => {
        setMatches({})
        setSelectedProtocol(null)
        setWrongPair(null)
        setShakeProtocol(null)
    }

    if (loading) {
        return <div className="p-8 text-center text-zinc-500">Loading protocol game...</div>
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-zinc-200 p-6 relative overflow-hidden">
            <div className="flex items-center justify-between mb-5">
                <h4 className="font-bold text-zinc-900">Match the protocol to the port</h4>
                {Object.keys(matches).length > 0 && (
                    <button
                        onClick={handleReset}
                        className="text-zinc-400 hover:text-zinc-600 transition-colors p-1"
                        aria-label="Reset"
                    >
                        <RotateCcw className="w-4 h-4" />
                    </button>
                )}
            </div>

            <AnimatePresence>
                {isCompleted && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-white/95 backdrop-blur-sm z-20 flex flex-col items-center justify-center rounded-xl"
                    >
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 200, damping: 12, delay: 0.1 }}
                            className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4"
                        >
                            <Trophy className="w-8 h-8 text-emerald-600" />
                        </motion.div>
                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="font-bold text-lg text-zinc-900 mb-1"
                        >
                            All matched!
                        </motion.p>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="text-sm text-zinc-500 mb-4"
                        >
                            Great job on the networking basics.
                        </motion.p>
                        <motion.button
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.7 }}
                            onClick={handleReset}
                            className="text-sm font-medium text-indigo-600 hover:text-indigo-700 underline underline-offset-2"
                        >
                            Play Again
                        </motion.button>
                    </motion.div>
                )}
            </AnimatePresence>

            <p className="text-xs text-zinc-500 mb-4">Click a protocol, then click its matching port.</p>

            <div className="grid grid-cols-2 gap-4">
                {/* Protocols Column */}
                <div className="space-y-2">
                    {pairs.map((pair) => {
                        const isMatched = !!matches[pair.protocol]
                        const isSelected = selectedProtocol === pair.protocol
                        const isWrong = wrongPair?.protocol === pair.protocol
                        const shouldShake = shakeProtocol === pair.protocol

                        return (
                            <motion.div
                                key={pair.protocol}
                                onClick={() => handleProtocolClick(pair.protocol)}
                                animate={
                                    shouldShake
                                        ? { x: [0, -6, 6, -6, 6, 0] }
                                        : {}
                                }
                                transition={{ duration: 0.4 }}
                                className={cn(
                                    "p-3 rounded-lg text-center text-sm font-medium border-2 transition-all cursor-pointer select-none",
                                    isMatched
                                        ? "bg-emerald-50 border-emerald-300 text-emerald-700"
                                        : isWrong
                                            ? "bg-red-50 border-red-300 text-red-700"
                                            : isSelected
                                                ? "bg-indigo-50 border-indigo-400 text-indigo-700 ring-2 ring-indigo-200"
                                                : "bg-zinc-100 border-zinc-200 text-zinc-700 hover:border-indigo-300 hover:bg-indigo-50/50"
                                )}
                            >
                                <div className="flex items-center justify-center gap-2">
                                    {isMatched && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                                    {isWrong && <XCircle className="w-4 h-4 text-red-500" />}
                                    {pair.protocol}
                                </div>
                            </motion.div>
                        )
                    })}
                </div>

                {/* Ports Column */}
                <div className="space-y-2">
                    {shuffledPorts.map((port) => {
                        const isMatched = matchedPorts.has(port)
                        const isWrong = wrongPair?.port === port

                        return (
                            <motion.div
                                key={port}
                                onClick={() => handlePortClick(port)}
                                whileHover={!isMatched ? { scale: 1.03 } : {}}
                                whileTap={!isMatched ? { scale: 0.97 } : {}}
                                className={cn(
                                    "p-3 rounded-lg text-center text-sm font-medium border-2 transition-all select-none",
                                    isMatched
                                        ? "bg-emerald-50 border-emerald-300 text-emerald-700 cursor-default"
                                        : isWrong
                                            ? "bg-red-50 border-red-300 text-red-700 cursor-pointer"
                                            : selectedProtocol
                                                ? "bg-white border-indigo-200 text-zinc-700 shadow-sm cursor-pointer hover:border-indigo-400 hover:shadow-md"
                                                : "bg-white border-zinc-200 text-zinc-500 cursor-default opacity-70"
                                )}
                            >
                                <div className="flex items-center justify-center gap-2">
                                    {isMatched && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                                    {isWrong && <XCircle className="w-4 h-4 text-red-500" />}
                                    {port}
                                </div>
                            </motion.div>
                        )
                    })}
                </div>
            </div>

            {/* Progress indicator */}
            <div className="mt-4 flex items-center gap-2">
                {pairs.map((_, i) => (
                    <div
                        key={i}
                        className={cn(
                            "h-1.5 flex-1 rounded-full transition-colors duration-500",
                            i < Object.keys(matches).length ? "bg-emerald-400" : "bg-zinc-100"
                        )}
                    />
                ))}
            </div>
        </div>
    )
}
