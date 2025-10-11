import { Star } from "lucide-react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface AttractionProps {
  attraction: {
    id: number
    name: string
    rating: number
    price: string
    image: string
    description: string
  }
}

export default function AttractionCard({ attraction }: AttractionProps) {
  return (
    <Card className="overflow-hidden bg-slate-700/30 border-slate-600/30 hover:bg-slate-700/50 transition-colors">
      <div className="h-48 overflow-hidden">
        <img
          src={attraction.image || "/placeholder.svg"}
          alt={attraction.name}
          className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
        />
      </div>
      <CardContent className="pt-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg text-white">{attraction.name}</h3>
          <Badge variant="outline" className="border-purple-400 text-purple-300">
            {attraction.price}
          </Badge>
        </div>
        <div className="flex items-center mb-2">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
          <span className="text-sm text-gray-300">{attraction.rating}</span>
        </div>
        <p className="text-sm text-gray-400">{attraction.description}</p>
      </CardContent>
      <CardFooter className="pt-0">
        <button className="text-sm text-purple-400 hover:text-purple-300 font-medium">View Details</button>
      </CardFooter>
    </Card>
  )
}
