import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ShieldAlert, AlertCircle, CheckCircle2, Info, Mail, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { api } from "@/lib/api"

interface RedFlag {
    id: string
    label: string
    description: string
    position: string
}

export default function PhishingSimulator() {
    const [redFlags, setRedFlags] = useState<RedFlag[]>([])
    const [loading, setLoading] = useState(true)
    const [foundFlags, setFoundFlags] = useState<string[]>([])
    const [showResults, setShowResults] = useState(false)

    useEffect(() => {
        api.get('/api/demos/phishing_simulator')
            .then(res => {
                setRedFlags(res.data)
                setLoading(false)
            })
            .catch(err => {
                console.error("Failed to load phishing simulator data:", err)
                setLoading(false)
            })
    }, [])

    const toggleFlag = (id: string) => {
        if (showResults) return
        setFoundFlags(prev =>
            prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
        )
    }

    const allFound = foundFlags.length === redFlags.length

    if (loading || redFlags.length === 0) {
        return <div className="p-8 text-center text-zinc-500 bg-white rounded-3xl border border-zinc-200">Loading simulator...</div>
    }

    return (
        <div className="w-full max-w-3xl bg-white rounded-3xl border border-zinc-200 shadow-xl overflow-hidden">
            {/* Simulator Header */}
            <div className="bg-zinc-900 p-4 text-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center">
                        <Mail className="w-5 h-5" />
                    </div>
                    <p className="font-bold text-sm tracking-tight">Security Sandbox: Email Inspector</p>
                </div>
                <Badge variant="outline" className="text-zinc-400 border-zinc-700">
                    {foundFlags.length} / {redFlags.length} Red Flags Found
                </Badge>
            </div>

            <div className="p-8">
                <div className="mb-6 flex items-start gap-3 p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
                    <Search className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                    <p className="text-sm text-indigo-900 leading-relaxed">
                        <strong>Task:</strong> This email was flagged by our filters. Click on parts of the email that look suspicious to report them as "Red Flags".
                    </p>
                </div>

                {/* Email Interface */}
                <div className="relative border-2 border-zinc-100 rounded-2xl bg-white p-6 shadow-sm">
                    {/* Sender & Subject */}
                    <div className="border-b border-zinc-100 pb-4 mb-6 relative">
                        <div className="flex gap-2 text-sm mb-1">
                            <span className="text-zinc-400 w-16">From:</span>
                            <span className={cn(
                                "font-medium cursor-pointer rounded px-1 transition-colors",
                                foundFlags.includes('sender') ? "bg-red-100 text-red-700" : "hover:bg-zinc-50"
                            )} onClick={() => toggleFlag('sender')}>
                                Performova IT Support &lt;admin@it-support.performova.net&gt;
                            </span>
                        </div>
                        <div className="flex gap-2 text-sm">
                            <span className="text-zinc-400 w-16">Subject:</span>
                            <span className="font-bold text-zinc-900">[URGENT] Final Notice: Security Update Required</span>
                        </div>
                    </div>

                    {/* Email Body */}
                    <div className="space-y-4 text-zinc-700 leading-relaxed relative">
                        <p>Dear Valued Employee,</p>
                        <p className={cn(
                            "cursor-pointer rounded px-1 transition-colors",
                            foundFlags.includes('urgency') ? "bg-red-100 text-red-700" : "hover:bg-zinc-50"
                        )} onClick={() => toggleFlag('urgency')}>
                            Our records show your security certificate has expired. To maintain access to company systems, you MUST update your credentials within the next 24 hours.
                        </p>
                        <p>Failure to comply will result in an immediate account suspension for security reasons.</p>
                        <div className="py-2">
                            <button
                                className={cn(
                                    "px-6 py-3 rounded-lg font-bold transition-all",
                                    foundFlags.includes('link') ? "bg-red-500 text-white" : "bg-indigo-600 text-white"
                                )}
                                onClick={() => toggleFlag('link')}
                            >
                                Update My Credentials Now
                            </button>
                            <p className="text-[10px] text-zinc-400 mt-2 font-mono">https://secure-login-portal.co/auth/update</p>
                        </div>
                        <p>Best regards,<br />Central IT Infrastructure</p>
                    </div>

                    {/* Feedback Overlay */}
                    <AnimatePresence>
                        {showResults && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="absolute inset-0 bg-white/95 backdrop-blur-sm z-20 flex flex-col items-center justify-center p-8 text-center"
                            >
                                {allFound ? (
                                    <>
                                        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
                                            <ShieldAlert className="w-8 h-8 text-emerald-600" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-zinc-900 mb-2">Perfect Score!</h3>
                                        <p className="text-zinc-600 mb-8">You successfully identified every red flag in this phishing attempt. You've made our company safer.</p>
                                    </>
                                ) : (
                                    <>
                                        <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-6">
                                            <AlertCircle className="w-8 h-8 text-amber-600" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-zinc-900 mb-2">Almost There</h3>
                                        <p className="text-zinc-600 mb-8">You found {foundFlags.length} of {redFlags.length} red flags. Review the highlighted areas below to see what you missed.</p>
                                    </>
                                )}
                                <Button onClick={() => setShowResults(false)} className="bg-indigo-600 text-white">Review Red Flags</Button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Flag Explanations */}
                <div className="mt-8 space-y-4">
                    <h4 className="font-bold text-zinc-900 flex items-center gap-2">
                        <Info className="w-4 h-4 text-indigo-500" /> Identified Red Flags
                    </h4>
                    <div className="grid gap-3">
                        {redFlags.map(flag => (
                            <div key={flag.id} className={cn(
                                "p-4 rounded-xl border transition-all flex items-start gap-4",
                                foundFlags.includes(flag.id)
                                    ? "bg-red-50 border-red-100"
                                    : "bg-zinc-50 border-zinc-100 opacity-60"
                            )}>
                                <div className={cn(
                                    "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                                    foundFlags.includes(flag.id) ? "bg-red-500 text-white" : "bg-zinc-200 text-zinc-400"
                                )}>
                                    {foundFlags.includes(flag.id) ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                                </div>
                                <div>
                                    <p className="font-bold text-sm text-zinc-900">{flag.label}</p>
                                    {foundFlags.includes(flag.id) && <p className="text-xs text-red-700 mt-1">{flag.description}</p>}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-8 flex justify-end">
                    <Button
                        onClick={() => setShowResults(true)}
                        size="lg"
                        className="bg-zinc-900 text-white"
                        disabled={foundFlags.length === 0}
                    >
                        Analyze Findings
                    </Button>
                </div>
            </div>
        </div>
    )
}
