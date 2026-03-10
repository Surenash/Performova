import { useState, useMemo, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, XCircle, ChevronLeft, Menu, PlayCircle, FileText, MousePointer2, Gamepad2, Video, BookOpen, Flame, Trophy, Play, AlertTriangle, Lock, ShieldCheck, MessageSquare, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

// Import Learning Tools
import VideoPlayer from "@/components/demos/VideoPlayer"
import ContentReader from "@/components/demos/ContentReader"
import ProtocolMatchGame from "@/components/demos/ProtocolMatchGame"
import QuickQuizDemo from "@/components/demos/QuickQuizDemo"
import FlashcardDemo from "@/components/demos/FlashcardDemo"
import PhishingSimulator from "@/components/demos/PhishingSimulator"
import SecuritySortGame from "@/components/demos/SecuritySortGame"
import PasswordChallenge from "@/components/demos/PasswordChallenge"
import ChatSimulator from "@/components/demos/ChatSimulator"
import MultipleChoice from "@/components/demos/MultipleChoice"
import TrueFalse from "@/components/demos/TrueFalse"
import FillInTheBlank from "@/components/demos/FillInTheBlank"
import MatchThePair from "@/components/demos/MatchThePair"
import DragDropSort from "@/components/demos/DragDropSort"

const DEFAULT_SYLLABUS = [
  { id: 1, title: "Introduction Video", type: "video", duration: "2:30" },
  { id: 2, title: "Email Inspector", type: "phishing", duration: "5:00" },
  { id: 3, title: "Password Wall", type: "password", duration: "4:00" },
  { id: 4, title: "Reading: Reporting Protocols", type: "reading", duration: "3:00" },
  { id: 5, title: "Security Sort", type: "sort", duration: "4:00" },
  { id: 6, title: "Social Engineering Chat", type: "chat", duration: "6:00" },
  { id: 7, title: "Final Knowledge Check", type: "quiz", duration: "4:00" },
]

export default function LessonPlayer() {
  const navigate = useNavigate()
  const { id: courseId } = useParams()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<number[]>([1]) // First one "done" for demo
  const [courseData, setCourseData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  const SYLLABUS = courseData?.lessons || DEFAULT_SYLLABUS
  const currentStep = SYLLABUS[currentStepIndex] || {}
  const progress = useMemo(() => Math.round(((currentStepIndex) / (SYLLABUS.length || 1)) * 100), [currentStepIndex, SYLLABUS])

  useEffect(() => {
    const fetchCourse = async () => {
      if (!courseId) {
        setIsLoading(false)
        return
      }
      try {
        const res = await fetch(`/api/courses/${courseId}`)
        if (res.ok) {
          const data = await res.json()

          const formattedLessons = data.lessons.map((lesson: any) => ({
            id: lesson.id,
            type: lesson.type, // 'lesson', 'quiz'
            title: lesson.title,
            duration: "5:00",
            content: lesson.content,
            video_url: lesson.video_url,
            questions: lesson.questions || []
          }))

          formattedLessons.sort((a: any, b: any) => a.order - b.order)
          setCourseData({ ...data, lessons: formattedLessons })
        }
      } catch (e) {
        console.error("Failed to fetch course", e)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCourse()
  }, [courseId])

  const handleNext = () => {
    if (currentStepIndex < SYLLABUS.length - 1) {
      if (!completedSteps.includes(currentStep.id)) {
        setCompletedSteps([...completedSteps, currentStep.id])
      }
      setCurrentStepIndex(currentStepIndex + 1)
      window.scrollTo(0, 0)
    } else {
      navigate('/learner')
    }
  }

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1)
      window.scrollTo(0, 0)
    }
  }

  const handleQuestionComplete = (isCorrect: boolean) => {
    console.log("Question complete:", isCorrect)
  }

  const renderContent = () => {
    // Handle dynamic backend courses
    if (courseData) {
      if (currentStep.type === 'lesson') {
        return (
          <div className="space-y-6">
             <div className="mb-8">
               <Badge variant="outline" className="mb-4 text-indigo-600 border-indigo-200 bg-indigo-50 flex w-fit items-center gap-1.5">
                 <BookOpen className="w-3.5 h-3.5" /> {currentStep.video_url ? "Video Lesson" : "Reading Material"}
               </Badge>
               <h2 className="text-3xl font-bold text-zinc-900 mb-4">{currentStep.title}</h2>
             </div>

             {currentStep.video_url && (
               <div className="mb-8 rounded-xl overflow-hidden shadow-lg border border-zinc-200 bg-black aspect-video flex items-center justify-center">
                 <video controls className="w-full h-full max-h-[600px]" src={currentStep.video_url}>
                   Your browser does not support the video tag.
                 </video>
               </div>
             )}

             <div className="prose prose-zinc max-w-none bg-zinc-50 p-8 rounded-2xl border border-zinc-200 shadow-sm leading-relaxed whitespace-pre-wrap">
               {currentStep.content}
             </div>
          </div>
        )
      }

      if (currentStep.type === 'quiz') {
        return (
          <div className="space-y-12">
            <div className="text-center max-w-xl mx-auto">
              <Badge variant="outline" className="mb-4 text-emerald-600 border-emerald-200 bg-emerald-50 mx-auto flex w-fit items-center gap-1.5">
                <Trophy className="w-3.5 h-3.5" /> Interactive Quiz
              </Badge>
              <h2 className="text-3xl font-bold text-zinc-900 mb-4">{currentStep.title}</h2>
            </div>

            <div className="space-y-16">
              {currentStep.questions?.map((q: any, idx: number) => {
                const config = typeof q.config === 'string' ? JSON.parse(q.config) : q.config

                return (
                  <div key={idx} className="bg-white p-8 rounded-2xl shadow-sm border border-zinc-200">
                    {q.type === 'multiple_choice' && (
                      <MultipleChoice
                        question={q.question_text}
                        options={config.options}
                        correctAnswer={config.correct_answer}
                        onComplete={handleQuestionComplete}
                      />
                    )}
                    {q.type === 'true_false' && (
                      <TrueFalse
                        question={q.question_text}
                        correctAnswer={config.correct_answer}
                        onComplete={handleQuestionComplete}
                      />
                    )}
                    {q.type === 'fill_in_the_blank' && (
                      <FillInTheBlank
                        question={q.question_text}
                        correctAnswer={config.correct_answer}
                        onComplete={handleQuestionComplete}
                      />
                    )}
                    {q.type === 'drag_drop_sort' && (
                      <DragDropSort
                        question={q.question_text}
                        items={config.items}
                        onComplete={handleQuestionComplete}
                      />
                    )}
                    {q.type === 'match_the_pair' && (
                      <MatchThePair
                        question={q.question_text}
                        pairs={config.pairs}
                        onComplete={handleQuestionComplete}
                      />
                    )}
                    {!['multiple_choice', 'true_false', 'fill_in_the_blank', 'drag_drop_sort', 'match_the_pair'].includes(q.type) && (
                       <p className="text-zinc-500 italic">Unsupported question format.</p>
                    )}
                  </div>
                )
              })}

              {(!currentStep.questions || currentStep.questions.length === 0) && (
                <p className="text-center text-zinc-500 italic">No questions found for this quiz.</p>
              )}
            </div>
          </div>
        )
      }
    }

    // Default static demo
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
      case 'phishing':
        return (
          <div className="space-y-6">
            <div className="mb-8 text-center max-w-xl mx-auto">
              <Badge variant="outline" className="mb-4 text-red-600 border-red-200 bg-red-50 mx-auto flex w-fit items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" /> Interactive Sandbox
              </Badge>
              <h2 className="text-3xl font-bold text-zinc-900 mb-4">{currentStep.title}</h2>
              <p className="text-lg text-zinc-600">Can you spot the red flags in this suspicious email?</p>
            </div>
            <div className="flex justify-center">
              <PhishingSimulator />
            </div>
          </div>
        )
      case 'password':
        return (
          <div className="space-y-6">
            <div className="mb-8 text-center max-w-xl mx-auto">
              <Badge variant="outline" className="mb-4 text-indigo-600 border-indigo-200 bg-indigo-50 mx-auto flex w-fit items-center gap-1.5">
                <Lock className="w-3.5 h-3.5" /> Security Challenge
              </Badge>
              <h2 className="text-3xl font-bold text-zinc-900 mb-4">{currentStep.title}</h2>
              <p className="text-lg text-zinc-600">Think your password is strong? Let's put it to the test.</p>
            </div>
            <div className="flex justify-center">
              <PasswordChallenge />
            </div>
          </div>
        )
      case 'sort':
        return (
          <div className="space-y-6">
            <div className="mb-8 text-center max-w-xl mx-auto">
              <Badge variant="outline" className="mb-4 text-emerald-600 border-emerald-200 bg-emerald-50 mx-auto flex w-fit items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" /> Interactive Sorting
              </Badge>
              <h2 className="text-3xl font-bold text-zinc-900 mb-4">{currentStep.title}</h2>
              <p className="text-lg text-zinc-600">Review your daily habits and decide if they are safe or a security risk.</p>
            </div>
            <div className="flex justify-center">
              <SecuritySortGame />
            </div>
          </div>
        )
      case 'chat':
        return (
          <div className="space-y-6">
            <div className="mb-8 text-center max-w-xl mx-auto">
              <Badge variant="outline" className="mb-4 text-indigo-600 border-indigo-200 bg-indigo-50 mx-auto flex w-fit items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5" /> Social Engineering Sim
              </Badge>
              <h2 className="text-3xl font-bold text-zinc-900 mb-4">{currentStep.title}</h2>
              <p className="text-lg text-zinc-600">An attacker is trying to trick you. Choose your responses wisely.</p>
            </div>
            <div className="flex justify-center">
              <ChatSimulator />
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
              <h2 className="font-bold text-lg text-zinc-900 mb-2">{courseData?.title || "Cybersecurity Basics"}</h2>
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
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label={sidebarOpen ? "Collapse Syllabus" : "Expand Syllabus"}
            >
              <Menu className="w-5 h-5 text-zinc-500" />
            </Button>
            <h1 className="font-bold text-zinc-900">{courseData?.title || "Module 3: Social Engineering"}</h1>
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
