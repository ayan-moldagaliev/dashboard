import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface BarChartProps {
    data: { hour: number; leads: number }[];
}

const BarChartComponent: React.FC<BarChartProps> = ({ data }) => (
    <div style={{ width: "100%", height: 300, marginTop: 10 }}>
        <ResponsiveContainer>
            <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="leads" fill="#22c55e" />
            </BarChart>
        </ResponsiveContainer>
    </div>
);

export default BarChartComponent;
