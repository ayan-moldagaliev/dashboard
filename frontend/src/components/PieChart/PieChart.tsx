import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface PieChartProps {
    data: { name: string; value: number }[];
    colors?: string[];
}

const PieChartComponent: React.FC<PieChartProps> = ({ data, colors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'] }) => (
    <div style={{ width: "100%", height: 300, marginBottom: 30 }}>
        <ResponsiveContainer>
            <PieChart>
                <Pie data={data} dataKey="value" nameKey="name" label>
                    {data.map((_, index) => <Cell key={index} fill={colors[index % colors.length]} />)}
                </Pie>
                <Tooltip />
                <Legend />
            </PieChart>
        </ResponsiveContainer>
    </div>
);

export default PieChartComponent;
