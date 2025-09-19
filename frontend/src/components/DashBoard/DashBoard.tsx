import React, { useEffect, useState } from "react";
import { Typography, Button, Paper, Box, Divider } from "@mui/material";
import Filters from "../Filters";
import AnalyticsCards from "../AnalyticsCard";
import LineChartComponent from "../LineChart";
import PieChartComponent from "../PieChart";
import BarChartComponent from "../BarChart";
import DataTable from "../DataTable";
import TopCars from "../TopCars";
import SourceEfficiencyChart from "../SourceEfficiencyChart";
import { exportToCSV } from "../../helpers/exportCsv.ts";
import { exportToPDF } from "../../helpers/exportPdf.ts";
import TelegramButton from "../TelegramButton";

const GOOGLE_SHEET_URL =
    "https://script.google.com/macros/s/AKfycbyfH4qSVXMCKZcAAOojItj9li3RB_7T-bgBQ9FxDAdZjRc_yUXfF6Zo2Ic2SSTRA5cQ/exec";

const Dashboard: React.FC = () => {
    const [rows, setRows] = useState<any[]>([]);
    const [lastUpdate, setLastUpdate] = useState<string>("");
    const [filterQuality, setFilterQuality] = useState<string>("");
    const [filterSource, setFilterSource] = useState<string>("");
    const [search, setSearch] = useState<string>("");

    useEffect(() => {
        const fetchData = () => {
            fetch(GOOGLE_SHEET_URL)
                .then((res) => res.json())
                .then((data) => {
                    const rowsWithId = data.map((row: any, index: number) => ({
                        id: String(index),
                        ...row,
                    }));
                    setRows(rowsWithId);
                    setLastUpdate(new Date().toLocaleTimeString());
                })
                .catch(console.error);
        };
        fetchData();
        const interval = setInterval(fetchData, 30000);
        return () => clearInterval(interval);
    }, []);

    const filteredRows = rows.filter(
        (row) =>
            (filterQuality ? row.lead_quality === filterQuality : true) &&
            (filterSource ? row.source === filterSource : true) &&
            (search
                ? row.client_name?.toLowerCase().includes(search.toLowerCase()) ||
                row.phone?.toString().includes(search)
                : true)
    );

    const columns = [
        { field: "client_name", headerName: "Имя клиента", width: 200 },
        { field: "phone", headerName: "Телефон", width: 150 },
        { field: "selected_car", headerName: "Автомобиль", width: 180 },
        { field: "summary", headerName: "Описание", width: 250 },
        { field: "lead_quality", headerName: "Качество", width: 150 },
        { field: "timestamp", headerName: "Дата", width: 180 },
        { field: "source", headerName: "Источник", width: 150 },
    ];

    const chartData = Object.entries(
        filteredRows.reduce<Record<string, number>>((acc, lead) => {
            const date = new Date(lead.timestamp);
            if (!isNaN(date.getTime())) {
                const key = date.toLocaleDateString();
                acc[key] = (acc[key] || 0) + 1;
            }
            return acc;
        }, {})
    ).map(([time, leads]) => ({ time, leads }));

    const sourceData = Object.entries(
        filteredRows.reduce<Record<string, number>>((acc, lead) => {
            if (lead.source) acc[lead.source] = (acc[lead.source] || 0) + 1;
            return acc;
        }, {})
    ).map(([name, value]) => ({ name, value }));

    const totalLeads = filteredRows.length;
    const highQuality = filteredRows.filter(
        (r) => r.lead_quality === "Высокий"
    ).length;
    const conversion = totalLeads
        ? ((highQuality / totalLeads) * 100).toFixed(1)
        : "0";

    const carCount = filteredRows.reduce<Record<string, number>>((acc, lead) => {
        if (lead.selected_car)
            acc[lead.selected_car] = (acc[lead.selected_car] || 0) + 1;
        return acc;
    }, {});
    const topCars = Object.entries(carCount)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([name, value]) => ({ name, value }));

    const hoursData = Array.from({ length: 24 }, (_, i) => ({
        hour: i,
        leads: 0,
    }));
    filteredRows.forEach((lead) => {
        const date = new Date(lead.timestamp);
        if (!isNaN(date.getTime())) hoursData[date.getHours()].leads += 1;
    });

    return (
        <Box sx={{ p: 4, bgcolor: "#f9fafc", minHeight: "100vh", width: '100%', boxSizing: "border-box" }}>
            <Paper
                elevation={4}
                sx={{
                    p: 4,
                    borderRadius: 4,
                    maxWidth: '1400px',
                    mx: "auto",
                    bgcolor: "white",
                    boxSizing: "border-box"
                }}
            >
                <Typography variant="h4" gutterBottom fontWeight="bold">
                    📊 Dashboard автомобильных лидов
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                    Последнее обновление: {lastUpdate}
                </Typography>

                <Divider sx={{ my: 3 }} />

                <Filters
                    filterQuality={filterQuality}
                    setFilterQuality={setFilterQuality}
                    filterSource={filterSource}
                    setFilterSource={setFilterSource}
                    search={search}
                    setSearch={setSearch}
                />

                <AnalyticsCards totalLeads={totalLeads} conversion={conversion} />

                <Box sx={{ mt: 4 }}>
                    <Typography variant="h6" gutterBottom>
                        📈 Эффективность источников
                    </Typography>
                    <SourceEfficiencyChart rows={filteredRows} />
                </Box>

                <Box sx={{ mt: 4 }}>
                    <LineChartComponent data={chartData} />
                </Box>

                <Box sx={{ mt: 4 }}>
                    <PieChartComponent data={sourceData} />
                </Box>

                <Box sx={{ mt: 4 }}>
                    <DataTable rows={filteredRows} columns={columns} />
                </Box>

                <Box sx={{ mt: 4 }}>
                    <Typography variant="h6" gutterBottom>
                        🚗 Топ-5 популярных моделей
                    </Typography>
                    <TopCars cars={topCars} />
                </Box>

                <Box sx={{ mt: 4 }}>
                    <Typography variant="h6" gutterBottom>
                        🕒 Распределение лидов по часам дня
                    </Typography>
                    <BarChartComponent data={hoursData} />
                </Box>

                <Divider sx={{ my: 4 }} />

                <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => exportToCSV(filteredRows)}
                    >
                        📥 Экспорт CSV
                    </Button>
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => exportToPDF(filteredRows)}
                    >
                        📝 Выгрузка PDF
                    </Button>
                    <TelegramButton botUsername="DashboardHighLeadsBot" />
                </Box>
            </Paper>
        </Box>
    );
};

export default Dashboard;
