import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// const data = [
//   { month: "Jan", users: 2400 },
//   { month: "Feb", users: 1398 },
//   { month: "Mar", users: 9800 },
//   { month: "Apr", users: 3908 },
//   { month: "May", users: 4800 },
//   { month: "Jun", users: 3800 },
// ];

const AreaChartComponent = ({
  id,
  xAXisDatakey,
  areaDatakey,
  data,
  primaryColor,
  secondaryColor,
  strokeColor,
}) => {
  console.log("Graph data ===>", data);

  return (
    <ResponsiveContainer width="100%" height={400}>
      <AreaChart
        data={data}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
      >
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={primaryColor} stopOpacity={1} />
            <stop offset="100%" stopColor={secondaryColor} stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis
          dataKey={xAXisDatakey}
          tick={{ fill: 'white' }}
          tickLine={{ stroke: "white" }}
          axisLine={{ stroke: "white" }}
        />
        <YAxis
          tick={{ fill: "white" }}
          tickCount={8}
          tickLine={{ stroke: "white" }}
          axisLine={{ stroke: "white" }}
        />
        <CartesianGrid strokeDasharray="0" stroke="#7ac6f7" />
        <Tooltip />
        <Area
          type="monotone"
          dataKey={areaDatakey}
          stroke={strokeColor}
          fillOpacity={1}
          fill={`url(#${id})`}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default AreaChartComponent;

