import { useState, useMemo } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, XCircle, ChevronLeft, Menu, PlayCircle, FileText, MousePointer2, Gamepad2, Video, BookOpen, Flame, Trophy, Play } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

// Import Learning Tools
import VideoPlayer from "@/components/demos/VideoPlayer"
import ContentReader from "@/components/demos/ContentReader"
import ProtocolMatchGame from "@/components/demos/ProtocolMatchGame"
import QuickQuizDemo from "@/components/demos/QuickQuizDemo"
import FlashcardDemo from "@/components/demos/FlashcardDemo"

const SYLLABUS = [
  { id: 1, title: "Introduction Video", type: "video", duration: "2:30" },
  { id: 2, title: "Identifying Suspicious Links", type: "interactive", duration: "5:00" },
  { id: 3, title: "Reading: Reporting Protocols", type: "reading", duration: "3:00" },
  { id: 4, title: "Protocol Match Challenge", type: "game", duration: "4:00" },
  { id: 5, title: "Flashcard Review", type: "flashcards", duration: "3:00" },
  { id: 6, title: "Final Knowledge Check", type: "quiz", duration: "4:00" },
]

export default function LessonPlayer() {
  const navigate = useNavigate()
  const { id: courseId } = useParams()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<number[]>([1]) // First one "done" for demo

  const currentStep = SYLLABUS[currentStepIndex]
  const progress = useMemo(() => Math.round(((currentStepIndex) / SYLLABUS.length) * 100), [currentStepIndex])

  const handleNext = () => {
    if (currentStepIndex < SYLLABUS.length - 1) {
      if (!completedSteps.includes(currentStep.id)) {
        setCompletedSteps([...completedSteps, currentStep.id])
      }
      setCurrentStepIndex(currentStepIndex + 1)
      window.scrollTo(0, 0)
    } else {
      // Completed last step
      navigate('/learner')
    }
  }

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1)
      window.scrollTo(0, 0)
    }
  }

  const renderContent = () => {
    switch (currentStep.type) {
      case 'video':
        return (
          <div className="space-y-6">
            <div className="mb-8">
              <Badge variant="outline" className="mb-4 text-red-600 border-red-200 bg-red-50 flex w-fit items-center gap-1.5">
                <Video className="w-3.5 h-3.5" /> Video Lesson
              </Badge>
              <h2 className="text-3xl font-bold text-zinc-900 mb-4">{currentStep.title}</h2>
              <p className="text-lg text-zinc-600">Watch the introduction to understand the core concepts of today's module.</p>
            </div>
            <VideoPlayer />
          </div>
        )
      case 'reading':
        return (
          <div className="space-y-6">
            <div className="mb-8">
              <Badge variant="outline" className="mb-4 text-teal-600 border-teal-200 bg-teal-50 flex w-fit items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" /> Reading Material
              </Badge>
              <h2 className="text-3xl font-bold text-zinc-900 mb-4">{currentStep.title}</h2>
              <p className="text-lg text-zinc-600">Deep-dive into the technical protocols and reporting procedures.</p>
            </div>
            <ContentReader />
          </div>
        )
      case 'interactive':
        return (
          <div className="space-y-6">
            <div className="mb-8">
              <Badge variant="outline" className="mb-4 text-indigo-600 border-indigo-200 bg-indigo-50 flex w-fit items-center gap-1.5">
                <MousePointer2 className="w-3.5 h-3.5" /> Interactive Exercise
              </Badge>
              <h2 className="text-3xl font-bold text-zinc-900 mb-4">{currentStep.title}</h2>
              <p className="text-lg text-zinc-600">Apply what you've learned in this hands-on simulation.</p>
            </div>
            {/* Keeping the existing URL spotter for this specific ID for demo */}
            <div className="bg-zinc-50 rounded-2xl p-8 border border-zinc-200">
              <p className="text-zinc-700 mb-6 font-medium">Which of the following links is most likely a phishing attempt?</p>
              <div className="space-y-4 max-w-lg">
                {["https://www.paypal.com/login", "https://www.paypaI.com/secure", "https://account.paypal.com/auth"].map((url, i) => (
                  <button key={i} className="w-full text-left p-4 rounded-xl border border-zinc-200 bg-white hover:border-indigo-500 transition-colors font-mono text-sm">
                    {url}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )
      case 'game':
        return (
          <div className="space-y-6">
            <div className="mb-8 text-center max-w-xl mx-auto">
              <Badge variant="outline" className="mb-4 text-purple-600 border-purple-200 bg-purple-50 mx-auto flex w-fit items-center gap-1.5">
                <Gamepad2 className="w-3.5 h-3.5" /> Practice Zone: Match Game
              </Badge>
              <h2 className="text-3xl font-bold text-zinc-900 mb-4">{currentStep.title}</h2>
              <p className="text-lg text-zinc-600">Match the security protocol to its correct description to proceed.</p>
            </div>
            <div className="flex justify-center">
              <div className="max-w-md w-full">
                <ProtocolMatchGame />
              </div>
            </div>
          </div>
        )
      case 'flashcards':
        return (
          <div className="space-y-6">
            <div className="mb-8 text-center max-w-xl mx-auto">
              <Badge variant="outline" className="mb-4 text-amber-600 border-amber-200 bg-amber-50 mx-auto flex w-fit items-center gap-1.5">
                <Flame className="w-3.5 h-3.5" /> Study Mode: Flashcards
              </Badge>
              <h2 className="text-3xl font-bold text-zinc-900 mb-4">{currentStep.title}</h2>
              <p className="text-lg text-zinc-600">Review key terms and definitions before the final assessment.</p>
            </div>
            <div className="flex justify-center">
              <FlashcardDemo />
            </div>
          </div>
        )
      case 'quiz':
        return (
          <div className="space-y-6">
            <div className="mb-8 text-center max-w-xl mx-auto">
              <Badge variant="outline" className="mb-4 text-emerald-600 border-emerald-200 bg-emerald-50 mx-auto flex w-fit items-center gap-1.5">
                <Trophy className="w-3.5 h-3.5" /> Final Knowledge Check
              </Badge>
              <h2 className="text-3xl font-bold text-zinc-900 mb-4">{currentStep.title}</h2>
              <p className="text-lg text-zinc-600">Test your understanding of the entire module.</p>
            </div>
            <div className="flex justify-center">
              <QuickQuizDemo />
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      {/* Collapsible Sidebar */}
      <AnimatePresence initial={false}>
        {sidebarOpen && (
          <motion.aside
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 320, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="border-r border-zinc-200 bg-zinc-50 flex flex-col shrink-0 overflow-hidden"
          >
            <div className="p-4 border-b border-zinc-200 flex items-center justify-between shrink-0 w-[320px]">
              <Button variant="ghost" size="sm" className="text-zinc-500 hover:text-zinc-900" onClick={() => navigate('/learner')}>
                <ChevronLeft className="w-4 h-4 mr-1" /> Back to Dashboard
              </Button>
            </div>
            <div className="p-6 flex-1 overflow-y-auto w-[320px]">
              <h2 className="font-bold text-lg text-zinc-900 mb-2">Cybersecurity Basics</h2>
              <div className="flex items-center gap-3 mb-6">
                <Progress value={progress} className="h-2 flex-1" />
                <span className="text-xs font-medium text-zinc-500">{progress}%</span>
              </div>
              <div className="space-y-1">
                {SYLLABUS.map((item, index) => {
                  const isActive = currentStepIndex === index
                  const isDone = completedSteps.includes(item.id)
                  return (
                    <button
                      key={item.id}
                      onClick={() => setCurrentStepIndex(index)}
                      className={cn(
                        "w-full flex items-start gap-3 p-3 rounded-xl text-left transition-all",
                        isActive ? "bg-white shadow-md border border-zinc-200 ring-2 ring-indigo-50" : "hover:bg-zinc-100/50 text-zinc-500"
                      )}
                    >
                      <div className="mt-0.5 shrink-0">
                        {isDone ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                        ) : (
                          <div className={cn(
                            "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                            isActive ? "border-indigo-500" : "border-zinc-300"
                          )}>
                            <span className="text-[10px] font-medium">{index + 1}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={cn("text-sm font-bold truncate", isActive ? "text-indigo-700" : "text-zinc-700")}>{item.title}</p>
                        <div className="flex items-center gap-2 mt-1 text-[10px] uppercase font-bold tracking-wider opacity-60">
                          {item.type} &bull; {item.duration}
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Stage */}
      <main className="flex-1 flex flex-col relative overflow-hidden bg-white">
        <header className="h-16 border-b border-zinc-200 flex items-center px-4 shrink-0 justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)}>
              <Menu className="w-5 h-5 text-zinc-500" />
            </Button>
            <h1 className="font-bold text-zinc-900">Module 3: Social Engineering</h1>
          </div>
          <div className="flex items-center gap-3 text-sm font-medium text-zinc-500">
            Step {currentStepIndex + 1} of {SYLLABUS.length}
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 md:p-12">
          <motion.div
            key={currentStep.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="max-w-4xl mx-auto mb-20"
          >
            {renderContent()}
          </motion.div>
        </div>

        {/* Sticky Action Bar */}
        <div className="border-t border-zinc-200 bg-white/80 backdrop-blur-md p-4 shrink-0 flex justify-between items-center px-6">
          <Button variant="ghost" className="text-zinc-500" onClick={handlePrev} disabled={currentStepIndex === 0}>
            Go Back
          </Button>
          <div className="flex items-center gap-4">
            <Button variant="ghost" className="text-zinc-500 hidden sm:block">Need help?</Button>
            <Button
              size="lg"
              className="min-w-[160px] bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg rounded-xl flex items-center gap-2"
              onClick={handleNext}
            >
              {currentStepIndex === SYLLABUS.length - 1 ? "Finish Module" : "Continue"}
              <Play className="w-4 h-4 fill-white" />
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}


