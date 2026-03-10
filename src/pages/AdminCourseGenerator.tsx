import { useState, useRef } from "react"
import { UploadCloud, File, Video, FileText, CheckCircle2, Loader2, Sparkles, X, Settings2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

export default function AdminCourseGenerator() {
  const [files, setFiles] = useState<File[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [progress, setProgress] = useState(0)
  const [statusText, setStatusText] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [generatedCourse, setGeneratedCourse] = useState<any>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFiles(prev => [...prev, ...Array.from(e.dataTransfer.files)])
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFiles(prev => [...prev, ...Array.from(e.target.files!)])
    }
  }

  const removeFile = (indexToRemove: number) => {
    setFiles(files.filter((_, index) => index !== indexToRemove))
  }

  const getFileIcon = (type: string) => {
    if (type.includes('pdf')) return <FileText className="w-8 h-8 text-red-500" />
    if (type.includes('video') || type.includes('mp4')) return <Video className="w-8 h-8 text-blue-500" />
    return <File className="w-8 h-8 text-zinc-500" />
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const handleGenerate = async () => {
    if (files.length === 0) return

    setIsGenerating(true)
    setProgress(10)
    setStatusText("Uploading files...")

    const formData = new FormData()
    files.forEach(file => formData.append("files", file))

    try {
      // Step 1: Upload and Parse
      const uploadRes = await fetch('/api/admin/generate-course', {
        method: 'POST',
        body: formData,
      })

      if (!uploadRes.ok) {
        throw new Error("Failed to upload and generate course")
      }

      setProgress(40)
      setStatusText("Analyzing content and generating curriculum...")

      const data = await uploadRes.json()

      setProgress(100)
      setStatusText("Course generated successfully!")

      // Pass the generated course data up to the parent or a global state to transition to the Review UI
      setTimeout(() => {
        setIsGenerating(false)
        setGeneratedCourse(data)
      }, 1000)

    } catch (error) {
      console.error(error)
      setStatusText("An error occurred during generation.")
      setIsGenerating(false)
    }
  }

  const handlePublish = async () => {
    try {
      const res = await fetch("/api/admin/save-course", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(generatedCourse),
      })
      if (!res.ok) throw new Error("Failed to save course")

      alert("Course published successfully!")
      setGeneratedCourse(null)
      setFiles([])
    } catch (e) {
      console.error(e)
      alert("Failed to publish course")
    }
  }

  if (generatedCourse) {
    return (
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900 flex items-center gap-3">
              <Sparkles className="w-8 h-8 text-indigo-500" />
              Review Generated Course
            </h1>
            <p className="text-zinc-500 mt-2">
              Review and edit the AI-generated curriculum before publishing to learners.
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setGeneratedCourse(null)}>Cancel</Button>
            <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={handlePublish}>
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Publish Course
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Course Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Course Title</label>
              <input
                type="text"
                className="w-full h-10 px-3 rounded-md border border-zinc-200"
                value={generatedCourse.title}
                onChange={(e) => setGeneratedCourse({ ...generatedCourse, title: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <textarea
                className="w-full p-3 rounded-md border border-zinc-200 h-24"
                value={generatedCourse.description}
                onChange={(e) => setGeneratedCourse({ ...generatedCourse, description: e.target.value })}
              />
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <h2 className="text-xl font-bold text-zinc-900">Curriculum</h2>
          {generatedCourse.modules?.map((mod: any, mIndex: number) => (
            <Card key={mIndex} className="border border-zinc-200">
              <CardHeader className="bg-zinc-50 border-b border-zinc-200 py-4">
                <CardTitle className="text-lg flex items-center justify-between">
                  <span>Module {mIndex + 1}: {mod.title}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-zinc-100">
                  {mod.lessons?.map((lesson: any, lIndex: number) => (
                    <div key={lIndex} className="p-4 hover:bg-zinc-50 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <span className="font-medium text-zinc-900">{lesson.title}</span>
                          <span className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-full uppercase">
                            {lesson.type}
                          </span>
                        </div>
                      </div>

                      {lesson.type === 'lesson' && (
                        <textarea
                          className="w-full text-sm text-zinc-600 bg-white p-3 rounded border border-zinc-100 mt-2 h-20 outline-none focus:ring-1 focus:ring-indigo-500"
                          value={lesson.content}
                          onChange={(e) => {
                            const newCourse = { ...generatedCourse }
                            newCourse.modules[mIndex].lessons[lIndex].content = e.target.value
                            setGeneratedCourse(newCourse)
                          }}
                        />
                      )}

                      {lesson.type === 'quiz' && (
                        <div className="space-y-3 mt-3">
                          {lesson.questions?.map((q: any, qIndex: number) => (
                            <div key={qIndex} className="bg-white p-3 rounded border border-zinc-200">
                              <div className="flex justify-between items-start mb-2">
                                <span className="text-sm font-medium text-zinc-800">{q.question}</span>
                                <span className="text-xs text-zinc-400 bg-zinc-100 px-2 py-0.5 rounded">{q.type}</span>
                              </div>
                              {q.type === 'multiple_choice' && (
                                <ul className="text-xs text-zinc-600 space-y-1 ml-2 list-disc list-inside">
                                  {q.options?.map((opt: string, oIdx: number) => (
                                    <li key={oIdx} className={opt === q.correct_answer ? "text-emerald-600 font-semibold" : ""}>{opt}</li>
                                  ))}
                                </ul>
                              )}
                              {q.type === 'true_false' && (
                                <p className="text-xs text-emerald-600 font-semibold mt-1">Answer: {q.correct_answer ? 'True' : 'False'}</p>
                              )}
                              {q.type === 'fill_in_the_blank' && (
                                <p className="text-xs text-emerald-600 font-semibold mt-1">Answer: {q.correct_answer}</p>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 flex items-center gap-3">
          <Sparkles className="w-8 h-8 text-indigo-500" />
          AI Course Generator
        </h1>
        <p className="text-zinc-500 mt-2">
          Upload your PDFs, documents, or videos. Our AI will analyze the content and automatically generate a complete interactive course with lessons, quizzes, and hints.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">

        {/* Main Upload Area */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Source Materials</CardTitle>
            <CardDescription>Drag and drop files here, or click to browse</CardDescription>
          </CardHeader>
          <CardContent>
            <div
              className={cn(
                "border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center text-center transition-colors cursor-pointer",
                isDragging ? "border-indigo-500 bg-indigo-50/50" : "border-zinc-200 hover:border-indigo-400 hover:bg-zinc-50"
              )}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                type="file"
                multiple
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".pdf,.txt,.docx,.mp4,.mov"
              />
              <div className="w-16 h-16 bg-white border border-zinc-100 rounded-full flex items-center justify-center shadow-sm mb-4">
                <UploadCloud className="w-8 h-8 text-indigo-500" />
              </div>
              <h3 className="font-semibold text-lg text-zinc-900 mb-1">Upload Data</h3>
              <p className="text-sm text-zinc-500 max-w-xs mb-4">
                Supports PDFs, Text files, and Videos (we'll extract audio/subtitles automatically).
              </p>
              <Button variant="secondary" onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click() }}>
                Browse Files
              </Button>
            </div>

            {/* File List */}
            {files.length > 0 && (
              <div className="mt-6 space-y-3">
                <h4 className="text-sm font-medium text-zinc-900">Uploaded Files ({files.length})</h4>
                <div className="space-y-2 max-h-[240px] overflow-y-auto pr-2">
                  {files.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-white border border-zinc-200 rounded-lg shadow-sm">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="w-10 h-10 rounded bg-zinc-50 flex items-center justify-center shrink-0">
                          {getFileIcon(file.type || file.name)}
                        </div>
                        <div className="overflow-hidden">
                          <p className="text-sm font-medium text-zinc-900 truncate">{file.name}</p>
                          <p className="text-xs text-zinc-500">{formatFileSize(file.size)}</p>
                        </div>
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); removeFile(index) }}
                        className="p-2 text-zinc-400 hover:text-red-500 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Configuration Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings2 className="w-5 h-5 text-zinc-500" />
                Generation Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Target Audience</label>
                <select className="w-full h-10 px-3 rounded-md border border-zinc-200 bg-white text-sm">
                  <option>All Employees</option>
                  <option>Engineering Team</option>
                  <option>Management</option>
                  <option>Sales Team</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Tone</label>
                <select className="w-full h-10 px-3 rounded-md border border-zinc-200 bg-white text-sm">
                  <option>Professional & Direct</option>
                  <option>Engaging & Fun</option>
                  <option>Academic</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Include Interactive Quizzes</label>
                <div className="flex items-center gap-2 mt-1">
                  <input type="checkbox" id="quizzes" defaultChecked className="rounded border-zinc-300 text-indigo-600 focus:ring-indigo-600" />
                  <label htmlFor="quizzes" className="text-sm text-zinc-600">Yes, generate MCQs, Drag & Drop, etc.</label>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full bg-indigo-600 hover:bg-indigo-700"
                size="lg"
                disabled={files.length === 0 || isGenerating}
                onClick={handleGenerate}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Generate Course
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>

          {/* Progress State */}
          {isGenerating && (
            <Card className="bg-indigo-50 border-indigo-100">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-indigo-900">{statusText}</span>
                    <span className="text-indigo-600 font-bold">{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2 bg-indigo-100" />
                  <ul className="text-xs text-indigo-700 space-y-2 mt-4">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className={cn("w-3 h-3", progress >= 10 ? "text-indigo-600" : "text-indigo-200")} />
                      Extracting text and subtitles
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className={cn("w-3 h-3", progress >= 40 ? "text-indigo-600" : "text-indigo-200")} />
                      AI structuring curriculum
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className={cn("w-3 h-3", progress >= 80 ? "text-indigo-600" : "text-indigo-200")} />
                      Generating interactive questions
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          )}

        </div>
      </div>
    </div>
  )
}
