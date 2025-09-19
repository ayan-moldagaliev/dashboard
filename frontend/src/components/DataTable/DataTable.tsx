import React from "react";
import LeadDialog from "../LeadDialog";
import { type Lead } from "../../types/Lead";
import { useState } from "react";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";

interface DataTableProps {
    rows: any[];
    columns: GridColDef[];
}

const DataTable: React.FC<DataTableProps> = ({ rows, columns }) => {
    const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
    const [openDialog, setOpenDialog] = useState(false);

    return (
        <div style={{ height: 500, width: "100%" }}>
            <DataGrid
                rows={rows}
                columns={columns}
                pageSizeOptions={[5, 10, 20, 50, 100]}
                initialState={{ pagination: { paginationModel: { pageSize: 5 } } }}
                getRowId={(row) => row.id}
                onRowClick={(params) => {
                    setSelectedLead(params.row);
                    setOpenDialog(true);
                }}
            />
            <LeadDialog
                lead={selectedLead ?? undefined}
                open={openDialog}
                onClose={() => setOpenDialog(false)}
            />
        </div>
    )
};

export default DataTable;
