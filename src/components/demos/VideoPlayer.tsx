import { useState, useRef, useEffect } from "react"
import { Play, Pause, Volume2, VolumeX, Maximize, SkipBack, SkipForward } from "lucide-react"
import { cn } from "@/lib/utils"

interface VideoPlayerProps {
    title?: string
    description?: string
    videoUrl?: string
    posterUrl?: string
}

export default function VideoPlayer({
    title = "Social Engineering: Real-World Examples",
    description = "Learn how attackers use social engineering techniques in real-world scenarios.",
    videoUrl = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    posterUrl,
}: VideoPlayerProps) {
    const videoRef = useRef<HTMLVideoElement>(null)
    const progressRef = useRef<HTMLDivElement>(null)
    const [isPlaying, setIsPlaying] = useState(false)
    const [isMuted, setIsMuted] = useState(false)
    const [progress, setProgress] = useState(0)
    const [currentTime, setCurrentTime] = useState("0:00")
    const [duration, setDuration] = useState("0:00")
    const [showControls, setShowControls] = useState(true)
    const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60)
        const s = Math.floor(seconds % 60)
        return `${m}:${s.toString().padStart(2, "0")}`
    }

    const togglePlay = () => {
        if (!videoRef.current) return
        if (isPlaying) {
            videoRef.current.pause()
        } else {
            videoRef.current.play()
        }
        setIsPlaying(!isPlaying)
    }

    const toggleMute = () => {
        if (!videoRef.current) return
        videoRef.current.muted = !isMuted
        setIsMuted(!isMuted)
    }

    const handleTimeUpdate = () => {
        if (!videoRef.current) return
        const pct = (videoRef.current.currentTime / videoRef.current.duration) * 100
        setProgress(pct)
        setCurrentTime(formatTime(videoRef.current.currentTime))
    }

    const handleLoadedMetadata = () => {
        if (!videoRef.current) return
        setDuration(formatTime(videoRef.current.duration))
    }

    const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!videoRef.current || !progressRef.current) return
        const rect = progressRef.current.getBoundingClientRect()
        const pct = (e.clientX - rect.left) / rect.width
        videoRef.current.currentTime = pct * videoRef.current.duration
    }

    const skip = (seconds: number) => {
        if (!videoRef.current) return
        videoRef.current.currentTime += seconds
    }

    const handleFullscreen = () => {
        if (!videoRef.current) return
        if (videoRef.current.requestFullscreen) {
            videoRef.current.requestFullscreen()
        }
    }

    const handleMouseMove = () => {
        setShowControls(true)
        if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current)
        hideTimeoutRef.current = setTimeout(() => {
            if (isPlaying) setShowControls(false)
        }, 3000)
    }

    useEffect(() => {
        return () => {
            if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current)
        }
    }, [])

    return (
        <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
            {/* Video Container */}
            <div
                className="relative bg-zinc-900 aspect-video cursor-pointer group"
                onClick={togglePlay}
                onMouseMove={handleMouseMove}
                onMouseLeave={() => isPlaying && setShowControls(false)}
            >
                <video
                    ref={videoRef}
                    src={videoUrl}
                    poster={posterUrl}
                    className="w-full h-full object-cover"
                    onTimeUpdate={handleTimeUpdate}
                    onLoadedMetadata={handleLoadedMetadata}
                    onEnded={() => setIsPlaying(false)}
                    preload="metadata"
                />

                {/* Play Overlay (when paused) */}
                {!isPlaying && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                        <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-transform">
                            <Play className="w-7 h-7 text-zinc-900 ml-1" />
                        </div>
                    </div>
                )}

                {/* Bottom Controls */}
                <div
                    className={cn(
                        "absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 pt-10 transition-opacity duration-300",
                        showControls || !isPlaying ? "opacity-100" : "opacity-0"
                    )}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Progress Bar */}
                    <div
                        ref={progressRef}
                        className="h-1.5 bg-white/30 rounded-full mb-3 cursor-pointer group/progress hover:h-2.5 transition-all"
                        onClick={handleProgressClick}
                    >
                        <div
                            className="h-full bg-indigo-500 rounded-full relative transition-all"
                            style={{ width: `${progress}%` }}
                        >
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow opacity-0 group-hover/progress:opacity-100 transition-opacity" />
                        </div>
                    </div>

                    {/* Controls Row */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={togglePlay}
                                className="text-white hover:text-indigo-300 transition-colors"
                            >
                                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                            </button>
                            <button
                                onClick={() => skip(-10)}
                                className="text-white/70 hover:text-white transition-colors"
                            >
                                <SkipBack className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => skip(10)}
                                className="text-white/70 hover:text-white transition-colors"
                            >
                                <SkipForward className="w-4 h-4" />
                            </button>
                            <button
                                onClick={toggleMute}
                                className="text-white/70 hover:text-white transition-colors"
                            >
                                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                            </button>
                            <span className="text-xs text-white/70 font-mono">
                                {currentTime} / {duration}
                            </span>
                        </div>
                        <button
                            onClick={handleFullscreen}
                            className="text-white/70 hover:text-white transition-colors"
                        >
                            <Maximize className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Video Info */}
            <div className="p-5">
                <h4 className="font-bold text-zinc-900 mb-1">{title}</h4>
                <p className="text-sm text-zinc-500">{description}</p>
            </div>
        </div>
    )
}
