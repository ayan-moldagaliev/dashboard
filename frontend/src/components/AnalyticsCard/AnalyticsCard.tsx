import React from "react";
import { Card, CardContent, Typography, Grid } from "@mui/material";

interface AnalyticsCardsProps {
    totalLeads: number;
    conversion: string;
}

const AnalyticsCards: React.FC<AnalyticsCardsProps> = ({ totalLeads, conversion }) => (
    <Grid container spacing={2} style={{ marginBottom: 20 }}>
        <Card><CardContent><Typography>Всего лидов</Typography><Typography variant="h5">{totalLeads}</Typography></CardContent></Card>
        <Card><CardContent><Typography>Высокое качество (%)</Typography><Typography variant="h5">{conversion}%</Typography></CardContent></Card>
    </Grid>
);

export default AnalyticsCards;
