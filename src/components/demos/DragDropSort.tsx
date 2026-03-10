import { useState } from "react"
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core'
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { restrictToVerticalAxis } from '@dnd-kit/modifiers'
import { SortableItem } from './SortableItem'
import { Button } from "@/components/ui/button"
import { CheckCircle2, XCircle } from "lucide-react"

interface DragDropSortProps {
  question: string
  items: string[] // The correct order
  onComplete: (isCorrect: boolean) => void
}

export default function DragDropSort({ question, items, onComplete }: DragDropSortProps) {
  // Shuffle items initially
  const [currentItems, setCurrentItems] = useState(() => {
    return [...items].sort(() => Math.random() - 0.5)
  })

  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (active.id !== over?.id) {
      setCurrentItems((items) => {
        const oldIndex = items.indexOf(active.id as string)
        const newIndex = items.indexOf(over!.id as string)
        return arrayMove(items, oldIndex, newIndex)
      })
    }
  }

  const handleSubmit = () => {
    setIsSubmitted(true)
    const correct = currentItems.every((item, index) => item === items[index])
    setIsCorrect(correct)
    onComplete(correct)
  }

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-zinc-900">{question}</h3>
      <p className="text-sm text-zinc-500 mb-4">Drag and drop the items to put them in the correct order.</p>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToVerticalAxis]}
      >
        <SortableContext
          items={currentItems}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-2">
            {currentItems.map((id, idx) => (
              <SortableItem
                key={id}
                id={id}
                index={idx + 1}
                disabled={isSubmitted}
                isCorrect={isSubmitted && items[idx] === id}
                isIncorrect={isSubmitted && items[idx] !== id}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {isSubmitted && isCorrect && (
        <div className="p-4 bg-emerald-50 text-emerald-800 rounded-lg flex items-center gap-3 font-medium mt-4">
          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
          Correct sequence!
        </div>
      )}

      {isSubmitted && !isCorrect && (
        <div className="p-4 bg-red-50 text-red-800 rounded-lg flex items-center gap-3 font-medium mt-4">
          <XCircle className="w-5 h-5 text-red-500" />
          Incorrect sequence.
        </div>
      )}

      {!isSubmitted && (
        <Button
          className="bg-indigo-600 hover:bg-indigo-700 w-full mt-6"
          onClick={handleSubmit}
        >
          Submit Order
        </Button>
      )}
    </div>
  )
}
