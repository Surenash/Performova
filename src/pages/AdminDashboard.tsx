import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Users, Clock, Award, Plus, Search, Filter, MoreHorizontal, BookOpen, TrendingUp } from "lucide-react"
import { cn } from "@/lib/utils"

const TEAM_DATA = [
  { id: 1, name: "Alice Johnson", role: "Frontend Dev", progress: 85, status: "On Track", avatar: "https://i.pravatar.cc/150?u=1", coursesCompleted: 4 },
  { id: 2, name: "Bob Smith", role: "Backend Dev", progress: 40, status: "Overdue", avatar: "https://i.pravatar.cc/150?u=2", coursesCompleted: 2 },
  { id: 3, name: "Charlie Davis", role: "Designer", progress: 100, status: "Completed", avatar: "https://i.pravatar.cc/150?u=3", coursesCompleted: 6 },
  { id: 4, name: "Diana Prince", role: "Product Manager", progress: 60, status: "On Track", avatar: "https://i.pravatar.cc/150?u=4", coursesCompleted: 3 },
  { id: 5, name: "Evan Wright", role: "QA Engineer", progress: 15, status: "At Risk", avatar: "https://i.pravatar.cc/150?u=5", coursesCompleted: 1 },
]

export default function AdminDashboard() {
  const [isAssignOpen, setIsAssignOpen] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Team Overview</h1>
          <p className="text-sm text-zinc-500">Monitor learning progress and assign new courses.</p>
        </div>
        <Dialog open={isAssignOpen} onOpenChange={setIsAssignOpen}>
          <DialogTrigger asChild>
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
              <Plus className="w-4 h-4 mr-2" /> Assign Course
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Assign Learning Path</DialogTitle>
            </DialogHeader>
            <div className="py-4 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-900">Select Course</label>
                <div className="p-3 border border-zinc-200 rounded-lg bg-zinc-50 flex items-center justify-between cursor-pointer hover:border-indigo-500">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-indigo-100 flex items-center justify-center">
                      <BookOpen className="w-4 h-4 text-indigo-600" />
                    </div>
                    <span className="text-sm font-medium">Cybersecurity Basics 2024</span>
                  </div>
                  <Badge variant="secondary">Required</Badge>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-900">Assign to Team Members</label>
                <div className="border border-zinc-200 rounded-lg p-4 bg-zinc-50/50 border-dashed text-center">
                  <p className="text-sm text-zinc-500 mb-2">Drag and drop team members here, or click to select.</p>
                  <Button variant="outline" size="sm">Select Members</Button>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsAssignOpen(false)}>Cancel</Button>
              <Button className="bg-indigo-600 text-white hover:bg-indigo-700">Assign Now</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-zinc-500">Active Learners</CardTitle>
            <Users className="h-4 w-4 text-indigo-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-zinc-900">124</div>
            <p className="text-xs text-emerald-600 flex items-center mt-1">
              <span className="font-medium">+12%</span> from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-zinc-500">Avg. Completion Time</CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-zinc-900">4.2 hrs</div>
            <p className="text-xs text-emerald-600 flex items-center mt-1">
              <span className="font-medium">-15%</span> faster than avg
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-zinc-500">Certificates Earned</CardTitle>
            <Award className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-zinc-900">892</div>
            <p className="text-xs text-zinc-500 mt-1">
              Across 15 active courses
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-zinc-500">Completion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-zinc-900">86%</div>
            <p className="text-xs text-zinc-500 mt-1">
              Team average
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Data Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between border-b border-zinc-100 pb-4">
          <CardTitle className="text-lg font-semibold">Team Progress</CardTitle>
          <div className="flex items-center gap-2">
            <div className="relative hidden sm:block">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-500" />
              <input
                type="search"
                placeholder="Search team..."
                className="h-9 w-64 rounded-md border border-zinc-200 bg-white pl-9 pr-4 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <Button variant="outline" size="icon" className="h-9 w-9">
              <Filter className="h-4 w-4 text-zinc-500" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-zinc-500 uppercase bg-zinc-50/50 border-b border-zinc-100">
                <tr>
                  <th className="px-6 py-3 font-medium">Employee</th>
                  <th className="px-6 py-3 font-medium">Role</th>
                  <th className="px-6 py-3 font-medium w-1/3">Progress</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {TEAM_DATA.map((user) => (
                  <tr key={user.id} className="bg-white hover:bg-zinc-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.avatar} />
                          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium text-zinc-900">{user.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-zinc-500">
                      {user.role}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <Progress value={user.progress} className="h-2 flex-1" />
                        <span className="text-xs font-mono text-zinc-500 w-8 text-right">{user.progress}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge
                        variant="secondary"
                        className={cn(
                          "bg-opacity-20 border-none",
                          user.status === 'Completed' ? 'bg-emerald-500 text-emerald-700' :
                            user.status === 'On Track' ? 'bg-indigo-500 text-indigo-700' :
                              user.status === 'Overdue' ? 'bg-red-500 text-red-700' :
                                'bg-amber-500 text-amber-700'
                        )}
                      >
                        {user.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-zinc-900">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats: Top Performers & Recent Activity (From Emergent) */}
      <div className="grid md:grid-cols-2 gap-6 mt-8">

        {/* Top Performers */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Top Performers This Week</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...TEAM_DATA]
                .sort((a, b) => b.progress - a.progress)
                .slice(0, 3)
                .map((member, index) => (
                  <div key={member.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-zinc-50 transition-colors">
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm",
                      index === 0 ? "bg-amber-100 text-amber-700" :
                        index === 1 ? "bg-zinc-200 text-zinc-700" :
                          "bg-orange-100 text-orange-700"
                    )}>
                      {index + 1}
                    </div>
                    <Avatar className="w-10 h-10 border border-zinc-200">
                      <AvatarImage src={member.avatar} />
                      <AvatarFallback>{member.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-semibold text-zinc-900 text-sm">{member.name}</p>
                      <p className="text-xs text-zinc-500">{member.coursesCompleted} courses completed</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-indigo-600">{member.progress}%</p>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6 mt-2">
              {[
                { action: 'Charlie Davis completed', course: 'Cybersecurity Awareness', time: '2 hours ago', color: 'emerald' },
                { action: 'Alice Johnson started', course: 'Project Management 101', time: '4 hours ago', color: 'indigo' },
                { action: 'Diana Prince earned badge', course: 'Week Warrior', time: '6 hours ago', color: 'amber' },
              ].map((activity, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className={cn(
                    "w-2.5 h-2.5 rounded-full mt-1.5 ring-4",
                    activity.color === 'emerald' ? 'bg-emerald-500 ring-emerald-100' :
                      activity.color === 'indigo' ? 'bg-indigo-500 ring-indigo-100' :
                        'bg-amber-500 ring-amber-100'
                  )} />
                  <div className="flex-1">
                    <p className="text-sm text-zinc-900">
                      <span className="font-semibold">{activity.action}</span> <span className="text-zinc-600">{activity.course}</span>
                    </p>
                    <p className="text-xs text-zinc-400 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  )
}


