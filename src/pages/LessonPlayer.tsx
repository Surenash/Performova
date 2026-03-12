import { useState, useMemo, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, XCircle, ChevronLeft, Menu, PlayCircle, FileText, MousePointer2, Gamepad2, Video, BookOpen, Flame, Trophy, Play, AlertTriangle, Lock, ShieldCheck, MessageSquare } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { api } from "@/lib/api"

export default function LessonPlayer() {
  const navigate = useNavigate()
  const { id: courseId } = useParams()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [course, setCourse] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await api.get(`/api/courses/${courseId}`);
        setCourse(res.data);
      } catch (err) {
        console.error("Failed to load course", err);
      } finally {
        setLoading(false);
      }
    };
    if (courseId) {
      fetchCourse();
    }
  }, [courseId]);

  const SYLLABUS = course?.lessons || [];
  const currentStep = SYLLABUS[currentStepIndex]
  const progress = useMemo(() => SYLLABUS.length > 0 ? Math.round(((currentStepIndex) / SYLLABUS.length) * 100) : 0, [currentStepIndex])

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
    if (loading) return (
       <div className="flex-1 flex items-center justify-center h-full text-center">
         <p className="text-zinc-500 mb-4 animate-pulse">Loading course content...</p>
       </div>
    )

    if (!currentStep) return (
      <div className="flex-1 flex flex-col items-center justify-center h-full text-center">
         <p className="text-zinc-500 mb-4">No content available for this lesson yet.</p>
         <Button onClick={() => navigate('/learner')} variant="outline">Return to Dashboard</Button>
      </div>
    )

    return (
       <div className="space-y-6">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-zinc-900 mb-4">{currentStep.title}</h2>
            <div className="text-lg text-zinc-600" dangerouslySetInnerHTML={{ __html: currentStep.content || 'No content provided.' }} />
          </div>
       </div>
    )
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
              <h2 className="font-bold text-lg text-zinc-900 mb-2">{course?.title || "Loading..."}</h2>
              <div className="flex items-center gap-3 mb-6">
                <Progress value={progress} className="h-2 flex-1" />
                <span className="text-xs font-medium text-zinc-500">{progress}%</span>
              </div>
              <div className="space-y-1">
                {SYLLABUS.map((item: any, index: number) => {
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
                          Lesson {index + 1}
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
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label={sidebarOpen ? "Collapse Syllabus" : "Expand Syllabus"}
            >
              <Menu className="w-5 h-5 text-zinc-500" />
            </Button>
            <h1 className="font-bold text-zinc-900">{course?.title || "Loading..."}</h1>
          </div>
          <div className="flex items-center gap-3 text-sm font-medium text-zinc-500">
            Step {SYLLABUS.length > 0 ? currentStepIndex + 1 : 0} of {SYLLABUS.length}
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 md:p-12">
          {currentStep && (
            <motion.div
              key={currentStep.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              className="max-w-4xl mx-auto mb-20"
            >
              {renderContent()}
            </motion.div>
          )}
          {!currentStep && renderContent()}
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
