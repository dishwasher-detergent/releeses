import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

interface RoadmapCardProps {
  index: number;
  xIncrement: number;
  title?: string;
  description?: string;
}

export default function RoadmapCard({
  index,
  xIncrement,
  title,
  description,
}: RoadmapCardProps) {
  return (
    <Card
      key={index}
      className="flex-none snap-start border border-dashed border-slate-300 shadow-none dark:border-slate-900"
      style={{ width: (xIncrement - 8) * 2 }}
    >
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-xs">{description}</p>
      </CardContent>
    </Card>
  );
}
