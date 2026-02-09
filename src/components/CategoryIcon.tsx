import { 
  Smartphone, 
  CreditCard, 
  Briefcase, 
  BookOpen, 
  Laptop, 
  Shirt, 
  Watch, 
  Key, 
  FileText, 
  Package,
  LucideIcon
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  smartphone: Smartphone,
  "credit-card": CreditCard,
  briefcase: Briefcase,
  "book-open": BookOpen,
  laptop: Laptop,
  shirt: Shirt,
  watch: Watch,
  key: Key,
  "file-text": FileText,
  package: Package,
};

interface CategoryIconProps {
  icon: string;
  className?: string;
}

export function CategoryIcon({ icon, className = "h-4 w-4" }: CategoryIconProps) {
  const IconComponent = iconMap[icon] || Package;
  return <IconComponent className={className} />;
}

export { iconMap };
