"use client"

import { useState, useEffect, useRef } from "react"
import { Mic, MicOff, MapPin, Search, Loader2, MessageCircle, Settings, VolumeX } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import LanguageSelector from "@/components/language-selector"
import AttractionCard from "@/components/attraction-card"
import HotelCard from "@/components/hotel-card"
import RestaurantCard from "@/components/restaurant-card"
import MapView from "@/components/map-view"
import ConversationHistory from "@/components/conversation-history"

// Mock data for demonstration
const mockAttractions = [
  {
    id: 1,
    name: "Eiffel Tower",
    rating: 4.7,
    price: "€€",
    image: "/placeholder.svg?height=200&width=300",
    description: "Iconic iron tower with panoramic city views",
  },
  {
    id: 2,
    name: "Louvre Museum",
    rating: 4.8,
    price: "€€",
    image: "/placeholder.svg?height=200&width=300",
    description: "World's largest art museum & historic monument",
  },
  {
    id: 3,
    name: "Notre-Dame Cathedral",
    rating: 4.6,
    price: "€",
    image: "/placeholder.svg?height=200&width=300",
    description: "Medieval Catholic cathedral with Gothic architecture",
  },
]

const mockHotels = [
  {
    id: 1,
    name: "Grand Hotel Paris",
    rating: 4.5,
    price: "€€€",
    image: "/placeholder.svg?height=200&width=300",
    description: "Luxury hotel with Eiffel Tower views",
  },
  {
    id: 2,
    name: "Boutique Marais",
    rating: 4.3,
    price: "€€",
    image: "/placeholder.svg?height=200&width=300",
    description: "Charming boutique hotel in historic district",
  },
  {
    id: 3,
    name: "Budget Stay Central",
    rating: 4.0,
    price: "€",
    image: "/placeholder.svg?height=200&width=300",
    description: "Affordable accommodation near public transport",
  },
]

const mockRestaurants = [
  {
    id: 1,
    name: "Le Petit Bistro",
    rating: 4.6,
    price: "€€",
    image: "/placeholder.svg?height=200&width=300",
    description: "Classic French cuisine in cozy setting",
  },
  {
    id: 2,
    name: "Café de Paris",
    rating: 4.4,
    price: "€€€",
    image: "/placeholder.svg?height=200&width=300",
    description: "Upscale dining with gourmet French dishes",
  },
  {
    id: 3,
    name: "Boulangerie Express",
    rating: 4.2,
    price: "€",
    image: "/placeholder.svg?height=200&width=300",
    description: "Fresh pastries and quick French bites",
  },
]

type ConversationStep = "greeting" | "destination" | "budget" | "preferences" | "results"
type Message = {
  id: string
  type: "user" | "assistant"
  text: string
  timestamp: Date
}

export default function VoiceAssistant() {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [destination, setDestination] = useState("")
  const [budget, setBudget] = useState([50])
  const [isLoading, setIsLoading] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [language, setLanguage] = useState("en")
  const [isVoiceMode, setIsVoiceMode] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [conversationStep, setConversationStep] = useState<ConversationStep>("greeting")
  const [conversation, setConversation] = useState<Message[]>([])
  const [preferences, setPreferences] = useState<string[]>([])
  const speechSynthRef = useRef<SpeechSynthesis | null>(null)

  // Translations for demonstration
  const translations = {
    en: {
      speak: "Speak now",
      stopListening: "Stop listening",
      placeholder: "Where do you want to go?",
      search: "Search",
      budget: "Budget",
      attractions: "Attractions",
      hotels: "Hotels",
      restaurants: "Restaurants",
      map: "Map",
      listening: "Listening...",
      noResults: "No results found. Try another search.",
      voiceMode: "Voice Assistant Mode",
      manualMode: "Manual Input Mode",
      conversation: "Conversation",
      greeting: "Hello! I'm your travel assistant. Where would you like to go today?",
      askBudget: "What's your budget for this trip? You can say low, medium, or high budget.",
      askPreferences: "What are you most interested in? You can say attractions, hotels, restaurants, or all of them.",
      processingResults: "Let me find the best recommendations for you...",
      foundResults: "Great! I found some amazing recommendations for you in {destination}. You can see them below.",
      budgetConfirm: "Got it! I'll look for {budget} budget options.",
      destinationConfirm: "Perfect! {destination} is a wonderful destination.",
      preferencesConfirm: "Excellent! I'll focus on {preferences} for you.",
    },
    fr: {
      speak: "Parlez maintenant",
      stopListening: "Arrêter d'écouter",
      placeholder: "Où voulez-vous aller?",
      search: "Rechercher",
      budget: "Budget",
      attractions: "Attractions",
      hotels: "Hôtels",
      restaurants: "Restaurants",
      map: "Carte",
      listening: "Écoute...",
      noResults: "Aucun résultat trouvé. Essayez une autre recherche.",
      voiceMode: "Mode Assistant Vocal",
      manualMode: "Saisie Manuelle",
      conversation: "Conversation",
      greeting: "Bonjour! Je suis votre assistant de voyage. Où aimeriez-vous aller aujourd'hui?",
      askBudget: "Quel est votre budget pour ce voyage? Vous pouvez dire budget faible, moyen ou élevé.",
      askPreferences:
        "Qu'est-ce qui vous intéresse le plus? Vous pouvez dire attractions, hôtels, restaurants, ou tout.",
      processingResults: "Laissez-moi trouver les meilleures recommandations pour vous...",
      foundResults:
        "Parfait! J'ai trouvé d'excellentes recommandations pour vous à {destination}. Vous pouvez les voir ci-dessous.",
      budgetConfirm: "Compris! Je vais chercher des options de budget {budget}.",
      destinationConfirm: "Parfait! {destination} est une destination merveilleuse.",
      preferencesConfirm: "Excellent! Je vais me concentrer sur {preferences} pour vous.",
    },
    es: {
      speak: "Habla ahora",
      stopListening: "Dejar de escuchar",
      placeholder: "¿Dónde quieres ir?",
      search: "Buscar",
      budget: "Presupuesto",
      attractions: "Atracciones",
      hotels: "Hoteles",
      restaurants: "Restaurantes",
      map: "Mapa",
      listening: "Escuchando...",
      noResults: "No se encontraron resultados. Intenta otra búsqueda.",
      voiceMode: "Modo Asistente de Voz",
      manualMode: "Entrada Manual",
      conversation: "Conversación",
      greeting: "¡Hola! Soy tu asistente de viajes. ¿Dónde te gustaría ir hoy?",
      askBudget: "¿Cuál es tu presupuesto para este viaje? Puedes decir presupuesto bajo, medio o alto.",
      askPreferences: "¿Qué te interesa más? Puedes decir atracciones, hoteles, restaurantes, o todo.",
      processingResults: "Déjame encontrar las mejores recomendaciones para ti...",
      foundResults:
        "¡Genial! Encontré algunas recomendaciones increíbles para ti en {destination}. Puedes verlas abajo.",
      budgetConfirm: "¡Entendido! Buscaré opciones de presupuesto {budget}.",
      destinationConfirm: "¡Perfecto! {destination} es un destino maravilloso.",
      preferencesConfirm: "¡Excelente! Me enfocaré en {preferences} para ti.",
    },
  }

  const t = translations[language as keyof typeof translations]

  useEffect(() => {
    if (typeof window !== "undefined") {
      speechSynthRef.current = window.speechSynthesis
    }
  }, [])

  // Simulate speech recognition with conversation flow
  useEffect(() => {
    if (isListening && isVoiceMode) {
      const timer = setTimeout(() => {
        let simulatedResponse = ""

        switch (conversationStep) {
          case "greeting":
          case "destination":
            simulatedResponse = "Paris"
            break
          case "budget":
            simulatedResponse = "medium budget"
            break
          case "preferences":
            simulatedResponse = "attractions and restaurants"
            break
        }

        setTranscript(simulatedResponse)
        setIsListening(false)
        handleVoiceResponse(simulatedResponse)
      }, 3000)
      return () => clearTimeout(timer)
    } else if (isListening && !isVoiceMode) {
      const timer = setTimeout(() => {
        setTranscript("Paris")
        setIsListening(false)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [isListening, conversationStep, isVoiceMode])

  const speak = (text: string) => {
    if (speechSynthRef.current && isVoiceMode) {
      speechSynthRef.current.cancel()
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = language === "en" ? "en-US" : language === "fr" ? "fr-FR" : "es-ES"
      utterance.onstart = () => setIsSpeaking(true)
      utterance.onend = () => setIsSpeaking(false)
      speechSynthRef.current.speak(utterance)
    }
  }

  const addMessage = (type: "user" | "assistant", text: string) => {
    const message: Message = {
      id: Date.now().toString(),
      type,
      text,
      timestamp: new Date(),
    }
    setConversation((prev) => [...prev, message])
  }

  const handleVoiceResponse = (response: string) => {
    addMessage("user", response)

    switch (conversationStep) {
      case "greeting":
      case "destination":
        setDestination(response)
        addMessage("assistant", t.destinationConfirm.replace("{destination}", response))
        speak(t.destinationConfirm.replace("{destination}", response))
        setTimeout(() => {
          setConversationStep("budget")
          addMessage("assistant", t.askBudget)
          speak(t.askBudget)
        }, 2000)
        break

      case "budget":
        let budgetValue = 50
        if (
          response.toLowerCase().includes("low") ||
          response.toLowerCase().includes("faible") ||
          response.toLowerCase().includes("bajo")
        ) {
          budgetValue = 30
        } else if (
          response.toLowerCase().includes("high") ||
          response.toLowerCase().includes("élevé") ||
          response.toLowerCase().includes("alto")
        ) {
          budgetValue = 150
        }
        setBudget([budgetValue])
        addMessage("assistant", t.budgetConfirm.replace("{budget}", response))
        speak(t.budgetConfirm.replace("{budget}", response))
        setTimeout(() => {
          setConversationStep("preferences")
          addMessage("assistant", t.askPreferences)
          speak(t.askPreferences)
        }, 2000)
        break

      case "preferences":
        const prefs = []
        if (response.toLowerCase().includes("attraction")) prefs.push("attractions")
        if (response.toLowerCase().includes("hotel")) prefs.push("hotels")
        if (response.toLowerCase().includes("restaurant")) prefs.push("restaurants")
        if (prefs.length === 0) prefs.push("attractions", "hotels", "restaurants")

        setPreferences(prefs)
        addMessage("assistant", t.preferencesConfirm.replace("{preferences}", prefs.join(", ")))
        speak(t.preferencesConfirm.replace("{preferences}", prefs.join(", ")))

        setTimeout(() => {
          setConversationStep("results")
          setIsLoading(true)
          addMessage("assistant", t.processingResults)
          speak(t.processingResults)

          setTimeout(() => {
            setIsLoading(false)
            setShowResults(true)
            const resultsMessage = t.foundResults.replace("{destination}", destination)
            addMessage("assistant", resultsMessage)
            speak(resultsMessage)
          }, 2000)
        }, 2000)
        break
    }
  }

  const handleVoiceInput = () => {
    if (!isListening) {
      setTranscript("")
      setIsListening(true)
    } else {
      setIsListening(false)
    }
  }

  const handleSearch = () => {
    if (transcript) {
      setIsLoading(true)
      setDestination(transcript)

      setTimeout(() => {
        setIsLoading(false)
        setShowResults(true)
      }, 1500)
    }
  }

  const handleLanguageChange = (value: string) => {
    setLanguage(value)
  }

  const startVoiceMode = () => {
    setIsVoiceMode(true)
    setConversation([])
    setConversationStep("greeting")
    setShowResults(false)
    setTimeout(() => {
      addMessage("assistant", t.greeting)
      speak(t.greeting)
    }, 500)
  }

  const stopVoiceMode = () => {
    setIsVoiceMode(false)
    setIsSpeaking(false)
    if (speechSynthRef.current) {
      speechSynthRef.current.cancel()
    }
  }

  const toggleSpeech = () => {
    if (isSpeaking && speechSynthRef.current) {
      speechSynthRef.current.cancel()
      setIsSpeaking(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl shadow-2xl p-8 mb-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <Switch
                checked={isVoiceMode}
                onCheckedChange={(checked) => (checked ? startVoiceMode() : stopVoiceMode())}
                className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-purple-500 data-[state=checked]:to-blue-500"
              />
              <span className="text-sm font-medium text-gray-200">{isVoiceMode ? t.voiceMode : t.manualMode}</span>
            </div>
            {isVoiceMode && isSpeaking && (
              <Button
                variant="outline"
                size="sm"
                onClick={toggleSpeech}
                className="border-slate-600 text-gray-300 hover:bg-slate-700"
              >
                <VolumeX className="h-4 w-4 mr-1" />
                Stop Speaking
              </Button>
            )}
          </div>
          <LanguageSelector value={language} onChange={handleLanguageChange} />
        </div>

        {isVoiceMode ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-6 flex items-center text-gray-200">
                <MessageCircle className="h-6 w-6 mr-3 text-purple-400" />
                {t.conversation}
              </h3>
              <ConversationHistory messages={conversation} />

              <div className="mt-6 flex justify-center">
                <Button
                  onClick={handleVoiceInput}
                  variant={isListening ? "destructive" : "default"}
                  size="lg"
                  className={`rounded-full w-20 h-20 ${
                    isListening
                      ? "bg-red-500 hover:bg-red-600"
                      : "bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                  } shadow-lg`}
                  disabled={isSpeaking}
                >
                  {isListening ? (
                    <div className="flex flex-col items-center">
                      <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                  ) : (
                    <Mic className="h-8 w-8" />
                  )}
                </Button>
              </div>

              {isListening && <p className="text-center text-sm text-purple-300 mt-3">{t.listening}</p>}
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-6 flex items-center text-gray-200">
                <Settings className="h-6 w-6 mr-3 text-blue-400" />
                Current Settings
              </h3>
              <div className="space-y-6 bg-slate-700/30 rounded-xl p-6 border border-slate-600/30">
                {destination && (
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 text-purple-400 mr-3" />
                    <span className="font-medium text-gray-300">Destination:</span>
                    <span className="ml-3 text-white">{destination}</span>
                  </div>
                )}
                <div>
                  <span className="font-medium text-gray-300">
                    {t.budget}: €{budget[0]}
                  </span>
                  <Slider
                    value={budget}
                    onValueChange={setBudget}
                    max={200}
                    step={10}
                    className="w-full mt-3"
                    disabled={isVoiceMode}
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-2">
                    <span>€0</span>
                    <span>€200</span>
                  </div>
                </div>
                {preferences.length > 0 && (
                  <div>
                    <span className="font-medium text-gray-300">Preferences:</span>
                    <div className="flex gap-2 mt-3">
                      {preferences.map((pref) => (
                        <Badge key={pref} variant="outline" className="border-purple-400 text-purple-300">
                          {pref}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-grow">
              <input
                type="text"
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                placeholder={t.placeholder}
                className="w-full px-6 py-4 rounded-xl bg-slate-700/50 border border-slate-600/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent pr-12"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                {isListening ? (
                  <span className="text-purple-400 flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {t.listening}
                  </span>
                ) : null}
              </div>
            </div>

            <Button
              onClick={handleVoiceInput}
              variant={isListening ? "destructive" : "outline"}
              className={`min-w-[60px] h-14 ${
                isListening
                  ? "bg-red-500 hover:bg-red-600 border-red-500"
                  : "border-slate-600 text-gray-300 hover:bg-slate-700"
              }`}
            >
              {isListening ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
              <span className="sr-only">{isListening ? t.stopListening : t.speak}</span>
            </Button>

            <Button
              onClick={handleSearch}
              disabled={!transcript || isLoading}
              className="h-14 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="h-5 w-5 mr-2 animate-spin" /> : <Search className="h-5 w-5 mr-2" />}
              {t.search}
            </Button>
          </div>
        )}

        {!isVoiceMode && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-3">
              {t.budget}: €{budget[0]}
            </label>
            <Slider defaultValue={[50]} max={200} step={10} onValueChange={setBudget} className="w-full" />
            <div className="flex justify-between text-xs text-gray-400 mt-2">
              <span>€0</span>
              <span>€200</span>
            </div>
          </div>
        )}
      </div>

      {isLoading && (
        <div className="flex justify-center py-16">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-purple-400 mx-auto mb-4" />
            <p className="text-gray-300">Finding the best recommendations...</p>
          </div>
        </div>
      )}

      {showResults && !isLoading && (
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl shadow-2xl p-8">
          <div className="mb-6 flex items-center">
            <MapPin className="h-6 w-6 text-purple-400 mr-3" />
            <h2 className="text-2xl font-semibold text-white">{destination}</h2>
            <Badge variant="outline" className="ml-auto border-blue-400 text-blue-300">
              Budget: €{budget[0]}
            </Badge>
          </div>

          <Tabs defaultValue="attractions" className="w-full">
            <TabsList className="w-full mb-8 bg-slate-700/50 border border-slate-600/50">
              <TabsTrigger
                value="attractions"
                className="flex-1 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-blue-500 data-[state=active]:text-white"
              >
                {t.attractions}
              </TabsTrigger>
              <TabsTrigger
                value="hotels"
                className="flex-1 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-blue-500 data-[state=active]:text-white"
              >
                {t.hotels}
              </TabsTrigger>
              <TabsTrigger
                value="restaurants"
                className="flex-1 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-blue-500 data-[state=active]:text-white"
              >
                {t.restaurants}
              </TabsTrigger>
              <TabsTrigger
                value="map"
                className="flex-1 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-blue-500 data-[state=active]:text-white"
              >
                {t.map}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="attractions" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockAttractions.map((attraction) => (
                  <AttractionCard key={attraction.id} attraction={attraction} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="hotels" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockHotels.map((hotel) => (
                  <HotelCard key={hotel.id} hotel={hotel} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="restaurants" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockRestaurants.map((restaurant) => (
                  <RestaurantCard key={restaurant.id} restaurant={restaurant} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="map" className="mt-0">
              <MapView destination={destination} />
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  )
}
