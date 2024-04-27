import { LucideIcon } from "lucide-react";

export interface Nav {
  name: string;
  href: string;
  icon: LucideIcon;
  isActive?: boolean;
  badge?: string;
  disabled?: boolean;
}
