import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, PlayCircle, Trophy, Zap, Flame, Award, MessageSquare, Play } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { Link } from "react-router-dom"
import QuickQuizDemo from "@/components/demos/QuickQuizDemo"
import ProtocolMatchGame from "@/components/demos/ProtocolMatchGame"

export default function LandingPage() {
  const [annual, setAnnual] = useState(true)

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-zinc-50 pt-24 pb-32">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="max-w-2xl">
              <Badge variant="secondary" className="mb-6 bg-indigo-100 text-indigo-700 hover:bg-indigo-200">
                <Zap className="w-3 h-3 mr-1" /> AI-Driven Corporate Training
              </Badge>
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-zinc-900 mb-6 leading-[1.1]">
                Train your team <span className="text-indigo-600">without the yawns.</span>
              </h1>
              <p className="text-lg text-zinc-600 mb-8 max-w-lg">
                Performova turns boring compliance and onboarding into bite-sized, gamified learning experiences your employees will actually enjoy.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white h-14 px-8 text-lg rounded-xl" asChild>
                  <Link to="/login">Start Your Team's Training</Link>
                </Button>
                <Button size="lg" variant="outline" className="h-14 px-8 text-lg rounded-xl border-zinc-300" asChild>
                  <Link to="/login"><PlayCircle className="w-5 h-5 mr-2" /> Watch Demo</Link>
                </Button>
              </div>
            </div>

            {/* Interactive Hero Animation */}
            <div className="relative h-[600px] w-full hidden lg:block">

              {/* Card 1: 7 Day Streak */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="absolute top-0 right-12 w-72 z-10"
              >
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="bg-white rounded-2xl shadow-xl border border-zinc-100 p-6 w-full"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                        <Trophy className="w-5 h-5 text-orange-600" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-zinc-900">7 Day Streak!</p>
                        <p className="text-xs text-zinc-500">Cybersecurity Basics</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="h-2 w-full bg-zinc-100 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: "0%" }}
                        animate={{ width: "85%" }}
                        transition={{ duration: 1.5, delay: 0.5 }}
                        className="h-full bg-indigo-500 rounded-full"
                      />
                    </div>
                    <p className="text-xs text-right text-zinc-500 font-medium">85% Complete</p>
                  </div>
                </motion.div>
              </motion.div>

              {/* Card 2: Interactive Quick Quiz */}
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="absolute top-32 left-0 w-80 z-20"
              >
                <motion.div
                  animate={{ y: [0, 8, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                >
                  <QuickQuizDemo />
                </motion.div>
              </motion.div>

              {/* Card 3: Sarah's Learning Streak (From Emergent) */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="absolute top-48 right-0 w-80 z-30"
              >
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  className="relative bg-white rounded-3xl shadow-2xl p-6 border-2 border-zinc-100 w-full"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-indigo-100">
                      <img src="https://i.pravatar.cc/150?img=5" alt="Sarah" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <p className="font-bold text-zinc-900">Sarah's Learning Streak</p>
                      <p className="text-sm text-zinc-600">12 days in a row!</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {[85, 70, 100].map((progress, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                        <div className="flex-1">
                          <div className="w-full bg-zinc-100 rounded-full h-2.5 overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${progress}%` }}
                              transition={{ duration: 1.5, delay: i * 0.3 + 1.5, ease: "easeOut" }}
                              className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full rounded-full"
                            />
                          </div>
                        </div>
                        <span className="text-xs font-bold text-indigo-600 w-8 text-right shrink-0">{progress}%</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-200">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
                        <Flame className="w-5 h-5 text-amber-600" />
                      </div>
                      <span className="text-sm font-bold text-amber-900">+50 points today!</span>
                    </div>
                  </div>

                  {/* Moving Badge */}
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute -top-8 -right-8 w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg border-4 border-white"
                  >
                    <Trophy className="w-8 h-8 text-white" />
                  </motion.div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Strip - Moving Belt */}
      <section className="py-10 border-y border-zinc-200 bg-white overflow-hidden">
        <div className="container mx-auto px-4 mb-6">
          <p className="text-center text-sm font-medium text-zinc-500 uppercase tracking-wider">Trusted by forward-thinking companies</p>
        </div>
        <div className="flex w-[200%] gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
          <motion.div
            className="flex gap-8 md:gap-16 min-w-full justify-around items-center"
            animate={{ x: ["0%", "-100%"] }}
            transition={{ duration: 25, ease: "linear", repeat: Infinity }}
          >
            {['Acme Corp', 'GlobalTech', 'InnovateInc', 'Nexus', 'Stark Ind', 'TechCorp', 'GlobalSolutions', 'FutureWorks', 'NextGen'].map((company, index) => (
              <div key={`${company}-${index}`} className="text-xl font-bold font-serif text-zinc-800 flex items-center gap-2 whitespace-nowrap">
                <div className="w-6 h-6 rounded-full bg-zinc-800 shrink-0"></div>
                {company}
              </div>
            ))}
          </motion.div>
          <motion.div
            className="flex gap-8 md:gap-16 min-w-full justify-around items-center"
            animate={{ x: ["0%", "-100%"] }}
            transition={{ duration: 25, ease: "linear", repeat: Infinity }}
          >
            {['Acme Corp', 'GlobalTech', 'InnovateInc', 'Nexus', 'Stark Ind', 'TechCorp', 'GlobalSolutions', 'FutureWorks', 'NextGen'].map((company, index) => (
              <div key={`${company}-${index}-dup`} className="text-xl font-bold font-serif text-zinc-800 flex items-center gap-2 whitespace-nowrap">
                <div className="w-6 h-6 rounded-full bg-zinc-800 shrink-0"></div>
                {company}
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white">
        <div className="container mx-auto px-4 space-y-32">

          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-zinc-900 mb-4">
              Learning Tools Your Team Will <span className="text-indigo-600">Actually Use</span>
            </h2>
            <p className="text-xl text-zinc-600">
              Built for the modern workplace. Designed to drive real engagement and measurable results.
            </p>
          </div>

          {/* Feature 1: AI-Powered Learning Paths */}
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <Badge variant="outline" className="mb-4 text-indigo-700 border-indigo-200 bg-indigo-50">AI-Powered Learning Paths</Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-4">Personalized learning at scale.</h2>
              <p className="text-lg text-zinc-600 mb-6">
                Our AI analyzes each employee's role, knowledge gaps, and learning speed to automatically generate a custom curriculum.
              </p>
              <ul className="space-y-3">
                {['Dynamic course difficulty', 'Role-based curriculum mapping', 'Automated progress tracking'].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-zinc-700">
                    <CheckCircle2 className="w-5 h-5 text-indigo-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-zinc-50 rounded-3xl p-8 border border-zinc-100 shadow-sm relative overflow-hidden flex items-center justify-center">
              {/* Decorative background elements */}
              <div className="absolute top-10 right-10 w-32 h-32 bg-indigo-100 rounded-full blur-3xl opacity-50"></div>
              <div className="absolute bottom-10 left-10 w-32 h-32 bg-purple-100 rounded-full blur-3xl opacity-50"></div>

              <div className="relative z-10 w-full max-w-sm space-y-4">
                {[
                  { title: "Phishing Basics", status: "completed", type: "Required" },
                  { title: "Data Security", status: "current", type: "AI Recommended" },
                  { title: "Advanced Threats", status: "locked", type: "Up Next" }
                ].map((node, i) => (
                  <motion.div
                    key={node.title}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.2 }}
                    className={cn(
                      "p-4 rounded-xl border flex items-center justify-between shadow-sm bg-white",
                      node.status === 'completed' ? "border-emerald-200" :
                        node.status === 'current' ? "border-indigo-400 ring-2 ring-indigo-50" :
                          "border-zinc-200 opacity-70"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center",
                        node.status === 'completed' ? "bg-emerald-100 text-emerald-600" :
                          node.status === 'current' ? "bg-indigo-100 text-indigo-600" :
                            "bg-zinc-100 text-zinc-400"
                      )}>
                        {node.status === 'completed' ? <CheckCircle2 className="w-4 h-4" /> : <Award className="w-4 h-4" />}
                      </div>
                      <div>
                        <p className={cn("font-bold text-sm", node.status === 'locked' ? 'text-zinc-500' : 'text-zinc-900')}>{node.title}</p>
                        <p className="text-xs text-zinc-500">{node.type}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Feature 2: Interactive Learning (Studio) */}
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="order-2 md:order-1 bg-zinc-50 rounded-3xl p-8 border border-zinc-100 shadow-sm relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-transparent opacity-50"></div>
              <div className="relative z-10">
                <ProtocolMatchGame />
              </div>
            </div>
            <div className="order-1 md:order-2">
              <Badge variant="outline" className="mb-4">Interactive Learning</Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-4">Ditch the hour-long videos.</h2>
              <p className="text-lg text-zinc-600 mb-6">
                Break complex topics into 5-minute interactive lessons. Employees learn by doing, not just watching.
              </p>
              <ul className="space-y-3">
                {['Drag-and-drop exercises', 'Immediate feedback loops', 'Bite-sized modules'].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-zinc-700">
                    <CheckCircle2 className="w-5 h-5 text-indigo-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Feature 2: Gamification (Emergent) - Updated Zig-Zag (Text Left, Visual Right) */}
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <Badge variant="outline" className="mb-4 text-purple-700 border-purple-200 bg-purple-50">Gamification That Works</Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-4">Turn learning into a habit.</h2>
              <p className="text-lg text-zinc-600 mb-6">
                Streaks, badges, and rewards that turn mandatory training into a daily habit your team actually enjoys completing.
              </p>
              <Button variant="link" className="px-0 text-indigo-600 hover:text-indigo-700">See Leaderboards &rarr;</Button>
            </div>
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl p-8 shadow-inner border border-zinc-100 relative overflow-hidden">
              <div className="relative z-10 grid grid-cols-2 gap-4">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-zinc-100 text-center flex flex-col items-center justify-center">
                  <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mb-3">
                    <Flame className="w-6 h-6 text-amber-600" />
                  </div>
                  <p className="font-bold text-2xl text-zinc-900">14 Days</p>
                  <p className="text-xs text-zinc-500 font-medium uppercase tracking-wide">Current Streak</p>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-zinc-100 text-center flex flex-col items-center justify-center">
                  <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-3">
                    <Award className="w-6 h-6 text-indigo-600" />
                  </div>
                  <p className="font-bold text-2xl text-zinc-900">Level 5</p>
                  <p className="text-xs text-zinc-500 font-medium uppercase tracking-wide">Security Pro</p>
                </div>
                <div className="col-span-2 bg-white rounded-2xl p-5 shadow-sm border border-zinc-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                      <Trophy className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-sm text-zinc-900">Weekly Leaderboard</p>
                      <p className="text-xs text-zinc-500">You are in Top 10%</p>
                    </div>
                  </div>
                  <Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-none">#3 Rank</Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Feature 3: Analytics (Studio / Emergent blend) - Zig Zag (Text Right, Visual Left) */}
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="order-2 md:order-1 bg-zinc-50 rounded-3xl p-8 border border-zinc-100 shadow-sm relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-transparent opacity-50"></div>
              <div className="relative z-10">
                <div className="flex justify-between items-end mb-8 bg-white p-4 rounded-2xl shadow-sm border border-zinc-100">
                  <div>
                    <p className="text-zinc-500 text-sm mb-1 font-medium">Team Completion</p>
                    <p className="text-4xl font-bold text-zinc-900">92%</p>
                  </div>
                  <Badge className="bg-emerald-100 text-emerald-700 border-none">+14% this month</Badge>
                </div>
                <div className="space-y-4 bg-white p-6 rounded-2xl shadow-sm border border-zinc-100">
                  {[
                    { name: 'Engineering', val: 98 },
                    { name: 'Sales', val: 85 },
                    { name: 'Marketing', val: 90 }
                  ].map(dept => (
                    <div key={dept.name}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-zinc-600 font-medium">{dept.name}</span>
                        <span className="font-mono text-zinc-900">{dept.val}%</span>
                      </div>
                      <div className="h-2 bg-zinc-100 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${dept.val}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1.5, ease: "easeOut" }}
                          className="h-full bg-indigo-500 rounded-full"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="order-1 md:order-2">
              <Badge variant="outline" className="mb-4">Real-Time Analytics</Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-4">Bird's-eye view of team health.</h2>
              <p className="text-lg text-zinc-600 mb-6">
                Track team progress, identify knowledge gaps, and measure training ROI instantly without chasing people down for compliance.
              </p>
              <Button variant="link" className="px-0 text-indigo-600 hover:text-indigo-700">Explore Admin Features &rarr;</Button>
            </div>
          </div>

          {/* Feature 4: AI Chatbot (Previously Feature 5) */}
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <Badge variant="outline" className="mb-4 text-emerald-700 border-emerald-200 bg-emerald-50">24/7 Support</Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-4">Always-on AI Coaching.</h2>
              <p className="text-lg text-zinc-600 mb-6">
                An intelligent chatbot lives right inside the learner dashboard, ready to answer questions, test knowledge, and provide instant feedback on course material.
              </p>
              <ul className="space-y-3">
                {['Answers based purely on your content', 'Context-aware explanations', 'Interactive quick-quizzes'].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-zinc-700">
                    <CheckCircle2 className="w-5 h-5 text-indigo-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-zinc-50 rounded-3xl p-8 border border-zinc-100 shadow-sm relative overflow-hidden flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-tr from-emerald-100/50 via-teal-50 to-transparent"></div>

              <div className="relative z-10 w-full max-w-sm bg-white rounded-2xl shadow-xl border border-zinc-200 overflow-hidden">
                <div className="bg-indigo-600 p-4 flex items-center gap-3 text-white">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <MessageSquare className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">Performova AI</h4>
                    <p className="text-xs text-indigo-100">Usually replies instantly</p>
                  </div>
                </div>
                <div className="p-4 h-48 bg-zinc-50 space-y-4 flex flex-col justify-end">
                  <div className="bg-indigo-600 text-white p-3 rounded-2xl rounded-br-none shadow-sm text-sm self-end max-w-[80%]">
                    What's the main difference between phishing and spear-phishing?
                  </div>
                  <div className="bg-white border border-zinc-200 p-3 rounded-2xl rounded-tl-none shadow-sm text-sm self-start max-w-[85%] text-zinc-700">
                    <strong>Phishing</strong> is a broad attack sent to many people. <strong>Spear-phishing</strong> is highly targeted towards a specific individual or organization using personalized information!
                  </div>
                </div>
                <div className="p-3 border-t border-zinc-200 bg-white shadow-inner flex gap-2">
                  <div className="flex-1 bg-zinc-100 rounded-full px-4 py-2 text-sm text-zinc-400">Type a message...</div>
                  <div className="w-9 h-9 bg-indigo-600 rounded-full flex items-center justify-center text-white">
                    <Play className="w-3 h-3 ml-0.5" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Feature 5: Custom Content Upload (Previously Feature 4) */}
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="order-2 md:order-1 bg-zinc-50 rounded-3xl p-8 border border-zinc-100 shadow-sm relative overflow-hidden">
              <div className="relative z-10 bg-white rounded-xl shadow-sm border border-zinc-200 border-dashed p-10 flex flex-col items-center justify-center text-center hover:border-indigo-400 hover:bg-indigo-50/30 transition-colors cursor-pointer">
                <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mb-4">
                  <Zap className="w-8 h-8 text-zinc-400" />
                </div>
                <h4 className="font-bold text-zinc-900 mb-2">Upload Custom Course</h4>
                <p className="text-sm text-zinc-500 max-w-xs mb-6">Drag and drop PDFs, Videos, or SCORM packages here, or click to browse.</p>
                <Button size="sm" variant="secondary" className="pointer-events-none">Select Files</Button>
              </div>
            </div>
            <div className="order-1 md:order-2">
              <Badge variant="outline" className="mb-4">Custom Content</Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-4">Bring your own materials.</h2>
              <p className="text-lg text-zinc-600 mb-6">
                Upload your own videos, documents, and materials. We provide the learning infrastructure, you bring the knowledge.
              </p>
              <ul className="space-y-3">
                {['Supports PDF, MP4, SCORM', 'Automatic quiz generation via AI', 'Version control built-in'].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-zinc-700">
                    <CheckCircle2 className="w-5 h-5 text-indigo-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 bg-zinc-50 border-t border-zinc-200">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-4">Simple, transparent pricing</h2>
            <p className="text-lg text-zinc-600 mb-8">Choose the plan that fits your team's size and needs.</p>
            <div className="flex items-center justify-center gap-4">
              <span className={cn("text-sm font-medium", !annual ? "text-zinc-900" : "text-zinc-500")}>Monthly</span>
              <Switch checked={annual} onCheckedChange={setAnnual} />
              <span className={cn("text-sm font-medium", annual ? "text-zinc-900" : "text-zinc-500")}>Annually <Badge variant="secondary" className="ml-1 text-[10px] bg-emerald-100 text-emerald-700">Save 20%</Badge></span>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Starter */}
            <Card className="border-zinc-200 shadow-sm">
              <CardHeader>
                <CardTitle>Starter</CardTitle>
                <CardDescription>Perfect for small teams getting started.</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">${annual ? '8' : '10'}</span>
                  <span className="text-zinc-500">/user/mo</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm text-zinc-600">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-indigo-500" /> Up to 50 users</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-indigo-500" /> Basic course library</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-indigo-500" /> Standard reporting</li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full" variant="outline">Start Free Trial</Button>
              </CardFooter>
            </Card>

            {/* Growth */}
            <Card className="border-indigo-600 shadow-md relative">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <Badge className="bg-indigo-600 text-white hover:bg-indigo-700 border-none">Most Popular</Badge>
              </div>
              <CardHeader>
                <CardTitle>Growth</CardTitle>
                <CardDescription>For growing companies with custom needs.</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">${annual ? '15' : '19'}</span>
                  <span className="text-zinc-500">/user/mo</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm text-zinc-600">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-indigo-500" /> Up to 250 users</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-indigo-500" /> Custom content upload</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-indigo-500" /> Advanced analytics</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-indigo-500" /> AI Tutor access</li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white" asChild>
                  <Link to="/login">Get Started</Link>
                </Button>
              </CardFooter>
            </Card>

            {/* Enterprise */}
            <Card className="border-zinc-200 shadow-sm">
              <CardHeader>
                <CardTitle>Enterprise</CardTitle>
                <CardDescription>For large organizations needing control.</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">Custom</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm text-zinc-600">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-indigo-500" /> Unlimited users</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-indigo-500" /> Dedicated success manager</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-indigo-500" /> SSO & API access</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-indigo-500" /> Custom integrations</li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full" variant="outline">Contact Sales</Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
