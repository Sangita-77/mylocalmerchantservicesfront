import React, { PureComponent } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// const data = [
//   {
//     month: "Jan",
//     merchants: 2908,
//   },
//   {
//     month: "Feb",
//     merchants: 1908,
//   },
//   {
//     month: "Mar",
//     merchants: 908,
//   },
//   {
//     month: "Apr",
//     merchants: 3908,
//   },
//   {
//     month: "May",
//     merchants: 4800,
//   },
//   {
//     month: "Jun",
//     merchants: 3800,
//   },
//   {
//     month: "Jul",
//     merchants: 4300,
//   },
//    {
//     month: "Aug",
//     merchants: 3300,
//   },
//    {
//     month: "Sept",
//     merchants: 5315,
//   },
//    {
//     month: "Oct",
//     merchants: 5250,
//   },
//    {
//     month: "Nov",
//     merchants: 4150,
//   },
//    {
//     month: "Dec",
//     merchants: 4000,
//   },
// ];

const BarChartComponent = ({ data }) => {

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        barSize={12}
      >
        <XAxis
          dataKey="month"
          scale="point"
          padding={{ left: 10, right: 10 }}
          tick={{ fill: 'white', fontSize: 14 }}
          axisLine={{ stroke: "white" }}
          tickLine={{ stroke: "white" }}
        />
        <YAxis
          tick={{ fill: 'white', fontSize: 14 }}
          axisLine={{ stroke: "white" }}
          tickLine={{ stroke: "white" }}
        />
        <Tooltip contentStyle={{ backgroundColor: 'white', border: 'none' }}
        itemStyle={{ color: 'black' }}
        labelStyle={{ color: 'black' }} />
        <CartesianGrid strokeDasharray="0" horizontal vertical={false} stroke="#ffffffff" />
        <Bar dataKey="merchants" fill="white" radius={[12, 12, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};


export default BarChartComponent;
