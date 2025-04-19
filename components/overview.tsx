"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"
import { ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const data = [
  {
    subject: "Math",
    average: 8.4,
  },
  {
    subject: "Science",
    average: 7.9,
  },
  {
    subject: "History",
    average: 8.7,
  },
  {
    subject: "Language",
    average: 8.2,
  },
  {
    subject: "Art",
    average: 9.1,
  },
  {
    subject: "PE",
    average: 8.8,
  },
]

export function Overview() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis dataKey="subject" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          domain={[0, 10]}
          tickFormatter={(value) => `${value}`}
        />
        <Tooltip
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              return (
                <ChartTooltip>
                  <ChartTooltipContent
                    content={
                      <div className="flex flex-col gap-2">
                        <p className="text-sm font-medium">{payload[0].payload.subject}</p>
                        <p className="text-sm">Average: {payload[0].value}</p>
                      </div>
                    }
                  />
                </ChartTooltip>
              )
            }
            return null
          }}
        />
        <Bar dataKey="average" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
