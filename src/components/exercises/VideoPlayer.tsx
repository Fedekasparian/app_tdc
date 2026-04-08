'use client'

function getYouTubeId(url: string): string | null {
  const match = url.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/)
  return match ? match[1] : null
}

type Props = {
  videoType: string | null
  videoUrl: string
}

export default function VideoPlayer({ videoType, videoUrl }: Props) {
  if (videoType === 'youtube') {
    const videoId = getYouTubeId(videoUrl)
    if (!videoId) return null
    return (
      <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black">
        <iframe
          src={`https://www.youtube.com/embed/${videoId}`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
        />
      </div>
    )
  }

  if (videoType === 'upload') {
    return (
      <div className="rounded-2xl overflow-hidden bg-black">
        <video src={videoUrl} controls className="w-full" />
      </div>
    )
  }

  return null
}
