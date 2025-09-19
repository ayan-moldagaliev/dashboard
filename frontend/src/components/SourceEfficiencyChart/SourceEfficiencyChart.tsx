import React from "react";
import {
    BarChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList
} from "recharts";

interface SourceEfficiencyChartProps {
    rows: {
        source: string;
        lead_quality: string;
    }[];
}

const SourceEfficiencyChart: React.FC<SourceEfficiencyChartProps> = ({ rows }) => {
    const sourceStats: Record<string, { total: number; highQuality: number }> = {};
    rows.forEach(lead => {
        if (!lead.source) return;
        if (!sourceStats[lead.source]) sourceStats[lead.source] = { total: 0, highQuality: 0 };
        sourceStats[lead.source].total += 1;
        if (lead.lead_quality === "Высокий") sourceStats[lead.source].highQuality += 1;
    });

    const chartData = Object.entries(sourceStats).map(([source, stats]) => ({
        source,
        total: stats.total,
        efficiency: stats.total ? Math.round((stats.highQuality / stats.total) * 100) : 0
    }));

    return (
        <div style={{ width: "100%", height: 350, marginTop: 20 }}>
            <ResponsiveContainer>
                <BarChart data={chartData} margin={{ top: 20, right: 40, left: 20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="source" />
                    <YAxis yAxisId="left" orientation="left" stroke="#8884d8" label={{ value: 'Лиды', angle: -90, position: 'insideLeft' }} />
                    <YAxis yAxisId="right" orientation="right" stroke="#FF8042" label={{ value: 'Эффективность (%)', angle: 90, position: 'insideRight' }} />
                    <Tooltip formatter={(value: any, name: string) => name === 'efficiency' ? `${value}%` : value} />
                    <Bar yAxisId="left" dataKey="total" fill="#8884d8">
                        <LabelList dataKey="total" position="top" />
                    </Bar>
                    <Line yAxisId="right" type="monotone" dataKey="efficiency" stroke="#FF8042" strokeWidth={2} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default SourceEfficiencyChart;
