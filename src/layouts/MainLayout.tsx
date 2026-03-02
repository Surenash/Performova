import { Outlet, Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Moon, Sun } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"

export default function MainLayout() {
  const [isDark, setIsDark] = useState(false)

  // NOTE: True dark mode logic isn't fully implemented yet,
  // but we add the toggle UI per user request.
  const toggleTheme = () => {
    setIsDark(!isDark)
    // Future: add logic to put 'dark' class on document element
  }

  return (
    <div className={cn("min-h-screen flex flex-col transition-colors duration-300", isDark ? "dark bg-zinc-950 text-zinc-50" : "bg-white text-zinc-900")}>

      {/* Floating Dynamic Island Header */}
      <header className="fixed top-6 left-1/2 -translate-x-1/2 z-50">
        <div className={cn(
          "flex items-center justify-between gap-6 px-4 py-2 rounded-full border shadow-sm backdrop-blur-md transition-colors",
          isDark
            ? "bg-zinc-900/70 border-zinc-800"
            : "bg-white/70 border-zinc-200/50"
        )}>
          {/* Logo & Name */}
          <Link to="/" className="flex items-center gap-2 pl-2">
            <div className="h-7 w-7 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-inner">
              <span className="text-white font-bold text-sm">P</span>
            </div>
            <span className={cn("text-base font-bold tracking-tight", isDark ? "text-white" : "text-zinc-900")}>
              Performova
            </span>
          </Link>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            <Link to="#features" className={cn("px-3 py-1.5 text-sm font-medium rounded-full transition-colors", isDark ? "text-zinc-300 hover:text-white hover:bg-zinc-800" : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100")}>Features</Link>
            <Link to="#pricing" className={cn("px-3 py-1.5 text-sm font-medium rounded-full transition-colors", isDark ? "text-zinc-300 hover:text-white hover:bg-zinc-800" : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100")}>Pricing</Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className={cn("p-2 rounded-full transition-colors", isDark ? "text-zinc-400 hover:text-white hover:bg-zinc-800" : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100")}
              aria-label="Toggle dark mode"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <Link to="/login">
              <Button variant="ghost" className={cn("h-8 px-4 rounded-full text-sm font-medium hidden md:inline-flex", isDark ? "hover:bg-zinc-800 hover:text-white" : "hover:bg-zinc-100")}>
                Log in
              </Button>
            </Link>
            <Link to="/login">
              <Button className="h-8 px-4 rounded-full text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/20">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className={cn("border-t py-12 transition-colors", isDark ? "border-zinc-800 bg-zinc-950 text-zinc-500" : "border-zinc-200 bg-zinc-50 text-zinc-500")}>
        <div className="container mx-auto px-4 text-center">
          <p>&copy; {new Date().getFullYear()} Performova. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
