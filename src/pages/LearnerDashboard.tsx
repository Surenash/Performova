import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { PlayCircle, Trophy, Flame, Star, CheckCircle2, Lock, Shield, Award, Play, MessageSquare, X, Send, Gamepad2, BookOpen, Video } from "lucide-react"
import { cn } from "@/lib/utils"

export default function LearnerDashboard() {
  const navigate = useNavigate()
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [dashboardData, setDashboardData] = useState<{ path_nodes: any[], continue_courses: any[] }>({ path_nodes: [], continue_courses: [] })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/dashboard/learner')
      .then(res => res.json())
      .then(data => {
        setDashboardData(data)
        setLoading(false)
      })
      .catch(err => {
        console.error("Failed to fetch dashboard data:", err)
        setLoading(false)
      })
  }, [])

  const PATH_NODES = dashboardData.path_nodes
  const CONTINUE_COURSES = dashboardData.continue_courses

  if (loading) {
    return <div className="p-8 text-center text-zinc-500">Loading your learning path...</div>
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-zinc-900">Welcome back, Alex!</h1>
        <p className="text-zinc-600 mt-1">Let's keep that streak going</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content (Left) */}
        <div className="lg:col-span-2 space-y-8">

          {/* Stats Bar / Streak Card */}
          <div className="flex items-center justify-between bg-white rounded-2xl p-6 border border-zinc-200 shadow-sm">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <Flame className="w-6 h-6 text-orange-500" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-zinc-500 uppercase tracking-wider">Current Streak</p>
                  <span className="text-2xl font-bold text-zinc-900">14 Days</span>
                </div>
              </div>
              <div className="h-10 w-px bg-zinc-200 hidden sm:block"></div>
              <div className="flex items-center gap-3 hidden sm:flex">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Star className="w-6 h-6 text-yellow-500" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-zinc-500 uppercase tracking-wider">Total Points</p>
                  <span className="text-2xl font-bold text-zinc-900">1,250 XP</span>
                </div>
              </div>
            </div>
          </div>

          {/* Up Next Hero (Emergent style) */}
          <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl p-8 text-white relative overflow-hidden shadow-lg border border-indigo-500">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
              <div className="relative w-32 h-32 shrink-0">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="8" />
                  <circle cx="50" cy="50" r="45" fill="none" stroke="white" strokeWidth="8" strokeDasharray="283" strokeDashoffset="70" className="transition-all duration-1000 ease-out" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <span className="text-2xl font-bold text-white">75%</span>
                </div>
              </div>
              <div className="flex-1 text-center md:text-left">
                <p className="text-sm font-bold uppercase tracking-wide text-indigo-200 mb-2">Up Next</p>
                <h2 className="text-3xl font-bold mb-2">Social Engineering Tactics</h2>
                <p className="text-indigo-100 mb-6 max-w-lg">
                  Learn how attackers manipulate human psychology to gain access to secure systems.
                </p>

                <div className="flex items-center justify-center md:justify-start gap-6 mb-6">
                  <div>
                    <p className="text-sm text-indigo-200">Progress</p>
                    <p className="text-2xl font-bold">75%</p>
                  </div>
                  <div>
                    <p className="text-sm text-indigo-200">Lessons Left</p>
                    <p className="text-2xl font-bold">2</p>
                  </div>
                </div>

                <button className="h-12 px-8 rounded-full bg-white text-indigo-600 font-bold text-lg shadow-xl hover:scale-105 transition-transform flex items-center justify-center gap-2 w-full md:w-auto" onClick={() => navigate('/lesson/3')}>
                  <Play className="w-5 h-5 fill-indigo-600" />
                  Continue Learning
                </button>
              </div>
            </div>
          </div>

          {/* Learning Path (Studio style) */}
          <div className="bg-white rounded-2xl border border-zinc-200 p-8 shadow-sm">
            <h3 className="text-xl font-bold text-zinc-900 mb-8">Your Path: Cybersecurity Basics</h3>
            <div className="relative">
              {/* Path Line */}
              <div className="absolute left-8 top-4 bottom-4 w-1 bg-zinc-100 rounded-full md:left-1/2 md:-translate-x-1/2"></div>

              <div className="space-y-8 relative">
                {PATH_NODES.map((node, index) => {
                  const isEven = index % 2 === 0
                  return (
                    <div key={node.id} className={cn("flex items-center md:justify-start", isEven ? "md:flex-row-reverse" : "")}>
                      <div className={cn("hidden md:block w-1/2", isEven ? "pl-12 text-left" : "pr-12 text-right")}>
                        <h4 className={cn("font-bold text-lg", node.status === 'locked' ? "text-zinc-400" : "text-zinc-900")}>{node.title}</h4>
                        <p className="text-sm text-zinc-500 capitalize">{node.type}</p>
                      </div>

                      <div className="relative z-10 flex items-center justify-center ml-4 md:ml-0 md:mx-auto">
                        <div
                          onClick={() => node.status !== 'locked' && navigate(`/lesson/${node.id}`)}
                          className={cn(
                            "w-12 h-12 md:w-16 md:h-16 rounded-full border-4 flex items-center justify-center shadow-sm transition-transform hover:scale-105 cursor-pointer relative bg-white",
                            node.status === 'completed' ? "border-emerald-500 text-emerald-500" :
                              node.status === 'current' ? "border-indigo-600 text-indigo-600 ring-4 ring-indigo-100" :
                                "border-zinc-200 text-zinc-400 cursor-not-allowed hover:scale-100"
                          )}>
                          {node.status === 'completed' ? <CheckCircle2 className="w-6 h-6 md:w-8 md:h-8" /> :
                            node.status === 'locked' ? <Lock className="w-5 h-5 md:w-6 md:h-6" /> :
                              <span className="font-bold text-lg">{index + 1}</span>}
                        </div>
                      </div>

                      <div className="md:hidden ml-6 flex-1 bg-zinc-50 rounded-xl p-4 border border-zinc-100">
                        <h4 className={cn("font-bold", node.status === 'locked' ? "text-zinc-400" : "text-zinc-900")}>{node.title}</h4>
                        <p className="text-sm text-zinc-500 capitalize">{node.type}</p>
                        {node.status === 'completed' && <p className="text-xs text-emerald-600 mt-1 font-semibold">Completed ✓</p>}
                        {node.status === 'current' && <p className="text-xs text-indigo-600 mt-1 font-semibold">In progress - Keep going!</p>}
                      </div>

                      <div className="hidden md:block w-1/2"></div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Continue Learning */}
          <div>
            <h3 className="text-xl font-bold text-zinc-900 mb-6">Continue Learning</h3>
            <div className="grid sm:grid-cols-2 gap-6">
              {CONTINUE_COURSES.map((course) => (
                <Card key={course.id} className="hover:border-indigo-200 transition-colors cursor-pointer" onClick={() => navigate(`/lesson/${course.id}`)}>
                  <CardContent className="p-6">
                    <h4 className="font-bold text-zinc-900 mb-2">{course.title}</h4>
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-sm text-zinc-500">{course.lessonsLeft} lessons left</p>
                      <span className="text-sm font-bold text-indigo-600">{course.progress}%</span>
                    </div>
                    <div className="h-2 w-full bg-zinc-100 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${course.progress}%` }}></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Lessons will now be handled inside the LessonPlayer */}
        </div>

        {/* Sidebar (Right) */}
        <div className="space-y-8">

          {/* Rank Teaser */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border-2 border-amber-200 p-6 text-center shadow-sm">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4 border border-amber-200">
              <Trophy className="w-8 h-8 text-amber-600" />
            </div>
            <h3 className="text-xl font-bold text-zinc-900 mb-2">You're Rank #3</h3>
            <p className="text-sm text-zinc-600 mb-4">In your company this week</p>
            <Button variant="outline" className="w-full border-amber-200 text-amber-700 hover:bg-amber-100 hover:text-amber-800">
              View Leaderboard
            </Button>
          </div>

          {/* Badges */}
          <div className="bg-white rounded-2xl border border-zinc-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-zinc-900">Your Badges</h3>
              <Badge variant="secondary" className="bg-indigo-50 text-indigo-700">6 Earned</Badge>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col items-center p-4 bg-zinc-50 rounded-xl border border-zinc-100 text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-3">
                  <Shield className="w-6 h-6 text-purple-600" />
                </div>
                <p className="font-semibold text-zinc-900 text-sm">Security Pro</p>
              </div>

              <div className="flex flex-col items-center p-4 bg-zinc-50 rounded-xl border border-zinc-100 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                  <Award className="w-6 h-6 text-blue-600" />
                </div>
                <p className="font-semibold text-zinc-900 text-sm">Fast Learner</p>
              </div>

              <div className="flex flex-col items-center p-4 bg-zinc-50 rounded-xl border border-zinc-100 border-dashed opacity-50 text-center">
                <div className="w-12 h-12 bg-zinc-100 rounded-full flex items-center justify-center mb-3">
                  <Lock className="w-6 h-6 text-zinc-400" />
                </div>
                <p className="font-semibold text-zinc-500 text-sm">Phishing Expert</p>
              </div>

              <div className="flex flex-col items-center p-4 bg-zinc-50 rounded-xl border border-zinc-100 border-dashed opacity-50 text-center">
                <div className="w-12 h-12 bg-zinc-100 rounded-full flex items-center justify-center mb-3">
                  <Lock className="w-6 h-6 text-zinc-400" />
                </div>
                <p className="font-semibold text-zinc-500 text-sm">Data Guardian</p>
              </div>
            </div>
          </div>

          {/* Stats Summary */}
          <div className="bg-white rounded-2xl border border-zinc-200 p-6 shadow-sm">
            <h3 className="text-lg font-bold text-zinc-900 mb-6">Your Stats</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-zinc-600">Courses in Progress</span>
                <span className="text-lg font-bold text-indigo-600">2</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-zinc-600">Courses Completed</span>
                <span className="text-lg font-bold text-emerald-600">8</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-zinc-600">Total Courses</span>
                <span className="text-lg font-bold text-zinc-900">12</span>
              </div>
              <div className="pt-6 mt-6 border-t border-zinc-100">
                <div className="text-center p-4 bg-zinc-50 rounded-xl border border-zinc-200">
                  <p className="text-sm font-medium text-zinc-600 mb-1">Overall Progress</p>
                  <p className="text-3xl font-bold text-indigo-600">66%</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Floating AI Chatbot */}
      <div className="fixed bottom-6 right-6 z-50">
        {isChatOpen ? (
          <div className="bg-white rounded-2xl shadow-2xl border border-zinc-200 w-80 sm:w-96 flex flex-col overflow-hidden transition-all duration-300 transform origin-bottom-right">
            {/* Chat Header */}
            <div className="bg-indigo-600 p-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <MessageSquare className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-sm">Performova AI Coach</h4>
                  <p className="text-xs text-indigo-100">Online</p>
                </div>
              </div>
              <button
                onClick={() => setIsChatOpen(false)}
                className="text-white hover:bg-white/20 p-1 rounded-full transition-colors"
                aria-label="Close AI Chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Body */}
            <div className="flex-1 bg-zinc-50 p-4 h-80 overflow-y-auto flex flex-col gap-4">
              <div className="flex gap-3">
                <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center shrink-0">
                  <span className="font-bold text-indigo-600 text-xs">AI</span>
                </div>
                <div className="bg-white border border-zinc-200 p-3 rounded-2xl rounded-tl-none shadow-sm text-sm text-zinc-700 max-w-[85%]">
                  Hi Alex! Great job on your 14-day streak. Keep it up! Do you have any questions about the <strong>Social Engineering Tactics</strong> module?
                </div>
              </div>
            </div>

            {/* Chat Input */}
            <div className="p-3 border-t border-zinc-200 bg-white">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Ask a question..."
                  className="flex-1 bg-zinc-100 border-none rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white shrink-0 hover:bg-indigo-700 transition-colors"
                  aria-label="Send message"
                >
                  <Send className="w-4 h-4 ml-1" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setIsChatOpen(true)}
            className="w-14 h-14 bg-indigo-600 text-white rounded-full flex items-center justify-center shadow-xl hover:bg-indigo-700 hover:scale-105 transition-all duration-200"
            aria-label="Open AI Chat"
          >
            <MessageSquare className="w-6 h-6" />
          </button>
        )}
      </div>
    </div>
  )
}
