import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

interface IChartProps {
  data: { label: string; amount: number }[];
}

export function BarChartComponent({ data }: IChartProps) {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis
          dataKey="label"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(amount) => `${amount}`}
        />
        <Bar dataKey="amount" className="fill-primary" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
