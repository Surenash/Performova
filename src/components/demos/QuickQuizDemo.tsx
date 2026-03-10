import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle2, XCircle, ArrowRight, RotateCcw, Trophy } from "lucide-react"
import { cn } from "@/lib/utils"

interface Question {
    question: string
    options: string[]
    correctIndex: number
    explanation: string
}

const questions: Question[] = [
    {
        question: "What is the first step in a phishing attack?",
        options: [
            "Clicking a suspicious link",
            "Receiving a deceptive email",
            "Downloading malware",
            "Sharing your password",
        ],
        correctIndex: 1,
        explanation: "Phishing starts with the attacker sending a deceptive email designed to look legitimate.",
    },
    {
        question: "Which password is the most secure?",
        options: [
            "password123",
            "MyDog'sName",
            "Tr0ub4dor&3",
            "j7$kL9!mNq2@xW",
        ],
        correctIndex: 3,
        explanation: "Long, random passwords with mixed characters are the strongest against brute-force attacks.",
    },
    {
        question: "What does 2FA stand for?",
        options: [
            "Two-Factor Authentication",
            "Two-File Authorization",
            "Two-Form Access",
            "Two-Firewall Application",
        ],
        correctIndex: 0,
        explanation: "Two-Factor Authentication adds a second layer of verification beyond just a password.",
    },
]

export default function QuickQuizDemo() {
    const [currentQ, setCurrentQ] = useState(0)
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
    const [showResult, setShowResult] = useState(false)
    const [score, setScore] = useState(0)
    const [finished, setFinished] = useState(false)

    const question = questions[currentQ]

    const handleSelect = (index: number) => {
        if (selectedAnswer !== null) return // already answered
        setSelectedAnswer(index)
        setShowResult(true)
        if (index === question.correctIndex) {
            setScore((s) => s + 1)
        }
    }

    const handleNext = () => {
        if (currentQ < questions.length - 1) {
            setCurrentQ((q) => q + 1)
            setSelectedAnswer(null)
            setShowResult(false)
        } else {
            setFinished(true)
        }
    }

    const handleReset = () => {
        setCurrentQ(0)
        setSelectedAnswer(null)
        setShowResult(false)
        setScore(0)
        setFinished(false)
    }

    return (
        <div className="bg-white rounded-2xl shadow-xl border border-zinc-100 p-6 w-full max-w-sm relative overflow-hidden">
            <AnimatePresence mode="wait">
                {finished ? (
                    <motion.div
                        key="finished"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex flex-col items-center text-center py-4"
                    >
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 200, damping: 12 }}
                            className={cn(
                                "w-16 h-16 rounded-full flex items-center justify-center mb-4",
                                score === questions.length ? "bg-emerald-100" : "bg-amber-100"
                            )}
                        >
                            <Trophy className={cn("w-8 h-8", score === questions.length ? "text-emerald-600" : "text-amber-600")} />
                        </motion.div>
                        <p className="font-bold text-lg text-zinc-900 mb-1">
                            {score === questions.length ? "Perfect Score!" : "Quiz Complete!"}
                        </p>
                        <p className="text-sm text-zinc-500 mb-1">
                            You scored <span className="font-bold text-indigo-600">{score}/{questions.length}</span>
                        </p>
                        <p className="text-xs text-zinc-400 mb-4">
                            {score === questions.length
                                ? "You nailed every question!"
                                : score >= 2
                                    ? "Great job, almost there!"
                                    : "Keep practicing, you'll get there!"}
                        </p>
                        <button
                            onClick={handleReset}
                            className="flex items-center gap-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-700 underline underline-offset-2"
                        >
                            <RotateCcw className="w-3.5 h-3.5" /> Try Again
                        </button>
                    </motion.div>
                ) : (
                    <motion.div
                        key={currentQ}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between mb-4">
                            <h4 className="font-bold text-zinc-900 text-sm">Quick Quiz</h4>
                            <span className="text-xs text-zinc-400 font-medium">
                                {currentQ + 1} / {questions.length}
                            </span>
                        </div>

                        {/* Progress bar */}
                        <div className="flex gap-1 mb-4">
                            {questions.map((_, i) => (
                                <div
                                    key={i}
                                    className={cn(
                                        "h-1 flex-1 rounded-full transition-colors duration-500",
                                        i < currentQ ? "bg-emerald-400" : i === currentQ ? "bg-indigo-400" : "bg-zinc-100"
                                    )}
                                />
                            ))}
                        </div>

                        {/* Question */}
                        <p className="text-sm text-zinc-700 mb-4 font-medium">{question.question}</p>

                        {/* Options */}
                        <div className="space-y-2 mb-4">
                            {question.options.map((option, i) => {
                                const isSelected = selectedAnswer === i
                                const isCorrect = i === question.correctIndex
                                const showCorrectHighlight = showResult && isCorrect
                                const showWrongHighlight = showResult && isSelected && !isCorrect

                                return (
                                    <motion.div
                                        key={i}
                                        onClick={() => handleSelect(i)}
                                        whileHover={selectedAnswer === null ? { scale: 1.01 } : {}}
                                        whileTap={selectedAnswer === null ? { scale: 0.99 } : {}}
                                        className={cn(
                                            "p-3 rounded-lg border text-sm transition-all flex items-center justify-between",
                                            selectedAnswer === null
                                                ? "border-zinc-200 text-zinc-600 hover:border-indigo-300 hover:bg-indigo-50/30 cursor-pointer"
                                                : showCorrectHighlight
                                                    ? "border-emerald-400 bg-emerald-50 text-emerald-700 font-medium"
                                                    : showWrongHighlight
                                                        ? "border-red-400 bg-red-50 text-red-700"
                                                        : "border-zinc-100 text-zinc-400 cursor-default"
                                        )}
                                    >
                                        <span>{option}</span>
                                        {showCorrectHighlight && <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />}
                                        {showWrongHighlight && <XCircle className="w-4 h-4 text-red-500 shrink-0" />}
                                    </motion.div>
                                )
                            })}
                        </div>

                        {/* Explanation + Next */}
                        <AnimatePresence>
                            {showResult && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="space-y-3"
                                >
                                    <div className={cn(
                                        "p-3 rounded-lg text-xs leading-relaxed",
                                        selectedAnswer === question.correctIndex
                                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                            : "bg-amber-50 text-amber-700 border border-amber-200"
                                    )}>
                                        {selectedAnswer === question.correctIndex ? "✓ Correct! " : "✗ Not quite. "}
                                        {question.explanation}
                                    </div>
                                    <button
                                        onClick={handleNext}
                                        className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg flex items-center justify-center gap-2 transition-colors"
                                    >
                                        {currentQ < questions.length - 1 ? (
                                            <>Next Question <ArrowRight className="w-4 h-4" /></>
                                        ) : (
                                            "See Results"
                                        )}
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
