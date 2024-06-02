import { cn, toDateString } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

const roadmapCardVariants = cva(
  "flex-none snap-start border border-dashed border-slate-300 shadow-none dark:border-slate-900",
  {
    variants: {
      variant: {
        default: "",
        accomplished:
          "bg-emerald-100 border-emerald-300 dark:bg-emerald-900 dark:border-emerald-700",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface RoadmapCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof roadmapCardVariants> {
  xIncrement: number;
  title: string;
  description: string;
  createdAt: string;
}

export default function RoadmapCard({
  xIncrement,
  title,
  description,
  variant,
  createdAt,
  ...props
}: RoadmapCardProps) {
  return (
    <Card
      {...props}
      className={cn(roadmapCardVariants({ variant }))}
      style={{ width: (xIncrement - 8) * 2 }}
    >
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <p className="text-xs">{toDateString(createdAt)}</p>
      </CardHeader>
      <CardContent>
        <p className="text-xs">{description}</p>
      </CardContent>
    </Card>
  );
}
