import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const BarChartComponent = ({ data }) => {
  const maxValue = data.length ? Math.max(...data.map(d => d.merchants)) : 0;

  const divisions = 10;
  let step = Math.ceil(maxValue / divisions);

  const minStep = 10;
  if (step === 0) step = minStep;

  const yTicks = [];
  for (let i = 0; i <= maxValue + step; i += step) {
    yTicks.push(i);
  }

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart
        data={data}
        margin={{ top: 5, right: 0, left: 0, bottom: 10 }}
        barSize={12}
      >
        <XAxis
          dataKey="label"
          scale="point"
          padding={{ left: 30, right: 30 }}
          tick={{ fill: 'white', fontSize: 12, fontFamily: '"Sora", sans-serif' }}
          axisLine={{ stroke: "white" }}
          tickLine={{ stroke: "" }}
        />
        <YAxis
          ticks={yTicks}
          tick={{ fill: 'white', fontSize: 12, fontFamily: '"Sora", sans-serif' }}
          axisLine={{ stroke: "white" }}
          tickLine={{ stroke: "" }}
        />
        <Tooltip />
        <CartesianGrid strokeDasharray="0" horizontal vertical={false} stroke="#8dd7ee" />
        <Bar dataKey="merchants" fill="white" radius={[12, 12, 12, 12]} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default BarChartComponent;
