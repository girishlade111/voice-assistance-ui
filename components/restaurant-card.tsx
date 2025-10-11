import { Star, Clock, Utensils } from "lucide-react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface RestaurantProps {
  restaurant: {
    id: number
    name: string
    rating: number
    price: string
    image: string
    description: string
  }
}

export default function RestaurantCard({ restaurant }: RestaurantProps) {
  return (
    <Card className="overflow-hidden bg-slate-700/30 border-slate-600/30 hover:bg-slate-700/50 transition-colors">
      <div className="h-48 overflow-hidden">
        <img
          src={restaurant.image || "/placeholder.svg"}
          alt={restaurant.name}
          className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
        />
      </div>
      <CardContent className="pt-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg text-white">{restaurant.name}</h3>
          <Badge variant="outline" className="border-purple-400 text-purple-300">
            {restaurant.price}
          </Badge>
        </div>
        <div className="flex items-center mb-2">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
          <span className="text-sm text-gray-300">{restaurant.rating}</span>
        </div>
        <p className="text-sm text-gray-400 mb-2">{restaurant.description}</p>
        <div className="flex gap-2">
          <Badge variant="secondary" className="flex gap-1 items-center bg-slate-600 text-gray-300">
            <Clock className="h-3 w-3" />
            <span className="text-xs">Open Now</span>
          </Badge>
          <Badge variant="secondary" className="flex gap-1 items-center bg-slate-600 text-gray-300">
            <Utensils className="h-3 w-3" />
            <span className="text-xs">Reservations</span>
          </Badge>
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <button className="text-sm text-blue-400 hover:text-blue-300 font-medium">Reserve Table</button>
      </CardFooter>
    </Card>
  )
}
