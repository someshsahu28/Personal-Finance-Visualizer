"use client";
import React from "react";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

interface BudgetData {
  name: string;
  spent: number;
  color: string;
}



const BudgetChart: React.FC = () => {
  const chartData: BudgetData[] = [
    { name: "Marketing", spent: 4000, color: "#8884d8" },
    { name: "Design", spent: 2400, color: "#82ca9d" },
    { name: "Development", spent: 8000, color: "#ffc658" },
    { name: "Operations", spent: 2000, color: "#10b981" },
  ];

  return (
    <div>
      {/* @ts-ignore */}
      <ResponsiveContainer width="100%" height={350}>
        {/* @ts-ignore */}
        <BarChart data={chartData}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="spent" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BudgetChart;
