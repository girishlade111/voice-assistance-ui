"use client"

import { useEffect, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { User, Bot } from "lucide-react"

type Message = {
  id: string
  type: "user" | "assistant"
  text: string
  timestamp: Date
}

interface ConversationHistoryProps {
  messages: Message[]
}

export default function ConversationHistory({ messages }: ConversationHistoryProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  return (
    <Card className="h-80 overflow-hidden bg-slate-700/30 border-slate-600/30">
      <CardContent className="p-4 h-full overflow-y-auto">
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="text-center text-gray-400 py-8">
              <Bot className="h-12 w-12 mx-auto mb-4 text-purple-400" />
              <p>Start a conversation by speaking...</p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.type === "user" ? "justify-end" : "justify-start"}`}
              >
                <div className={`flex gap-2 max-w-[80%] ${message.type === "user" ? "flex-row-reverse" : "flex-row"}`}>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.type === "user"
                        ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white"
                        : "bg-slate-600 text-gray-300"
                    }`}
                  >
                    {message.type === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                  </div>
                  <div
                    className={`px-4 py-2 rounded-lg ${
                      message.type === "user"
                        ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white"
                        : "bg-slate-600 text-gray-200"
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </CardContent>
    </Card>
  )
}
