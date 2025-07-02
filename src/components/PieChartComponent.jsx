import React, { PureComponent } from "react";
import { ResponsiveContainer, PieChart, Pie, Legend, Cell ,Tooltip } from "recharts";

const data = [
  { name: "Group A", value: 100 },
  { name: "Group B", value: 300 },
];

const COLORS = ['#71cdea', '#bcbfc5']; // Add more if you have more data

const PieChartComponent = ({ data, dataKey, nameKey, colors }) => {
  console.log(".data",data);
  return (
    <PieChart width={319} height={270}>
      <Pie
        data={data}
        cx="50%"
        cy="50%"
        outerRadius={100}
        fill="#8884d8"
        dataKey={dataKey}
        nameKey={nameKey}
        label
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
        ))}
      </Pie>
      <Tooltip />
      <Legend />
    </PieChart>
  );
};
export default PieChartComponent;
