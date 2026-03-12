import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CheckCircle2, XCircle } from "lucide-react"

interface TrueFalseProps {
  question: string
  correctAnswer: boolean
  onComplete: (isCorrect: boolean) => void
}

export default function TrueFalse({ question, correctAnswer, onComplete }: TrueFalseProps) {
  const [selected, setSelected] = useState<boolean | null>(null)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = () => {
    if (selected === null) return
    setIsSubmitted(true)
    const isCorrect = selected === correctAnswer
    onComplete(isCorrect)
  }

  const options = [
    { label: "True", value: true },
    { label: "False", value: false },
  ]

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-zinc-900">{question}</h3>
      <div className="grid grid-cols-2 gap-4">
        {options.map((opt, idx) => {
          const isSelected = selected === opt.value
          const isCorrectOption = opt.value === correctAnswer

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
              onClick={() => !isSubmitted && setSelected(opt.value)}
              className={`p-6 rounded-xl border-2 cursor-pointer transition-all flex flex-col items-center justify-center text-center ${stateStyles}`}
            >
              <span className="font-bold text-lg">{opt.label}</span>
              {isSubmitted && isCorrectOption && <CheckCircle2 className="w-6 h-6 text-emerald-500 mt-2" />}
              {isSubmitted && isSelected && !isCorrectOption && <XCircle className="w-6 h-6 text-red-500 mt-2" />}
            </div>
          )
        })}
      </div>

      {!isSubmitted && (
        <Button
          className="w-full bg-indigo-600 hover:bg-indigo-700 mt-4"
          disabled={selected === null}
          onClick={handleSubmit}
        >
          Submit Answer
        </Button>
      )}
    </div>
  )
}
