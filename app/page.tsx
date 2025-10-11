import VoiceAssistant from "@/components/voice-assistant"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
            AI Travel Assistant
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Transform your travel planning with AI-powered voice assistance that discovers attractions, hotels, and
            restaurants within your budget
          </p>
        </div>
        <VoiceAssistant />
      </div>
    </main>
  )
}
