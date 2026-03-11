import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react"
import { cn } from "@/lib/utils"

interface Flashcard {
    front: string
    back: string
    category: string
}


export default function FlashcardDemo() {
    const [cards, setCards] = useState<Flashcard[]>([])
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isFlipped, setIsFlipped] = useState(false)
    const [direction, setDirection] = useState(0) // -1 for left, 1 for right
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch('/api/demos/flashcards')
            .then(res => res.json())
            .then((data: Flashcard[]) => {
                setCards(data)
                setLoading(false)
            })
            .catch(err => {
                console.error(err)
                setLoading(false)
            })
    }, [])

    const card = cards[currentIndex]

    const handleFlip = () => {
        setIsFlipped(!isFlipped)
    }

    const handleNext = () => {
        if (currentIndex < cards.length - 1) {
            setDirection(1)
            setIsFlipped(false)
            setTimeout(() => setCurrentIndex((i) => i + 1), 100)
        }
    }

    const handlePrev = () => {
        if (currentIndex > 0) {
            setDirection(-1)
            setIsFlipped(false)
            setTimeout(() => setCurrentIndex((i) => i - 1), 100)
        }
    }

    const handleReset = () => {
        setCurrentIndex(0)
        setIsFlipped(false)
        setDirection(0)
    }

    if (loading) {
        return <div className="p-8 text-center text-zinc-500">Loading flashcards...</div>
    }

    if (cards.length === 0) return null

    return (

        <div className="w-full max-w-sm mx-auto">
            {/* Card container */}
            <div
                className="relative w-full h-56 cursor-pointer mb-4"
                style={{ perspective: 1000 }}
                onClick={handleFlip}
            >
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0, x: direction * 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -direction * 50 }}
                        transition={{ duration: 0.3 }}
                        className="w-full h-full"
                        style={{ perspective: 1000 }}
                    >
                        <motion.div
                            animate={{ rotateY: isFlipped ? 180 : 0 }}
                            transition={{ duration: 0.5, ease: "easeInOut" }}
                            className="relative w-full h-full"
                            style={{ transformStyle: "preserve-3d" }}
                        >
                            {/* Front */}
                            <div
                                className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 p-6 flex flex-col justify-between text-white shadow-xl"
                                style={{ backfaceVisibility: "hidden" }}
                            >
                                <div className="text-xs font-medium uppercase tracking-wider opacity-70">{card.category}</div>
                                <div className="flex-1 flex items-center justify-center">
                                    <p className="text-lg font-bold text-center leading-snug">{card.front}</p>
                                </div>
                                <div className="text-xs text-center opacity-60">Tap to reveal answer</div>
                            </div>

                            {/* Back */}
                            <div
                                className="absolute inset-0 rounded-2xl bg-white border-2 border-indigo-200 p-6 flex flex-col justify-between shadow-xl"
                                style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
                            >
                                <div className="text-xs font-medium uppercase tracking-wider text-indigo-500">{card.category}</div>
                                <div className="flex-1 flex items-center justify-center">
                                    <p className="text-sm text-zinc-700 text-center leading-relaxed">{card.back}</p>
                                </div>
                                <div className="text-xs text-center text-zinc-400">Tap to flip back</div>
                            </div>
                        </motion.div>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between">
                <button
                    onClick={(e) => { e.stopPropagation(); handlePrev() }}
                    disabled={currentIndex === 0}
                    className={cn(
                        "w-10 h-10 rounded-full border flex items-center justify-center transition-all",
                        currentIndex === 0
                            ? "border-zinc-100 text-zinc-300 cursor-not-allowed"
                            : "border-zinc-200 text-zinc-600 hover:bg-zinc-100 hover:border-zinc-300"
                    )}
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-3">
                    <div className="flex gap-1.5">
                        {cards.map((_, i) => (
                            <div
                                key={i}
                                className={cn(
                                    "w-2 h-2 rounded-full transition-all",
                                    i === currentIndex ? "bg-indigo-500 w-4" : "bg-zinc-200"
                                )}
                            />
                        ))}
                    </div>
                    <button
                        onClick={(e) => { e.stopPropagation(); handleReset() }}
                        className="text-zinc-400 hover:text-zinc-600 transition-colors p-1"
                        aria-label="Reset"
                    >
                        <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                </div>

                <button
                    onClick={(e) => { e.stopPropagation(); handleNext() }}
                    disabled={currentIndex === cards.length - 1}
                    className={cn(
                        "w-10 h-10 rounded-full border flex items-center justify-center transition-all",
                        currentIndex === cards.length - 1
                            ? "border-zinc-100 text-zinc-300 cursor-not-allowed"
                            : "border-zinc-200 text-zinc-600 hover:bg-zinc-100 hover:border-zinc-300"
                    )}
                >
                    <ChevronRight className="w-5 h-5" />
                </button>
            </div>
        </div>
    )
}
