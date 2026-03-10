import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, CheckCircle2, XCircle } from 'lucide-react'

interface SortableItemProps {
  id: string
  index: number
  disabled?: boolean
  isCorrect?: boolean
  isIncorrect?: boolean
}

export function SortableItem({ id, index, disabled, isCorrect, isIncorrect }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  let stateStyles = "bg-white border-zinc-200"
  if (isCorrect) stateStyles = "bg-emerald-50 border-emerald-500"
  if (isIncorrect) stateStyles = "bg-red-50 border-red-500"

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-3 p-4 rounded-xl border shadow-sm ${stateStyles} ${disabled ? 'opacity-80' : 'cursor-grab hover:border-indigo-400'}`}
      {...attributes}
      {...listeners}
    >
      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-zinc-100 text-zinc-500 font-bold shrink-0">
        {index}
      </div>
      <div className="flex-1 font-medium text-zinc-900">{id}</div>

      {!disabled && <GripVertical className="text-zinc-400 w-5 h-5 shrink-0" />}
      {isCorrect && <CheckCircle2 className="text-emerald-500 w-5 h-5 shrink-0" />}
      {isIncorrect && <XCircle className="text-red-500 w-5 h-5 shrink-0" />}
    </div>
  )
}
