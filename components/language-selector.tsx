"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Globe } from "lucide-react"

interface LanguageSelectorProps {
  value: string
  onChange: (value: string) => void
}

export default function LanguageSelector({ value, onChange }: LanguageSelectorProps) {
  return (
    <div className="flex items-center">
      <Globe className="h-4 w-4 mr-2 text-purple-400" />
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-[120px] bg-slate-700/50 border-slate-600/50 text-gray-200">
          <SelectValue placeholder="Language" />
        </SelectTrigger>
        <SelectContent className="bg-slate-800 border-slate-700">
          <SelectItem value="en" className="text-gray-200 focus:bg-slate-700">
            English
          </SelectItem>
          <SelectItem value="fr" className="text-gray-200 focus:bg-slate-700">
            Français
          </SelectItem>
          <SelectItem value="es" className="text-gray-200 focus:bg-slate-700">
            Español
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
