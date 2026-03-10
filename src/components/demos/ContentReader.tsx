import { useState, useRef, useEffect } from "react"
import { BookOpen, ChevronLeft, ChevronRight, Minus, Plus, Clock } from "lucide-react"
import { cn } from "@/lib/utils"

interface ContentPage {
    title: string
    content: string
}

const pages: ContentPage[] = [
    {
        title: "What is Social Engineering?",
        content: `Social engineering is a manipulation technique that exploits human psychology rather than technical vulnerabilities. Attackers use deception to trick individuals into revealing confidential information, granting unauthorized access, or performing actions that compromise security.

Unlike traditional hacking, social engineering targets the weakest link in any security system — the human element. Even the most sophisticated technical defenses can be bypassed by a well-crafted social engineering attack.

**Key Principle:** Attackers exploit trust, fear, urgency, and authority to manipulate their targets. Understanding these psychological triggers is the first step in defending against them.`,
    },
    {
        title: "Common Attack Vectors",
        content: `**Phishing** — The most prevalent form of social engineering. Attackers send fraudulent emails that appear to come from legitimate sources. These emails often contain malicious links or attachments designed to steal credentials or install malware.

**Pretexting** — The attacker creates a fabricated scenario (pretext) to engage the victim. For example, posing as an IT technician who needs the employee's password to "fix an issue."

**Baiting** — Similar to phishing, but involves offering something enticing. This could be a USB drive labeled "Salary Information" left in a parking lot, or a free download that contains malware.

**Tailgating** — An unauthorized person follows an authorized person into a restricted area. This exploits politeness and the tendency to hold doors open for others.`,
    },
    {
        title: "How to Protect Yourself",
        content: `**Verify Before Trusting** — Always verify the identity of someone requesting sensitive information, even if they claim to be from IT, management, or a known vendor. Use a separate communication channel to confirm.

**Think Before You Click** — Hover over links before clicking to check the actual URL. Be suspicious of unexpected emails, especially those creating urgency or offering something too good to be true.

**Report Suspicious Activity** — If something feels off, report it to your security team immediately. It's better to report a false positive than to ignore a real threat. Most organizations have a dedicated channel for reporting potential security incidents.

**Stay Updated** — Social engineering tactics evolve constantly. Regular training and awareness programs help you recognize new attack patterns and stay vigilant. Remember: security is everyone's responsibility.`,
    },
]

export default function ContentReader() {
    const [currentPage, setCurrentPage] = useState(0)
    const [fontSize, setFontSize] = useState(15)
    const [readProgress, setReadProgress] = useState(0)
    const contentRef = useRef<HTMLDivElement>(null)

    const page = pages[currentPage]
    const readTime = Math.ceil(page.content.split(" ").length / 200) // ~200 wpm

    const handleScroll = () => {
        if (!contentRef.current) return
        const { scrollTop, scrollHeight, clientHeight } = contentRef.current
        const pct = scrollHeight <= clientHeight ? 100 : (scrollTop / (scrollHeight - clientHeight)) * 100
        setReadProgress(pct)
    }

    useEffect(() => {
        setReadProgress(0)
        if (contentRef.current) contentRef.current.scrollTop = 0
    }, [currentPage])

    const renderContent = (text: string) => {
        // Simple markdown-like rendering for bold text
        return text.split("\n\n").map((paragraph, i) => (
            <p key={i} className="mb-4 last:mb-0 leading-relaxed">
                {paragraph.split(/(\*\*.*?\*\*)/).map((part, j) =>
                    part.startsWith("**") && part.endsWith("**") ? (
                        <strong key={j} className="text-zinc-900 font-semibold">
                            {part.slice(2, -2)}
                        </strong>
                    ) : (
                        <span key={j}>{part}</span>
                    )
                )}
            </p>
        ))
    }

    return (
        <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-zinc-100">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-indigo-100 rounded-lg flex items-center justify-center">
                        <BookOpen className="w-4 h-4 text-indigo-600" />
                    </div>
                    <div>
                        <h4 className="font-bold text-zinc-900 text-sm">{page.title}</h4>
                        <div className="flex items-center gap-2 text-xs text-zinc-400">
                            <Clock className="w-3 h-3" />
                            <span>{readTime} min read</span>
                            <span>·</span>
                            <span>Page {currentPage + 1} of {pages.length}</span>
                        </div>
                    </div>
                </div>

                {/* Font Size Controls */}
                <div className="flex items-center gap-1">
                    <button
                        onClick={() => setFontSize((s) => Math.max(12, s - 1))}
                        className="w-7 h-7 rounded border border-zinc-200 flex items-center justify-center text-zinc-400 hover:text-zinc-600 hover:bg-zinc-50 transition-colors"
                    >
                        <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-xs text-zinc-400 font-mono w-8 text-center">{fontSize}</span>
                    <button
                        onClick={() => setFontSize((s) => Math.min(22, s + 1))}
                        className="w-7 h-7 rounded border border-zinc-200 flex items-center justify-center text-zinc-400 hover:text-zinc-600 hover:bg-zinc-50 transition-colors"
                    >
                        <Plus className="w-3 h-3" />
                    </button>
                </div>
            </div>

            {/* Reading Progress Bar */}
            <div className="h-0.5 bg-zinc-100">
                <div
                    className="h-full bg-indigo-500 transition-all duration-150 ease-out"
                    style={{ width: `${readProgress}%` }}
                />
            </div>

            {/* Content */}
            <div
                ref={contentRef}
                className="p-6 overflow-y-auto flex-1"
                style={{ maxHeight: 320, fontSize: `${fontSize}px` }}
                onScroll={handleScroll}
            >
                <div className="text-zinc-600 max-w-prose">
                    {renderContent(page.content)}
                </div>
            </div>

            {/* Footer Navigation */}
            <div className="flex items-center justify-between p-4 border-t border-zinc-100 bg-zinc-50/50">
                <button
                    onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                    disabled={currentPage === 0}
                    className={cn(
                        "flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-lg transition-colors",
                        currentPage === 0
                            ? "text-zinc-300 cursor-not-allowed"
                            : "text-zinc-600 hover:bg-zinc-100"
                    )}
                >
                    <ChevronLeft className="w-4 h-4" /> Previous
                </button>

                {/* Page dots */}
                <div className="flex gap-1.5">
                    {pages.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrentPage(i)}
                            className={cn(
                                "w-2 h-2 rounded-full transition-all",
                                i === currentPage ? "bg-indigo-500 w-5" : "bg-zinc-200 hover:bg-zinc-300"
                            )}
                        />
                    ))}
                </div>

                <button
                    onClick={() => setCurrentPage((p) => Math.min(pages.length - 1, p + 1))}
                    disabled={currentPage === pages.length - 1}
                    className={cn(
                        "flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-lg transition-colors",
                        currentPage === pages.length - 1
                            ? "text-zinc-300 cursor-not-allowed"
                            : "text-zinc-600 hover:bg-zinc-100"
                    )}
                >
                    Next <ChevronRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    )
}
