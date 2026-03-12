import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CheckCircle2, XCircle } from "lucide-react"

interface FillInTheBlankProps {
  question: string
  correctAnswer: string
  onComplete: (isCorrect: boolean) => void
}

export default function FillInTheBlank({ question, correctAnswer, onComplete }: FillInTheBlankProps) {
  const [answer, setAnswer] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)

  const handleSubmit = () => {
    if (!answer) return
    setIsSubmitted(true)
    const correct = answer.trim().toLowerCase() === correctAnswer.trim().toLowerCase()
    setIsCorrect(correct)
    onComplete(correct)
  }

  // Split question by "____" or underscores
  const parts = question.split(/_{3,}/)

  return (
    <div className="space-y-6">
      <div className="text-xl font-semibold text-zinc-900 leading-relaxed flex flex-wrap items-center gap-2">
        {parts.map((part, index) => (
          <span key={index} className="flex items-center gap-2">
            <span>{part}</span>
            {index < parts.length - 1 && (
              <input
                type="text"
                disabled={isSubmitted}
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                className={`w-32 h-10 border-b-2 text-center text-indigo-700 font-bold bg-zinc-50 outline-none transition-colors
                  ${isSubmitted
                    ? isCorrect ? "border-emerald-500 text-emerald-700 bg-emerald-50" : "border-red-500 text-red-700 bg-red-50"
                    : "border-zinc-300 focus:border-indigo-500 focus:bg-indigo-50"
                  }`}
              />
            )}
          </span>
        ))}
      </div>

      {isSubmitted && isCorrect && (
        <div className="p-4 bg-emerald-50 text-emerald-800 rounded-lg flex items-center gap-3 font-medium">
          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
          Correct!
        </div>
      )}

      {isSubmitted && !isCorrect && (
        <div className="p-4 bg-red-50 text-red-800 rounded-lg flex flex-col gap-2 font-medium">
          <div className="flex items-center gap-3">
            <XCircle className="w-5 h-5 text-red-500" />
            Incorrect
          </div>
          <div className="text-sm ml-8 text-red-700">Correct Answer: <strong>{correctAnswer}</strong></div>
        </div>
      )}

      {!isSubmitted && (
        <Button
          className="bg-indigo-600 hover:bg-indigo-700 w-full"
          disabled={!answer.trim()}
          onClick={handleSubmit}
        >
          Check Answer
        </Button>
      )}
    </div>
  )
}
