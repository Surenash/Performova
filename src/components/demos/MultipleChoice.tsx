import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CheckCircle2, XCircle } from "lucide-react"

interface MultipleChoiceProps {
  question: string
  options: string[]
  correctAnswer: string
  onComplete: (isCorrect: boolean) => void
}

export default function MultipleChoice({ question, options, correctAnswer, onComplete }: MultipleChoiceProps) {
  const [selected, setSelected] = useState<string | null>(null)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = () => {
    if (!selected) return
    setIsSubmitted(true)
    const isCorrect = selected === correctAnswer
    onComplete(isCorrect)
  }

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-zinc-900">{question}</h3>
      <div className="space-y-3">
        {options.map((opt, idx) => {
          const isSelected = selected === opt
          const isCorrectOption = opt === correctAnswer

          let stateStyles = "border-zinc-200 hover:border-indigo-400 hover:bg-zinc-50"

          if (isSubmitted) {
            if (isCorrectOption) {
              stateStyles = "border-emerald-500 bg-emerald-50"
            } else if (isSelected && !isCorrectOption) {
              stateStyles = "border-red-500 bg-red-50"
            }
          } else if (isSelected) {
            stateStyles = "border-indigo-500 bg-indigo-50 ring-1 ring-indigo-500"
          }

          return (
            <div
              key={idx}
              onClick={() => !isSubmitted && setSelected(opt)}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between ${stateStyles}`}
            >
              <span className="font-medium">{opt}</span>
              {isSubmitted && isCorrectOption && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
              {isSubmitted && isSelected && !isCorrectOption && <XCircle className="w-5 h-5 text-red-500" />}
            </div>
          )
        })}
      </div>

      {!isSubmitted && (
        <Button
          className="w-full bg-indigo-600 hover:bg-indigo-700 mt-4"
          disabled={!selected}
          onClick={handleSubmit}
        >
          Submit Answer
        </Button>
      )}
    </div>
  )
}
