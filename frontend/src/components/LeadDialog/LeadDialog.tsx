import React from "react";
import {
    Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Grid
} from "@mui/material";
import { type Lead } from "../../types/Lead";

interface LeadDialogProps {
    open: boolean;
    onClose: () => void;
    lead?: Lead;
}

const LeadDialog: React.FC<LeadDialogProps> = ({ open, onClose, lead }) => {
    if (!lead) return null;

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Детальная информация о лиде</DialogTitle>
            <DialogContent dividers>
                <Grid container spacing={2}>
                    <Grid><Typography variant="subtitle2">Имя:</Typography> {lead.client_name}</Grid>
                    <Grid><Typography variant="subtitle2">Телефон:</Typography> {lead.phone}</Grid>
                    <Grid><Typography variant="subtitle2">Автомобиль:</Typography> {lead.selected_car}</Grid>
                    <Grid><Typography variant="subtitle2">Источник:</Typography> {lead.source}</Grid>
                    <Grid><Typography variant="subtitle2">Качество:</Typography> {lead.lead_quality}</Grid>
                    <Grid><Typography variant="subtitle2">Дата:</Typography> {lead.timestamp}</Grid>
                    <Grid><Typography variant="subtitle2">Описание:</Typography> {lead.summary}</Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Закрыть</Button>
            </DialogActions>
        </Dialog>
    );
};

export default LeadDialog;
