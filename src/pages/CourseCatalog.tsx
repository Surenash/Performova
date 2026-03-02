import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Search, Filter, Clock, PlayCircle, BookOpen, MousePointer2 } from "lucide-react"

const CATEGORIES = ["All", "Compliance", "Security", "Leadership", "Technical", "Onboarding"]

const COURSES = [
  { id: 1, title: "Data Privacy 101", category: "Compliance", time: "15 min", format: "interactive", difficulty: "Beginner", image: "https://picsum.photos/seed/privacy/400/200", color: "bg-blue-100" },
  { id: 2, title: "Effective Feedback", category: "Leadership", time: "30 min", format: "video", difficulty: "Intermediate", image: "https://picsum.photos/seed/feedback/400/200", color: "bg-purple-100" },
  { id: 3, title: "Phishing Defense", category: "Security", time: "10 min", format: "interactive", difficulty: "Beginner", image: "https://picsum.photos/seed/phishing/400/200", color: "bg-red-100" },
  { id: 4, title: "React Advanced", category: "Technical", time: "2 hrs", format: "text", difficulty: "Advanced", image: "https://picsum.photos/seed/react/400/200", color: "bg-cyan-100" },
  { id: 5, title: "Company Culture", category: "Onboarding", time: "20 min", format: "video", difficulty: "Beginner", image: "https://picsum.photos/seed/culture/400/200", color: "bg-orange-100" },
  { id: 6, title: "Secure Coding", category: "Security", time: "45 min", format: "interactive", difficulty: "Intermediate", image: "https://picsum.photos/seed/secure/400/200", color: "bg-emerald-100" },
]

export default function CourseCatalog() {
  const navigate = useNavigate()
  const [activeCategory, setActiveCategory] = useState("All")

  const filteredCourses = activeCategory === "All" 
    ? COURSES 
    : COURSES.filter(c => c.category === activeCategory)

  return (
    <div className="flex flex-col md:flex-row gap-8">
      {/* Sidebar Filters */}
      <aside className="w-full md:w-64 shrink-0 space-y-8">
        <div>
          <h3 className="font-bold text-zinc-900 mb-4 flex items-center gap-2">
            <Filter className="w-4 h-4" /> Filters
          </h3>
          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-medium text-zinc-900 mb-3">Format</h4>
              <div className="space-y-2">
                {['Interactive', 'Video', 'Text'].map(format => (
                  <label key={format} className="flex items-center gap-2 text-sm text-zinc-600 cursor-pointer">
                    <input type="checkbox" className="rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500" />
                    {format}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-zinc-900 mb-3">Duration</h4>
              <div className="space-y-2">
                {['< 15 mins', '15-30 mins', '30-60 mins', '> 1 hour'].map(duration => (
                  <label key={duration} className="flex items-center gap-2 text-sm text-zinc-600 cursor-pointer">
                    <input type="checkbox" className="rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500" />
                    {duration}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-zinc-900 mb-3">Difficulty</h4>
              <div className="space-y-2">
                {['Beginner', 'Intermediate', 'Advanced'].map(diff => (
                  <label key={diff} className="flex items-center gap-2 text-sm text-zinc-600 cursor-pointer">
                    <input type="checkbox" className="rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500" />
                    {diff}
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <input
              type="search"
              placeholder="Search courses..."
              className="h-10 w-full rounded-lg border border-zinc-200 bg-white pl-10 pr-4 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="flex overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 gap-2 hide-scrollbar">
          {CATEGORIES.map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeCategory === category 
                  ? "bg-zinc-900 text-white" 
                  : "bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Course Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map(course => (
            <Card key={course.id} className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer group flex flex-col" onClick={() => navigate(`/lesson/${course.id}`)}>
              <div className={`h-32 w-full relative ${course.color}`}>
                <img src={course.image} alt={course.title} className="w-full h-full object-cover mix-blend-multiply opacity-80 group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
                <div className="absolute top-3 left-3">
                  <Badge variant="secondary" className="bg-white/90 backdrop-blur text-zinc-900 border-none">
                    {course.category}
                  </Badge>
                </div>
              </div>
              <CardContent className="p-5 flex-1 flex flex-col">
                <div className="flex items-center gap-2 text-xs text-zinc-500 mb-2">
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {course.time}</span>
                  <span>&bull;</span>
                  <span className="flex items-center gap-1">
                    {course.format === 'interactive' && <MousePointer2 className="w-3 h-3" />}
                    {course.format === 'video' && <PlayCircle className="w-3 h-3" />}
                    {course.format === 'text' && <BookOpen className="w-3 h-3" />}
                    <span className="capitalize">{course.format}</span>
                  </span>
                </div>
                <h3 className="font-bold text-zinc-900 mb-1 group-hover:text-indigo-600 transition-colors">{course.title}</h3>
                <div className="mt-auto pt-4 flex items-center justify-between">
                  <span className={`text-xs font-medium px-2 py-1 rounded-md ${
                    course.difficulty === 'Beginner' ? 'bg-emerald-100 text-emerald-700' :
                    course.difficulty === 'Intermediate' ? 'bg-amber-100 text-amber-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {course.difficulty}
                  </span>
                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0 rounded-full bg-zinc-100 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    <PlayCircle className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
