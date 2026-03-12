import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { User, Shield, MessageSquare, Send, AlertTriangle, CheckCircle2, XCircle, Info, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

type Message = {
    id: string
    sender: 'attacker' | 'user'
    text: string
    timestamp: string
}

type ScenarioStage = {
    attackerMessage: string
    options: {
        text: string
        isSecure: boolean
        feedback: string
        nextStageId?: string
    }[]
}


export default function ChatSimulator() {
    const [scenario, setScenario] = useState<Record<string, ScenarioStage> | null>(null)
    const [loading, setLoading] = useState(true)
    const [messages, setMessages] = useState<Message[]>([])
    const [currentStageId, setCurrentStageId] = useState<string | null>("start")
    const [gameState, setGameState] = useState<'playing' | 'won' | 'lost'>('playing')
    const [lastFeedback, setLastFeedback] = useState<string | null>(null)
    const [isAttackerTyping, setIsAttackerTyping] = useState(false)
    const chatEndRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        fetch('/api/demos/chat_scenario')
            .then(res => res.json())
            .then(data => {
                setScenario(data)
                setLoading(false)
            })
            .catch(err => {
                console.error(err)
                setLoading(false)
            })
    }, [])

    useEffect(() => {
        if (loading || !scenario) return;

        if (currentStageId && gameState === 'playing') {
            setIsAttackerTyping(true)
            const timer = setTimeout(() => {
                const stage = scenario[currentStageId]
                const newMessage: Message = {
                    id: Date.now().toString(),
                    sender: 'attacker',
                    text: stage.attackerMessage,
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                }
                setMessages(prev => [...prev, newMessage])
                setIsAttackerTyping(false)
            }, 1500)
            return () => clearTimeout(timer)
        }
    }, [currentStageId, gameState])

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages, isAttackerTyping])

    const handleOptionSelect = (option: ScenarioStage['options'][0]) => {
        const userMessage: Message = {
            id: (Date.now() + 1).toString(),
            sender: 'user',
            text: option.text,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
        setMessages(prev => [...prev, userMessage])
        setLastFeedback(option.feedback)

        if (!option.isSecure) {
            setGameState('lost')
        } else if (option.nextStageId === 'success') {
            setGameState('won')
        } else if (option.nextStageId) {
            setCurrentStageId(option.nextStageId)
        }
    }

    const reset = () => {
        setMessages([])
        setCurrentStageId("start")
        setGameState('playing')
        setLastFeedback(null)
    }

    return (
        <div className="w-full max-w-2xl bg-white rounded-3xl border border-zinc-200 shadow-2xl overflow-hidden flex flex-col h-[650px]">
            {/* Header */}
            <div className="bg-zinc-900 p-4 text-white flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <p className="font-bold text-sm tracking-tight">Internal Messaging Portal</p>
                        <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                            <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Secure Channel</span>
                        </div>
                    </div>
                </div>
                <Badge variant="secondary" className="bg-zinc-800 text-zinc-300 border-none">Simulation</Badge>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-zinc-50/50">
                <div className="text-center py-4">
                    <Badge variant="outline" className="text-[10px] text-zinc-400 border-zinc-200">Conversation started today</Badge>
                </div>

                {messages.map((m) => (
                    <motion.div
                        key={m.id}
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        className={cn(
                            "flex flex-col max-w-[85%] space-y-1",
                            m.sender === 'user' ? "ml-auto items-end" : "items-start"
                        )}
                    >
                        <div className={cn(
                            "p-4 rounded-2xl text-sm leading-relaxed shadow-sm",
                            m.sender === 'user'
                                ? "bg-indigo-600 text-white rounded-tr-none"
                                : "bg-white border border-zinc-200 text-zinc-800 rounded-tl-none"
                        )}>
                            {m.text}
                        </div>
                        <span className="text-[10px] text-zinc-400 font-medium px-2">{m.timestamp}</span>
                    </motion.div>
                ))}

                {isAttackerTyping && (
                    <div className="flex items-center gap-1 p-2">
                        <span className="w-1.5 h-1.5 bg-zinc-300 rounded-full animate-bounce [animation-delay:-0.3s]" />
                        <span className="w-1.5 h-1.5 bg-zinc-300 rounded-full animate-bounce [animation-delay:-0.15s]" />
                        <span className="w-1.5 h-1.5 bg-zinc-300 rounded-full animate-bounce" />
                    </div>
                )}
                <div ref={chatEndRef} />
            </div>

            {/* Input / Options Area */}
            <div className="p-6 bg-white border-t border-zinc-200 shrink-0 min-h-[150px]">
                {gameState === 'playing' ? (
                    <div className="space-y-3">
                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                            <MessageSquare className="w-3 h-3" /> Select your response
                        </p>
                        <div className="flex flex-col gap-2 animate-in slide-in-from-bottom-2 fade-in duration-500">
                            {!isAttackerTyping && currentStageId && scenario && scenario[currentStageId].options.map((opt, i) => (
                                <button
                                    key={i}
                                    onClick={() => handleOptionSelect(opt)}
                                    className="text-left p-3 rounded-xl border border-zinc-200 hover:border-indigo-500 hover:bg-indigo-50 transition-all text-sm font-medium text-zinc-700"
                                >
                                    {opt.text}
                                </button>
                            ))}
                        </div>
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className={cn(
                            "p-6 rounded-2xl border flex flex-col items-center text-center",
                            gameState === 'won' ? "bg-emerald-50 border-emerald-100" : "bg-red-50 border-red-100"
                        )}
                    >
                        <div className={cn(
                            "w-12 h-12 rounded-full flex items-center justify-center mb-4",
                            gameState === 'won' ? "bg-emerald-500 text-white" : "bg-red-500 text-white"
                        )}>
                            {gameState === 'won' ? <Shield className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
                        </div>
                        <h4 className={cn("text-lg font-bold mb-2", gameState === 'won' ? "text-emerald-900" : "text-red-900")}>
                            {gameState === 'won' ? "Security Intact" : "Breach Detected"}
                        </h4>
                        <p className="text-sm text-zinc-600 mb-6 max-w-md">{lastFeedback}</p>
                        <Button onClick={reset} variant="outline" className="gap-2 bg-white">
                            <RefreshCw className="w-4 h-4" /> Try Scenario Again
                        </Button>
                    </motion.div>
                )}
            </div>
        </div>
    )
}
