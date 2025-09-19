import React from "react";
import { Grid, Select, MenuItem, TextField } from "@mui/material";

interface FiltersProps {
    filterQuality: string;
    setFilterQuality: (value: string) => void;
    filterSource: string;
    setFilterSource: (value: string) => void;
    search: string;
    setSearch: (value: string) => void;
}

const Filters: React.FC<FiltersProps> = ({ filterQuality, setFilterQuality, filterSource, setFilterSource, search, setSearch }) => {
    return (
        <Grid container spacing={2} style={{ marginBottom: 20 }}>
            <Select value={filterQuality} onChange={e => setFilterQuality(e.target.value)} displayEmpty>
                <MenuItem value="">Все качества</MenuItem>
                <MenuItem value="Высокий">Высокий</MenuItem>
                <MenuItem value="Хороший">Хороший</MenuItem>
                <MenuItem value="Средний">Средний</MenuItem>
                <MenuItem value="Низкий">Низкий</MenuItem>
            </Select>
            <Select value={filterSource} onChange={e => setFilterSource(e.target.value)} displayEmpty>
                <MenuItem value="">Все источники</MenuItem>
                <MenuItem value="AmoLine">AmoLine</MenuItem>
                <MenuItem value="telegramm">Telegram</MenuItem>
            </Select>
            <TextField placeholder="Поиск по имени или телефону" value={search} onChange={e => setSearch(e.target.value)} />
        </Grid>
    );
};

export default Filters;
