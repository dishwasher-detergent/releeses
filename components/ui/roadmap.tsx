"use client";

import RoadmapCard from "@/components/ui/roadmap-card";
import { Tables } from "@/types/supabase";
import React, { useEffect, useState } from "react";

interface Point {
  x: number;
  y: number;
}

const generateNewPoints = (
  data: Tables<"roadmap">[],
  svgWidth: number,
  nextX: number,
  xIncrement: number,
  highY: number,
  lowY: number,
) => {
  const newPoints: Point[] = [];
  let currentX = nextX;
  let previousX = currentX;
  const padding = 50;

  data.forEach((item) => {
    const nextY: any = newPoints.length % 2 === 0 ? lowY : highY;
    newPoints.push({ x: currentX, y: nextY });
    previousX = currentX;
    currentX += xIncrement;

    if (previousX + padding > svgWidth) {
      svgWidth = previousX + padding;
    }
  });

  return { newPoints, currentX, svgWidth };
};

const generatePath = (points: Point[]): string => {
  if (points.length < 2) return "";

  return points
    .map((point, index, arr) => {
      if (index === 0) {
        return `M ${point.x} ${point.y}`;
      } else {
        const prev = arr[index - 1];
        const controlPoint1 = {
          x: prev.x + (point.x - prev.x) * 0.5,
          y: prev.y,
        };
        const controlPoint2 = {
          x: prev.x + (point.x - prev.x) * 0.5,
          y: point.y,
        };
        return `C ${controlPoint1.x} ${controlPoint1.y}, ${controlPoint2.x} ${controlPoint2.y}, ${point.x} ${point.y}`;
      }
    })
    .join(" ");
};

export default function Roadmap({ data }: { data: Tables<"roadmap">[] }) {
  const [points, setPoints] = useState<Point[]>([]);
  const [nextX, setNextX] = useState<number>(50);
  const [svgWidth, setSvgWidth] = useState<number>(400);
  const xIncrement = 200;
  const highY = 36;
  const lowY = 114;

  useEffect(() => {
    const {
      newPoints,
      currentX,
      svgWidth: width,
    } = generateNewPoints(data, svgWidth, nextX, xIncrement, highY, lowY);
    setPoints(newPoints);
    setNextX(currentX);
    setSvgWidth(width);
  }, []);

  return (
    <div className="relative w-full snap-x scroll-px-4 overflow-x-auto pb-2">
      <div className="flex w-auto flex-row gap-4">
        {data
          .sort(
            (a, b) =>
              new Date(a.created_at).getTime() -
              new Date(b.created_at).getTime(),
          )
          .map((point, index) => {
            return (
              <React.Fragment key={index}>
                {index == 1 && (
                  <div
                    key={`${index}-spacer`}
                    className="flex-none rounded-xl bg-muted"
                    style={{ width: xIncrement - 8 }}
                  />
                )}
                {index % 2 !== 0 && (
                  <RoadmapCard
                    key={`${index}-card`}
                    variant={point.accomplished ? "accomplished" : "default"}
                    xIncrement={xIncrement}
                    title={point.title}
                    description={point.description}
                    createdAt={point.created_at}
                  />
                )}
              </React.Fragment>
            );
          })}
      </div>
      <svg id="svg" width={svgWidth} height="150" className="my-4">
        <path
          d={generatePath(points)}
          className="stroke-slate-300 dark:stroke-slate-700"
          stroke="currentColor"
          fill="none"
          strokeWidth={6}
          strokeDasharray="6 16"
          strokeLinecap="round"
        />
        {points.map((point, index) => (
          <React.Fragment key={index}>
            <svg
              key={`${index}-flag`}
              className="text-slate-800 dark:text-slate-50"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              x={point.x - 4}
              y={point.y - 28}
            >
              <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
              <line x1="4" x2="4" y1="22" y2="15" />
            </svg>
            <circle
              className="text-slate-800 dark:text-slate-50"
              key={`${index}-circle`}
              cx={point.x}
              cy={point.y}
              r={6}
              fill="currentColor"
              stroke="none"
            />
          </React.Fragment>
        ))}
      </svg>
      <div className="flex w-auto flex-row gap-4">
        {data
          .sort(
            (a, b) =>
              new Date(a.created_at).getTime() -
              new Date(b.created_at).getTime(),
          )
          .map((point, index) => {
            return (
              <React.Fragment key={index}>
                {index % 2 == 0 || index == 0 ? (
                  <RoadmapCard
                    key={`${index}-card-1`}
                    variant={point.accomplished ? "accomplished" : "default"}
                    xIncrement={xIncrement}
                    title={point.title}
                    description={point.description}
                    createdAt={point.created_at}
                  />
                ) : null}
                {index == points.length - 1 && (
                  <div
                    key={`${index}-spacer-1`}
                    className="flex-none rounded-xl bg-muted"
                    style={{ width: xIncrement - 8 }}
                  />
                )}
              </React.Fragment>
            );
          })}
      </div>
    </div>
  );
}
