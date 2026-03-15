import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, Cell, PieChart, Pie, Legend
} from "recharts"
import { 
  TrendingUp, DollarSign, Zap, Target, ArrowUpRight, 
  ArrowDownRight, Info, Filter, Download 
} from "lucide-react"
import { api } from "@/lib/api"

export default function AdvancedAnalytics() {
  const [loading, setLoading] = useState(true)
  const [skillData, setSkillData] = useState([])
  const [roiData, setRoiData] = useState([])
  const [velocityData, setVelocityData] = useState([])
  const [summary, setSummary] = useState<any>({})

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [skills, roi, velocity, sum] = await Promise.all([
          api.get('/api/analytics/skills'),
          api.get('/api/analytics/roi'),
          api.get('/api/analytics/velocity'),
          api.get('/api/analytics/summary')
        ])
        setSkillData(skills.data)
        setRoiData(roi.data)
        setVelocityData(velocity.data)
        setSummary(sum.data)
      } catch (err) {
        console.error("Failed to fetch analytics:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-zinc-500 font-medium tracking-tight">Calculating KPIs...</p>
        </div>
      </div>
    )
  }

  const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#3b82f6', '#8b5cf6', '#ec4899'];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Advanced Analytics</h1>
          <p className="text-sm text-zinc-500">Deep insights into organizational learning efficiency and ROI.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" /> Filter
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" /> Export
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-zinc-500 uppercase tracking-wider">Total Investment</CardTitle>
            <div className="p-2 bg-indigo-50 rounded-lg">
              <DollarSign className="h-4 w-4 text-indigo-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-zinc-900">${summary.total_investment?.toLocaleString()}</div>
            <div className="flex items-center mt-1 text-emerald-600 text-xs font-medium">
              <ArrowUpRight className="h-3 w-3 mr-1" /> 12% vs last quarter
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-zinc-500 uppercase tracking-wider">Completion Rate</CardTitle>
            <div className="p-2 bg-emerald-50 rounded-lg">
              <TrendingUp className="h-4 w-4 text-emerald-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-zinc-900">{summary.completion_rate}%</div>
            <div className="flex items-center mt-1 text-emerald-600 text-xs font-medium">
              <ArrowUpRight className="h-3 w-3 mr-1" /> 5.2% improvement
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-zinc-500 uppercase tracking-wider">Skills Mastered</CardTitle>
            <div className="p-2 bg-amber-50 rounded-lg">
              <Target className="h-4 w-4 text-amber-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-zinc-900">{summary.skills_mastered}</div>
            <div className="flex items-center mt-1 text-zinc-500 text-xs">
              <Info className="h-3 w-3 mr-1" /> Proficient or higher
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-zinc-500 uppercase tracking-wider">Learning Velocity</CardTitle>
            <div className="p-2 bg-blue-50 rounded-lg">
              <Zap className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-zinc-900">3.2 Days</div>
            <div className="flex items-center mt-1 text-red-600 text-xs font-medium">
              <ArrowDownRight className="h-3 w-3 mr-1" /> 0.5d slower (Seasonal)
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Skill Proficiency Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Skill Proficiency Matrix</CardTitle>
            <CardDescription>Average proficiency levels across top competencies</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={skillData} layout="vertical" margin={{ left: 40, right: 40 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" domain={[0, 5]} hide />
                <YAxis 
                  dataKey="skill" 
                  type="category" 
                  axisLine={false} 
                  tickLine={false}
                  width={120}
                  fontSize={12}
                />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="proficiency" radius={[0, 4, 4, 0]} barSize={24}>
                  {skillData.map((entry: any, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* ROI: Cost per Learner */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Course ROI Analysis</CardTitle>
            <CardDescription>Investment vs. Cost per successful completion</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={roiData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="course" hide />
                <YAxis fontSize={12} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Legend verticalAlign="top" height={36}/>
                <Bar name="Total Investment" dataKey="investment" fill="#e2e8f0" radius={[4, 4, 0, 0]} />
                <Bar name="Cost Per Learner" dataKey="cost_per_learner" fill="#4f46e5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Learning Velocity */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Learning Velocity</CardTitle>
            <CardDescription>Average days to complete courses (Efficiency)</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={velocityData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="course" hide />
                <YAxis fontSize={12} axisLine={false} tickLine={false} label={{ value: 'Days', angle: -90, position: 'insideLeft' }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="avg_days_to_complete" 
                  stroke="#4f46e5" 
                  strokeWidth={3} 
                  dot={{ r: 6, fill: '#4f46e5' }} 
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Competency Distribution Pie */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Engagement by Category</CardTitle>
            <CardDescription>Which domains are your learners focusing on?</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={skillData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="users"
                  nameKey="skill"
                >
                  {skillData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend layout="vertical" align="right" verticalAlign="middle" iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
