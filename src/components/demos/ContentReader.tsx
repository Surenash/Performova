import { useState, useRef, useEffect } from "react"
import { BookOpen, ChevronLeft, ChevronRight, Minus, Plus, Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import { api } from "@/lib/api"

interface ContentPage {
    title: string
    content: string
}



export default function ContentReader() {
    const [pages, setPages] = useState<ContentPage[]>([])
    const [currentPage, setCurrentPage] = useState(0)
    const [fontSize, setFontSize] = useState(15)
    const [readProgress, setReadProgress] = useState(0)
    const [loading, setLoading] = useState(true)
    const contentRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        api.get('/api/demos/content_reader')
            .then(res => {
                setPages(res.data)
                setLoading(false)
            })
            .catch(err => {
                console.error("Failed to load content reader data:", err)
                setLoading(false)
            })
    }, [])

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

    if (loading || pages.length === 0) {
        return <div className="p-8 text-center text-zinc-500 bg-white rounded-2xl border border-zinc-200">Loading reader...</div>
    }

    const page = pages[currentPage]
    const readTime = Math.ceil(page.content.split(" ").length / 200) // ~200 wpm

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
