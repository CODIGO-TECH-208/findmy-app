import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Item, CATEGORIES } from "@/data/mockData";
import { MapPin, Calendar, Eye } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface ItemCardProps {
  item: Item;
}

export function ItemCard({ item }: ItemCardProps) {
  const category = CATEGORIES.find((c) => c.value === item.category);

  return (
    <Link to={`/item/${item.id}`}>
      <Card className="overflow-hidden transition-all duration-200 hover:shadow-card hover:-translate-y-1 h-full">
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          <img
            src={item.images[0]}
            alt={item.title}
            className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
          />
          <div className="absolute top-2 left-2 flex gap-2">
            <Badge
              variant={item.type === "lost" ? "destructive" : "default"}
              className={item.type === "found" ? "bg-success hover:bg-success/90" : ""}
            >
              {item.type === "lost" ? "Lost" : "Found"}
            </Badge>
            {item.reward && (
              <Badge variant="secondary" className="bg-warning text-warning-foreground">
                Reward
              </Badge>
            )}
          </div>
          {item.status === "claimed" && (
            <div className="absolute inset-0 bg-foreground/60 flex items-center justify-center">
              <Badge variant="secondary" className="text-lg px-4 py-2">
                Claimed
              </Badge>
            </div>
          )}
        </div>
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-semibold text-foreground line-clamp-1">
              {item.title}
            </h3>
            <span className="text-lg shrink-0">{category?.icon}</span>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {item.description}
          </p>
          <div className="flex flex-col gap-1.5 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5" />
              <span className="truncate">{item.location}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                <span>{formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}</span>
              </div>
              <div className="flex items-center gap-1">
                <Eye className="h-3.5 w-3.5" />
                <span>{item.views}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
