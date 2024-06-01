import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

interface RoadmapCardProps {
  index: number;
  xIncrement: number;
}

export default function RoadmapCard({ index, xIncrement }: RoadmapCardProps) {
  return (
    <Card
      key={index}
      className="flex-none snap-start border border-dashed border-slate-300 shadow-none dark:border-slate-900"
      style={{ width: (xIncrement - 8) * 2 }}
    >
      <CardHeader>
        <CardTitle>Test</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-xs">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Ratione,
          mollitia laborum dolorem labore eius similique eos voluptate, error
          delectus officia ipsum aliquam ex consequuntur quod quam deleniti
          reiciendis, magnam unde.
        </p>
      </CardContent>
    </Card>
  );
}
