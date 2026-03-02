import { Outlet, Link, useLocation } from "react-router-dom"
import { cn } from "@/lib/utils"
import { LayoutDashboard, BookOpen, Users, Settings, Bell, Search } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function DashboardLayout({ role }: { role: "admin" | "learner" }) {
  const location = useLocation()

  const adminNav = [
    { name: "Overview", href: "/admin", icon: LayoutDashboard },
    { name: "Team Progress", href: "/admin/team", icon: Users },
    { name: "Content Library", href: "/admin/content", icon: BookOpen },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ]

  const learnerNav = [
    { name: "My Learning", href: "/learner", icon: LayoutDashboard },
    { name: "Catalog", href: "/learner/catalog", icon: BookOpen },
    { name: "Settings", href: "/learner/settings", icon: Settings },
  ]

  const nav = role === "admin" ? adminNav : learnerNav

  return (
    <div className="flex min-h-screen bg-zinc-50">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-50 w-64 border-r border-zinc-200 bg-white hidden md:flex flex-col">
        <div className="flex h-16 items-center px-6 border-b border-zinc-200">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center">
              <span className="text-white font-bold text-xl">P</span>
            </div>
            <span className="text-xl font-bold tracking-tight text-zinc-900">Performova</span>
          </Link>
        </div>
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="grid gap-1 px-4">
            {nav.map((item) => {
              const isActive = location.pathname === item.href
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-indigo-50 text-indigo-700"
                      : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </div>
        <div className="p-4 border-t border-zinc-200">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src="https://i.pravatar.cc/150?u=admin" />
              <AvatarFallback>AD</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-zinc-900">
                {role === "admin" ? "Sarah Manager" : "Alex Learner"}
              </span>
              <span className="text-xs text-zinc-500 capitalize">{role}</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:pl-64 flex flex-col min-h-screen">
        <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b border-zinc-200 bg-white px-6">
          <div className="flex-1 flex items-center gap-4">
            <div className="relative w-full max-w-md hidden md:flex">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-500" />
              <input
                type="search"
                placeholder="Search..."
                className="h-9 w-full rounded-md border border-zinc-200 bg-zinc-50 pl-9 pr-4 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative text-zinc-500 hover:text-zinc-900">
              <Bell className="h-5 w-5" />
              <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
            </button>
          </div>
        </header>
        <div className="flex-1 p-6">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
