import { useState } from "react"
import { motion, AnimatePresence, Reorder } from "framer-motion"
import { ShieldCheck, ShieldAlert, GripVertical, CheckCircle2, XCircle, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn, shuffleArray } from "@/lib/utils"

const ITEMS = [
    { id: "1", text: "Using 'Password123' for all accounts", category: "risk", hint: "Reuse and weak patterns are easy to crack." },
    { id: "2", text: "Enabling Multi-Factor Authentication (MFA)", category: "safe", hint: "Adds a critical layer of defense." },
    { id: "3", text: "Leaving your laptop unlocked in a cafe", category: "risk", hint: "Physical access is a major vulnerability." },
    { id: "4", text: "Updating software as soon as patches arrive", category: "safe", hint: "Patches fix known security holes." },
    { id: "5", text: "Clicking 'Unsubscribe' in a spam email", category: "risk", hint: "Often confirms your email is active to spammers." },
    { id: "6", text: "Using a unique passphrase for each service", category: "safe", hint: "Isolation prevents credential stuffing." },
]

export default function SecuritySortGame() {
    const [items, setItems] = useState(shuffleArray(ITEMS))
    const [safeList, setSafeList] = useState<typeof ITEMS>([])
    const [riskList, setRiskList] = useState<typeof ITEMS>([])
    const [showResults, setShowResults] = useState(false)

    const handleSort = (item: typeof ITEMS[0], target: 'safe' | 'risk') => {
        setItems(prev => prev.filter(i => i.id !== item.id))
        if (target === 'safe') setSafeList(prev => [...prev, item])
        if (target === 'risk') setRiskList(prev => [...prev, item])
    }

    const handleReset = () => {
        setItems(shuffleArray(ITEMS))
        setSafeList([])
        setRiskList([])
        setShowResults(false)
    }

    const calculateScore = () => {
        let correct = 0
        safeList.forEach(item => { if (item.category === 'safe') correct++ })
        riskList.forEach(item => { if (item.category === 'risk') correct++ })
        return correct
    }

    const score = calculateScore()
    const finished = items.length === 0

    return (
        <div className="w-full max-w-4xl bg-zinc-50 rounded-3xl border border-zinc-200 p-8 shadow-sm">
            <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-zinc-900 mb-2">Category Challenge: Safe or Risk?</h3>
                <p className="text-zinc-500">Categorize the behaviors below to test your security intuition.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 items-start">
                {/* Safe Zone */}
                <div className={cn(
                    "bg-emerald-50/50 border-2 border-dashed border-emerald-200 rounded-2xl p-6 min-h-[350px] transition-all",
                    showResults ? "border-solid" : ""
                )}>
                    <div className="flex items-center gap-2 mb-6 text-emerald-700 font-bold">
                        <ShieldCheck className="w-5 h-5" /> SAFE
                    </div>
                    <div className="space-y-3">
                        {safeList.map(item => (
                            <motion.div
                                layoutId={item.id}
                                key={item.id}
                                className={cn(
                                    "p-4 bg-white rounded-xl shadow-sm border text-sm font-medium relative overflow-hidden",
                                    showResults && (item.category === 'safe' ? "border-emerald-500 bg-emerald-50" : "border-red-500 bg-red-50")
                                )}
                            >
                                {item.text}
                                {showResults && (
                                    <div className="mt-2 text-[10px] text-zinc-500 italic border-t pt-2">
                                        {item.hint}
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Central Deck */}
                <div className="flex flex-col gap-4">
                    <AnimatePresence>
                        {items.length > 0 ? (
                            <div className="space-y-3">
                                <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest text-center mb-2">Remaining: {items.length}</p>
                                {items.map((item, index) => (
                                    <motion.div
                                        key={item.id}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1 - index * 0.2, scale: 1 - index * 0.05, y: index * 4 }}
                                        className="p-5 bg-white rounded-2xl shadow-xl border border-zinc-200 text-sm font-bold text-zinc-800 flex items-center gap-3 cursor-default"
                                    >
                                        <GripVertical className="w-4 h-4 text-zinc-300" />
                                        <span className="flex-1">{item.text}</span>
                                    </motion.div>
                                ))}
                                <div className="flex gap-2 pt-4">
                                    <Button className="flex-1 bg-emerald-600 hover:bg-emerald-700 h-12" onClick={() => handleSort(items[0], 'safe')}>Safe</Button>
                                    <Button className="flex-1 bg-red-600 hover:bg-red-700 h-12" onClick={() => handleSort(items[0], 'risk')}>Risk</Button>
                                </div>
                            </div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-center py-12"
                            >
                                <div className="text-4xl font-black text-zinc-900 mb-2">{score}/{ITEMS.length}</div>
                                <p className="text-zinc-500 mb-6">Great session! You've sorted all behaviors.</p>
                                {!showResults ? (
                                    <Button onClick={() => setShowResults(true)} className="bg-zinc-900 text-white w-full">See Explanations</Button>
                                ) : (
                                    <Button onClick={handleReset} variant="outline" className="w-full gap-2 text-zinc-600">
                                        <RotateCcw className="w-4 h-4" /> Try Again
                                    </Button>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Risk Zone */}
                <div className={cn(
                    "bg-red-50/50 border-2 border-dashed border-red-200 rounded-2xl p-6 min-h-[350px] transition-all",
                    showResults ? "border-solid" : ""
                )}>
                    <div className="flex items-center gap-2 mb-6 text-red-700 font-bold">
                        <ShieldAlert className="w-5 h-5" /> RISK
                    </div>
                    <div className="space-y-3">
                        {riskList.map(item => (
                            <motion.div
                                layoutId={item.id}
                                key={item.id}
                                className={cn(
                                    "p-4 bg-white rounded-xl shadow-sm border text-sm font-medium relative overflow-hidden",
                                    showResults && (item.category === 'risk' ? "border-emerald-500 bg-emerald-50" : "border-red-500 bg-red-50")
                                )}
                            >
                                {item.text}
                                {showResults && (
                                    <div className="mt-2 text-[10px] text-zinc-500 italic border-t pt-2">
                                        {item.hint}
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
