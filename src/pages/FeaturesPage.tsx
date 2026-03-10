import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    CheckCircle2,
    Zap,
    Brain,
    Gamepad2,
    BarChart3,
    Upload,
    MessageSquare,
    ShieldCheck,
    Users,
    Globe,
    PlayCircle,
    Award,
    Flame,
    Trophy,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Link } from "react-router-dom"
import ProtocolMatchGame from "@/components/demos/ProtocolMatchGame"
import FlashcardDemo from "@/components/demos/FlashcardDemo"

const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" as const },
    }),
}

const features = [
    {
        icon: Brain,
        title: "AI-Powered Learning Paths",
        description:
            "Our AI analyzes each employee's role, knowledge gaps, and learning speed to automatically generate a custom curriculum.",
        color: "indigo",
        details: [
            "Dynamic course difficulty",
            "Role-based curriculum mapping",
            "Automated progress tracking",
            "Adaptive learning pacing",
        ],
    },
    {
        icon: Gamepad2,
        title: "Gamification That Works",
        description:
            "Streaks, badges, and rewards that turn mandatory training into a daily habit your team actually enjoys completing.",
        color: "purple",
        details: [
            "Daily streak tracking",
            "Achievement badges",
            "Team leaderboards",
            "Point-based rewards system",
        ],
    },
    {
        icon: BarChart3,
        title: "Real-Time Analytics",
        description:
            "Track team progress, identify knowledge gaps, and measure training ROI instantly without chasing people down for compliance.",
        color: "emerald",
        details: [
            "Department-level reporting",
            "Individual progress tracking",
            "Compliance dashboards",
            "Export-ready reports",
        ],
    },
    {
        icon: Upload,
        title: "Custom Content Upload",
        description:
            "Upload your own videos, documents, and materials. We provide the learning infrastructure, you bring the knowledge.",
        color: "amber",
        details: [
            "Supports PDF, MP4, SCORM",
            "Automatic quiz generation via AI",
            "Version control built-in",
            "Drag & drop interface",
        ],
    },
    {
        icon: MessageSquare,
        title: "24/7 AI Coaching",
        description:
            "An intelligent chatbot lives right inside the learner dashboard, ready to answer questions and test knowledge.",
        color: "teal",
        details: [
            "Answers based on your content",
            "Context-aware explanations",
            "Interactive quick-quizzes",
            "Multi-language support",
        ],
    },
    {
        icon: ShieldCheck,
        title: "Enterprise Security",
        description:
            "SOC 2 compliant infrastructure with SSO, SAML, and role-based access controls to keep your data safe.",
        color: "red",
        details: [
            "SSO & SAML integration",
            "Role-based access control",
            "Data encryption at rest",
            "Audit logging",
        ],
    },
]

const colorMap: Record<string, { bg: string; text: string; ring: string; lightBg: string }> = {
    indigo: { bg: "bg-indigo-100", text: "text-indigo-600", ring: "ring-indigo-200", lightBg: "bg-indigo-50" },
    purple: { bg: "bg-purple-100", text: "text-purple-600", ring: "ring-purple-200", lightBg: "bg-purple-50" },
    emerald: { bg: "bg-emerald-100", text: "text-emerald-600", ring: "ring-emerald-200", lightBg: "bg-emerald-50" },
    amber: { bg: "bg-amber-100", text: "text-amber-600", ring: "ring-amber-200", lightBg: "bg-amber-50" },
    teal: { bg: "bg-teal-100", text: "text-teal-600", ring: "ring-teal-200", lightBg: "bg-teal-50" },
    red: { bg: "bg-red-100", text: "text-red-600", ring: "ring-red-200", lightBg: "bg-red-50" },
}

export default function FeaturesPage() {
    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-zinc-50 pt-32 pb-20">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none"></div>
                <div className="container mx-auto px-4 relative z-10 text-center">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                        <Badge variant="secondary" className="mb-6 bg-indigo-100 text-indigo-700 hover:bg-indigo-200">
                            <Zap className="w-3 h-3 mr-1" /> Platform Features
                        </Badge>
                        <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-zinc-900 mb-4">
                            Everything you need to <span className="text-indigo-600">train smarter.</span>
                        </h1>
                        <p className="text-lg text-zinc-600 max-w-2xl mx-auto mb-10">
                            From AI-powered learning paths to real-time analytics, Performova gives you the tools to make training effective and engaging.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white h-14 px-8 text-lg rounded-xl" asChild>
                                <Link to="/login">Start Free Trial</Link>
                            </Button>
                            <Button size="lg" variant="outline" className="h-14 px-8 text-lg rounded-xl border-zinc-300" asChild>
                                <Link to="/pricing"><PlayCircle className="w-5 h-5 mr-2" /> See Pricing</Link>
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Stats Strip */}
            <section className="py-12 bg-white border-b border-zinc-100">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
                        {[
                            { value: "10K+", label: "Active Learners", icon: Users },
                            { value: "500+", label: "Companies", icon: Globe },
                            { value: "98%", label: "Completion Rate", icon: Award },
                            { value: "4.9/5", label: "User Rating", icon: Trophy },
                        ].map((stat, i) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="text-center"
                            >
                                <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center mx-auto mb-3">
                                    <stat.icon className="w-5 h-5 text-indigo-600" />
                                </div>
                                <p className="text-3xl font-bold text-zinc-900">{stat.value}</p>
                                <p className="text-sm text-zinc-500 font-medium">{stat.label}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Feature Cards Grid */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center max-w-3xl mx-auto mb-16"
                    >
                        <h2 className="text-3xl md:text-5xl font-bold text-zinc-900 mb-4">
                            Tools Your Team Will <span className="text-indigo-600">Actually Use</span>
                        </h2>
                        <p className="text-xl text-zinc-600">
                            Built for the modern workplace. Designed to drive real engagement and measurable results.
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {features.map((feature, i) => {
                            const colors = colorMap[feature.color]
                            return (
                                <motion.div
                                    key={feature.title}
                                    custom={i}
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true }}
                                    variants={fadeUp}
                                    className="group"
                                >
                                    <div
                                        className={cn(
                                            "h-full p-8 rounded-3xl border border-zinc-100 bg-white shadow-sm",
                                            "hover:shadow-lg hover:border-zinc-200 transition-all duration-300",
                                            "hover:-translate-y-1"
                                        )}
                                    >
                                        <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-6", colors.bg)}>
                                            <feature.icon className={cn("w-7 h-7", colors.text)} />
                                        </div>
                                        <h3 className="text-xl font-bold text-zinc-900 mb-3">{feature.title}</h3>
                                        <p className="text-zinc-600 mb-6 text-sm leading-relaxed">{feature.description}</p>
                                        <ul className="space-y-2">
                                            {feature.details.map((detail) => (
                                                <li key={detail} className="flex items-center gap-2 text-sm text-zinc-600">
                                                    <CheckCircle2 className={cn("w-4 h-4 shrink-0", colors.text)} /> {detail}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </motion.div>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* Interactive Demo Section */}
            <section className="py-24 bg-zinc-50 border-t border-zinc-200">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <Badge variant="outline" className="mb-4 text-indigo-700 border-indigo-200 bg-indigo-50">
                                Interactive Learning
                            </Badge>
                            <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-4">
                                Ditch the hour-long videos.
                            </h2>
                            <p className="text-lg text-zinc-600 mb-6">
                                Break complex topics into 5-minute interactive lessons. Employees learn by doing, not just watching.
                            </p>
                            <ul className="space-y-3 mb-8">
                                {["Drag-and-drop exercises", "Immediate feedback loops", "Bite-sized modules", "Mobile-first design"].map(
                                    (item) => (
                                        <li key={item} className="flex items-center gap-3 text-zinc-700">
                                            <CheckCircle2 className="w-5 h-5 text-indigo-500" />
                                            {item}
                                        </li>
                                    )
                                )}
                            </ul>
                            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl h-12 px-6" asChild>
                                <Link to="/login">Try It Free</Link>
                            </Button>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="bg-white rounded-3xl p-8 border border-zinc-100 shadow-sm relative overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-transparent opacity-50"></div>
                            <div className="relative z-10">
                                <ProtocolMatchGame />
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Gamification Showcase */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl p-8 shadow-inner border border-zinc-100 relative overflow-hidden order-2 md:order-1"
                        >
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
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="order-1 md:order-2"
                        >
                            <Badge variant="outline" className="mb-4 text-purple-700 border-purple-200 bg-purple-50">
                                Gamification That Works
                            </Badge>
                            <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-4">
                                Turn learning into a habit.
                            </h2>
                            <p className="text-lg text-zinc-600 mb-6">
                                Streaks, badges, and rewards that turn mandatory training into something your team looks forward to every day.
                            </p>
                            <ul className="space-y-3 mb-8">
                                {["Daily streak tracking", "Achievement badges & unlockables", "Team vs team competitions", "Monthly rewards program"].map(
                                    (item) => (
                                        <li key={item} className="flex items-center gap-3 text-zinc-700">
                                            <CheckCircle2 className="w-5 h-5 text-purple-500" />
                                            {item}
                                        </li>
                                    )
                                )}
                            </ul>
                            <Button className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl h-12 px-6" asChild>
                                <Link to="/pricing">See Plans</Link>
                            </Button>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Flashcard Study Mode */}
            <section className="py-24 bg-zinc-50 border-t border-zinc-200">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <Badge variant="outline" className="mb-4 text-teal-700 border-teal-200 bg-teal-50">
                                Study Mode
                            </Badge>
                            <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-4">
                                Flashcards for quick review.
                            </h2>
                            <p className="text-lg text-zinc-600 mb-6">
                                Reinforce key concepts with interactive flashcards. Tap to flip, swipe to navigate — perfect for on-the-go learning.
                            </p>
                            <ul className="space-y-3 mb-8">
                                {["3D flip animations", "Categorized by topic", "Progress tracking", "Spaced repetition (coming soon)"].map(
                                    (item) => (
                                        <li key={item} className="flex items-center gap-3 text-zinc-700">
                                            <CheckCircle2 className="w-5 h-5 text-teal-500" />
                                            {item}
                                        </li>
                                    )
                                )}
                            </ul>
                            <Button className="bg-teal-600 hover:bg-teal-700 text-white rounded-xl h-12 px-6" asChild>
                                <Link to="/login">Try Flashcards</Link>
                            </Button>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="flex items-center justify-center"
                        >
                            <FlashcardDemo />
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Bottom CTA */}
            <section className="py-20 bg-zinc-900 text-white">
                <div className="container mx-auto px-4 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to see it in action?</h2>
                        <p className="text-lg text-zinc-400 mb-8 max-w-xl mx-auto">
                            Start your 14-day free trial and see why teams love training with Performova.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white h-14 px-8 text-lg rounded-xl" asChild>
                                <Link to="/login">Get Started Free</Link>
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                className="h-14 px-8 text-lg rounded-xl border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white"
                                asChild
                            >
                                <Link to="/pricing">View Pricing</Link>
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    )
}
