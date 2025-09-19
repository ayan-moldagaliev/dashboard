import React from "react";
import { Grid, Card, Typography } from "@mui/material";

interface TopCarsProps {
    cars: { name: string; value: number }[];
}

const TopCars: React.FC<TopCarsProps> = ({ cars }) => (
    <Grid container spacing={2} style={{ marginTop: 10 }}>
        {cars.map(car => (
            <Card key={car.name} style={{ padding: 10, minWidth: 120 }}>
                <Typography>{car.name}</Typography>
                <Typography variant="h5">{car.value}</Typography>
            </Card>
        ))}
    </Grid>
);

export default TopCars;
