import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Lock, Eye, EyeOff, ShieldCheck, ShieldAlert, CheckCircle2, XCircle, Info, Clock, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export default function PasswordChallenge() {
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)

    const analysis = useMemo(() => {
        const checks = {
            length: password.length >= 12,
            caps: /[A-Z]/.test(password),
            numbers: /[0-9]/.test(password),
            symbols: /[^A-Za-z0-9]/.test(password),
            common: /(password|12345|qwerty|admin)/i.test(password) && password.length > 0
        }

        let score = 0
        if (checks.length) score += 25
        if (checks.caps) score += 25
        if (checks.numbers) score += 25
        if (checks.symbols) score += 25
        if (checks.common) score = Math.max(0, score - 50)

        let strength = "Very Weak"
        let color = "bg-red-500"
        let crackTime = "Instant"

        if (score >= 25) { strength = "Weak"; color = "bg-orange-500"; crackTime = "Minutes" }
        if (score >= 50) { strength = "Moderate"; color = "bg-yellow-500"; crackTime = "Weeks" }
        if (score >= 75) { strength = "Strong"; color = "bg-emerald-500"; crackTime = "Years" }
        if (score >= 100) { strength = "Exceptional"; color = "bg-indigo-600"; crackTime = "Centuries" }

        return { score, strength, color, crackTime, checks }
    }, [password])

    return (
        <div className="w-full max-w-2xl bg-white rounded-3xl border border-zinc-200 shadow-xl overflow-hidden">
            <div className="bg-indigo-600 p-6 text-white text-center">
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Lock className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold">The Great Password Wall</h3>
                <p className="text-indigo-100 text-sm mt-1">Can you create a password that would take a computer centuries to crack?</p>
            </div>

            <div className="p-8">
                <div className="relative mb-8">
                    <Input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Type a super secure password..."
                        className="h-14 pl-12 pr-12 text-lg rounded-xl border-2 focus:border-indigo-500 transition-all font-mono"
                    />
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                    <button
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors"
                    >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                </div>

                {/* Strength Meter */}
                <div className="space-y-6 mb-8">
                    <div className="flex justify-between items-end">
                        <div>
                            <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1">Strength</p>
                            <p className={cn("text-xl font-black transition-colors",
                                analysis.score < 50 ? "text-red-600" :
                                    analysis.score < 75 ? "text-orange-600" : "text-emerald-600"
                            )}>
                                {analysis.strength}
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1">Estimated Time To Crack</p>
                            <div className="flex items-center gap-2 justify-end text-zinc-900 font-bold">
                                <Clock className="w-4 h-4 text-indigo-500" /> {analysis.crackTime}
                            </div>
                        </div>
                    </div>

                    <div className="h-3 w-full bg-zinc-100 rounded-full overflow-hidden flex gap-0.5">
                        {[1, 2, 3, 4].map((step) => {
                            const stepValue = step * 25
                            const isActive = analysis.score >= stepValue
                            return (
                                <motion.div
                                    key={step}
                                    initial={false}
                                    animate={{
                                        flex: isActive ? 1 : 1,
                                        backgroundColor: isActive ?
                                            (analysis.score < 50 ? "#ef4444" : analysis.score < 75 ? "#f59e0b" : "#10b981")
                                            : "#f4f4f5"
                                    }}
                                    className="h-full rounded-sm"
                                />
                            )
                        })}
                    </div>
                </div>

                {/* Checklist */}
                <div className="grid sm:grid-cols-2 gap-4 bg-zinc-50 p-6 rounded-2xl border border-zinc-100">
                    <div className="flex items-center gap-3">
                        <div className={cn(
                            "w-5 h-5 rounded-full flex items-center justify-center shrink-0",
                            analysis.checks.length ? "bg-emerald-100 text-emerald-600" : "bg-zinc-200 text-zinc-400"
                        )}>
                            <CheckCircle2 className="w-3.5 h-3.5" />
                        </div>
                        <span className={cn("text-sm transition-colors", analysis.checks.length ? "text-zinc-900 font-bold" : "text-zinc-400")}>
                            12+ Characters
                        </span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className={cn(
                            "w-5 h-5 rounded-full flex items-center justify-center shrink-0",
                            analysis.checks.caps ? "bg-emerald-100 text-emerald-600" : "bg-zinc-200 text-zinc-400"
                        )}>
                            <CheckCircle2 className="w-3.5 h-3.5" />
                        </div>
                        <span className={cn("text-sm transition-colors", analysis.checks.caps ? "text-zinc-900 font-bold" : "text-zinc-400")}>
                            Capital Letters
                        </span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className={cn(
                            "w-5 h-5 rounded-full flex items-center justify-center shrink-0",
                            analysis.checks.numbers ? "bg-emerald-100 text-emerald-600" : "bg-zinc-200 text-zinc-400"
                        )}>
                            <CheckCircle2 className="w-3.5 h-3.5" />
                        </div>
                        <span className={cn("text-sm transition-colors", analysis.checks.numbers ? "text-zinc-900 font-bold" : "text-zinc-400")}>
                            Include Numbers
                        </span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className={cn(
                            "w-5 h-5 rounded-full flex items-center justify-center shrink-0",
                            analysis.checks.symbols ? "bg-emerald-100 text-emerald-600" : "bg-zinc-200 text-zinc-400"
                        )}>
                            <CheckCircle2 className="w-3.5 h-3.5" />
                        </div>
                        <span className={cn("text-sm transition-colors", analysis.checks.symbols ? "text-zinc-900 font-bold" : "text-zinc-400")}>
                            Special Symbols
                        </span>
                    </div>
                </div>

                {analysis.checks.common && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3"
                    >
                        <ShieldAlert className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                        <p className="text-sm text-red-800">
                            <strong>Warning:</strong> This password is very common and easy to guess. Avoid using obvious terms like "password" or "qwer".
                        </p>
                    </motion.div>
                )}

                <div className="mt-8">
                    <Button
                        className="w-full h-14 bg-zinc-900 text-white font-bold text-lg rounded-xl shadow-lg hover:scale-[1.02] transition-all"
                        disabled={analysis.score < 75}
                    >
                        Lock This Password
                    </Button>
                    {analysis.score < 75 && (
                        <p className="text-center text-[11px] text-zinc-400 mt-3 font-medium uppercase tracking-wider">
                            Strength must be "Strong" to proceed
                        </p>
                    )}
                </div>
            </div>
        </div>
    )
}
