import {
  Car,
  Home,
  Smartphone,
  Sofa,
  Shirt,
  Dumbbell,
  Briefcase,
  Wrench,
  PawPrint,
  Baby,
  Guitar,
  Tractor,
  Package,
  type LucideIcon,
} from "lucide-react";

export const CATEGORY_ICONS: Record<string, LucideIcon> = {
  car: Car,
  home: Home,
  smartphone: Smartphone,
  sofa: Sofa,
  shirt: Shirt,
  dumbbell: Dumbbell,
  briefcase: Briefcase,
  wrench: Wrench,
  "paw-print": PawPrint,
  baby: Baby,
  guitar: Guitar,
  tractor: Tractor,
};

export function CategoryIcon({ icon, className }: { icon: string; className?: string }) {
  const Icon = CATEGORY_ICONS[icon] ?? Package;
  return <Icon className={className} aria-hidden />;
}
