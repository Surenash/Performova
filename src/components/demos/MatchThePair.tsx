import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CheckCircle2, XCircle } from "lucide-react"

interface MatchThePairProps {
  question: string
  pairs: { left: string, right: string }[]
  onComplete: (isCorrect: boolean) => void
}

export default function MatchThePair({ question, pairs, onComplete }: MatchThePairProps) {
  const [leftItems] = useState(() => pairs.map(p => p.left).sort(() => Math.random() - 0.5))
  const [rightItems] = useState(() => pairs.map(p => p.right).sort(() => Math.random() - 0.5))

  const [selectedLeft, setSelectedLeft] = useState<string | null>(null)
  const [selectedRight, setSelectedRight] = useState<string | null>(null)
  const [matches, setMatches] = useState<{ left: string, right: string }[]>([])

  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)

  const handleLeftClick = (item: string) => {
    if (isSubmitted || matches.some(m => m.left === item)) return
    setSelectedLeft(item === selectedLeft ? null : item)
  }

  const handleRightClick = (item: string) => {
    if (isSubmitted || matches.some(m => m.right === item)) return

    if (selectedLeft) {
      // Create a match
      setMatches(prev => [...prev, { left: selectedLeft, right: item }])
      setSelectedLeft(null)
    } else {
      setSelectedRight(item === selectedRight ? null : item)
    }
  }

  const handleRemoveMatch = (left: string) => {
    if (isSubmitted) return
    setMatches(prev => prev.filter(m => m.left !== left))
  }

  const handleSubmit = () => {
    setIsSubmitted(true)

    let allCorrect = true
    for (const match of matches) {
      const correctPair = pairs.find(p => p.left === match.left)
      if (!correctPair || correctPair.right !== match.right) {
        allCorrect = false
        break
      }
    }

    // Check if all pairs were matched and correct
    if (matches.length !== pairs.length) {
      allCorrect = false
    }

    setIsCorrect(allCorrect)
    onComplete(allCorrect)
  }

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-zinc-900">{question}</h3>
      <p className="text-sm text-zinc-500 mb-4">Click an item on the left, then click its matching item on the right.</p>

      <div className="grid grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-3">
          <h4 className="font-semibold text-zinc-700 text-sm mb-2 text-center">Items</h4>
          {leftItems.map((item, idx) => {
            const isMatched = matches.some(m => m.left === item)
            const isSelected = selectedLeft === item

            let stateStyles = "border-zinc-200 hover:border-indigo-400 hover:bg-zinc-50 cursor-pointer"
            if (isSelected) stateStyles = "border-indigo-500 bg-indigo-50 ring-1 ring-indigo-500"
            if (isMatched) stateStyles = "border-emerald-500 bg-emerald-50 opacity-50 cursor-not-allowed"

            return (
              <div
                key={`l-${idx}`}
                onClick={() => handleLeftClick(item)}
                className={`p-4 rounded-xl border-2 transition-all flex items-center justify-between text-center min-h-[4rem] ${stateStyles}`}
              >
                <span className="font-medium text-sm w-full">{item}</span>
              </div>
            )
          })}
        </div>

        {/* Right Column */}
        <div className="space-y-3">
          <h4 className="font-semibold text-zinc-700 text-sm mb-2 text-center">Matches</h4>
          {rightItems.map((item, idx) => {
            const matchedWith = matches.find(m => m.right === item)
            const isMatched = !!matchedWith
            const isSelected = selectedRight === item

            let stateStyles = "border-zinc-200 hover:border-indigo-400 hover:bg-zinc-50 cursor-pointer"
            if (isSelected) stateStyles = "border-indigo-500 bg-indigo-50 ring-1 ring-indigo-500"
            if (isMatched) stateStyles = "border-emerald-500 bg-emerald-50 opacity-50 cursor-not-allowed"

            return (
              <div
                key={`r-${idx}`}
                onClick={() => handleRightClick(item)}
                className={`p-4 rounded-xl border-2 transition-all flex items-center justify-between text-center min-h-[4rem] ${stateStyles}`}
              >
                <span className="font-medium text-sm w-full">{item}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Current Matches Display */}
      {matches.length > 0 && (
        <div className="mt-8 space-y-3">
          <h4 className="font-semibold text-zinc-900 text-sm border-b pb-2">Your Matches:</h4>
          {matches.map((match, idx) => {
            const correctPair = pairs.find(p => p.left === match.left)
            const matchIsCorrect = correctPair?.right === match.right

            let matchStyle = "bg-zinc-50 border-zinc-200"
            if (isSubmitted && matchIsCorrect) matchStyle = "bg-emerald-50 border-emerald-500"
            if (isSubmitted && !matchIsCorrect) matchStyle = "bg-red-50 border-red-500"

            return (
              <div key={idx} className={`flex items-center justify-between p-3 rounded-lg border ${matchStyle}`}>
                <div className="flex items-center gap-4 w-full">
                  <span className="flex-1 text-right text-sm font-medium">{match.left}</span>
                  <span className="px-2 text-zinc-400">↔</span>
                  <span className="flex-1 text-sm font-medium">{match.right}</span>
                </div>

                {isSubmitted && matchIsCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-500 ml-4 shrink-0" />}
                {isSubmitted && !matchIsCorrect && <XCircle className="w-5 h-5 text-red-500 ml-4 shrink-0" />}

                {!isSubmitted && (
                  <button
                    onClick={() => handleRemoveMatch(match.left)}
                    className="ml-4 text-xs text-red-500 hover:text-red-700 uppercase font-semibold"
                  >
                    Remove
                  </button>
                )}
              </div>
            )
          })}
        </div>
      )}

      {isSubmitted && isCorrect && (
        <div className="p-4 bg-emerald-50 text-emerald-800 rounded-lg flex items-center gap-3 font-medium mt-4">
          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
          All matches correct!
        </div>
      )}

      {isSubmitted && !isCorrect && (
        <div className="p-4 bg-red-50 text-red-800 rounded-lg flex items-center gap-3 font-medium mt-4">
          <XCircle className="w-5 h-5 text-red-500" />
          Some matches are incorrect.
        </div>
      )}

      {!isSubmitted && (
        <Button
          className="bg-indigo-600 hover:bg-indigo-700 w-full mt-6"
          disabled={matches.length !== pairs.length}
          onClick={handleSubmit}
        >
          Submit Matches
        </Button>
      )}
    </div>
  )
}
