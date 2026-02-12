import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface PromoFlyerCardProps {
  image: string;
  title: string;
  description: string;
  className?: string;
}

export function PromoFlyerCard({ image, title, description, className }: PromoFlyerCardProps) {
  return (
    <Card className={cn("overflow-hidden group h-full border-0 shadow-lg", className)}>
      <div className="relative aspect-[3/4] overflow-hidden">
        <img
          src={image}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
          <h3 className="text-xl font-display font-bold mb-1.5 drop-shadow-md">
            {title}
          </h3>
          <p className="text-sm text-white/85 leading-relaxed drop-shadow-sm">
            {description}
          </p>
        </div>
      </div>
    </Card>
  );
}
