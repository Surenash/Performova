import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, XCircle, ChevronLeft, Menu, PlayCircle, FileText, MousePointer2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

const SYLLABUS = [
  { id: 1, title: "Introduction to Phishing", type: "video", duration: "2:30", completed: true },
  { id: 2, title: "Identifying Suspicious Links", type: "interactive", duration: "5:00", completed: false, current: true },
  { id: 3, title: "Reporting Protocols", type: "text", duration: "3:00", completed: false },
  { id: 4, title: "Knowledge Check", type: "quiz", duration: "4:00", completed: false },
]

export default function LessonPlayer() {
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)

  const handleCheckAnswer = () => {
    if (selectedAnswer === 1) { // Assuming index 1 is correct for demo
      setIsCorrect(true)
    } else {
      setIsCorrect(false)
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
                <ChevronLeft className="w-4 h-4 mr-1" /> Back to Course
              </Button>
            </div>
            <div className="p-6 flex-1 overflow-y-auto w-[320px]">
              <h2 className="font-bold text-lg text-zinc-900 mb-2">Phishing Defense</h2>
              <div className="flex items-center gap-3 mb-6">
                <Progress value={25} className="h-2 flex-1" />
                <span className="text-xs font-medium text-zinc-500">25%</span>
              </div>
              <div className="space-y-1">
                {SYLLABUS.map((item, index) => (
                  <button
                    key={item.id}
                    className={cn(
                      "w-full flex items-start gap-3 p-3 rounded-lg text-left transition-colors",
                      item.current ? "bg-indigo-50 text-indigo-900" : "hover:bg-zinc-100 text-zinc-600"
                    )}
                  >
                    <div className="mt-0.5 shrink-0">
                      {item.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                      ) : (
                        <div className={cn(
                          "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                          item.current ? "border-indigo-500" : "border-zinc-300"
                        )}>
                          <span className="text-[10px] font-medium">{index + 1}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={cn("text-sm font-medium truncate", item.current && "text-indigo-700")}>{item.title}</p>
                      <div className="flex items-center gap-2 mt-1 text-xs text-zinc-500 opacity-80">
                        {item.type === 'video' && <PlayCircle className="w-3 h-3" />}
                        {item.type === 'interactive' && <MousePointer2 className="w-3 h-3" />}
                        {item.type === 'text' && <FileText className="w-3 h-3" />}
                        <span className="capitalize">{item.type} &bull; {item.duration}</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Stage */}
      <main className="flex-1 flex flex-col relative overflow-hidden bg-white">
        <header className="h-16 border-b border-zinc-200 flex items-center px-4 shrink-0 justify-between">
          <div className="flex items-center gap-4">
            {!sidebarOpen && (
              <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)}>
                <Menu className="w-5 h-5" />
              </Button>
            )}
            <h1 className="font-semibold text-zinc-900">Identifying Suspicious Links</h1>
          </div>
          <Button variant="outline" size="sm">Report Issue</Button>
        </header>

        <div className="flex-1 overflow-y-auto p-6 md:p-12 flex justify-center">
          <div className="max-w-2xl w-full">
            <div className="mb-8">
              <Badge variant="outline" className="mb-4 text-indigo-600 border-indigo-200 bg-indigo-50">Interactive Exercise</Badge>
              <h2 className="text-3xl font-bold text-zinc-900 mb-4">Spot the fake URL</h2>
              <p className="text-lg text-zinc-600">
                Attackers often use URLs that look very similar to legitimate ones. Which of the following links is most likely a phishing attempt?
              </p>
            </div>

            <div className="space-y-4">
              {[
                "https://www.paypal.com/login",
                "https://www.paypaI.com/secure-login", // The 'l' is an uppercase 'i'
                "https://account.paypal.com/auth"
              ].map((url, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => {
                    setSelectedAnswer(index)
                    setIsCorrect(null)
                  }}
                  className={cn(
                    "w-full p-6 rounded-xl border-2 text-left transition-all",
                    selectedAnswer === index 
                      ? "border-indigo-500 bg-indigo-50" 
                      : "border-zinc-200 hover:border-indigo-300 bg-white"
                  )}
                >
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors",
                      selectedAnswer === index ? "border-indigo-500 bg-indigo-500" : "border-zinc-300"
                    )}>
                      {selectedAnswer === index && <div className="w-2.5 h-2.5 bg-white rounded-full" />}
                    </div>
                    <code className="text-lg text-zinc-800 font-mono bg-zinc-100 px-3 py-1 rounded-md">{url}</code>
                  </div>
                </motion.button>
              ))}
            </div>

            <AnimatePresence>
              {isCorrect !== null && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={cn(
                    "mt-8 p-6 rounded-xl flex items-start gap-4",
                    isCorrect ? "bg-emerald-50 text-emerald-900" : "bg-red-50 text-red-900"
                  )}
                >
                  {isCorrect ? (
                    <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-6 h-6 text-red-600 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <h4 className="font-bold text-lg mb-1">
                      {isCorrect ? "Excellent work!" : "Not quite right."}
                    </h4>
                    <p className="opacity-90">
                      {isCorrect 
                        ? "You correctly identified the homograph attack. The second URL uses an uppercase 'I' instead of a lowercase 'l'." 
                        : "Look closely at the characters in the domain name. Attackers often substitute similar-looking letters."}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Sticky Action Bar */}
        <div className="border-t border-zinc-200 bg-white p-4 shrink-0 flex justify-between items-center px-6">
          <Button variant="ghost" className="text-zinc-500">Skip for now</Button>
          <Button 
            size="lg" 
            className={cn(
              "min-w-[160px] text-white transition-colors",
              isCorrect ? "bg-emerald-600 hover:bg-emerald-700" : 
              isCorrect === false ? "bg-red-600 hover:bg-red-700 animate-shake" : 
              "bg-indigo-600 hover:bg-indigo-700"
            )}
            disabled={selectedAnswer === null}
            onClick={isCorrect ? () => console.log("Next lesson") : handleCheckAnswer}
          >
            {isCorrect ? "Continue" : isCorrect === false ? "Try Again" : "Check Answer"}
          </Button>
        </div>
      </main>
    </div>
  )
}


