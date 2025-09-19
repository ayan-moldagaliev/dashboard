import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import RobotoFont from './Roboto';

export const exportToPDF = (rows: any[], filename = 'leads.pdf') => {
    if (!rows || rows.length === 0) return;

    const doc = new jsPDF('l', 'mm', 'a4'); // ландшафт, чтобы больше места по ширине
    doc.addFileToVFS('Roboto-Regular.ttf', RobotoFont);
    doc.addFont('Roboto-Regular.ttf', 'Roboto', 'normal');
    doc.setFont('Roboto');

    const columns = Object.keys(rows[0]).map(key => ({ header: key, dataKey: key }));

    autoTable(doc, {
        columns,
        body: rows,
        styles: {
            font: 'Roboto',
            fontSize: 10,
            cellPadding: 3,
            overflow: 'linebreak',
            valign: 'top',
            halign: 'left',
        },
        headStyles: {
            fillColor: [76, 125, 255],
            textColor: 255,
            fontStyle: 'bold',
            halign: 'center',
        },
        columnStyles: Object.fromEntries(
            columns.map(col => [col.dataKey, { cellWidth: 'auto' }]) // автоширина под контент
        ),
        tableWidth: 'auto',
        margin: { top: 20, left: 10, right: 10, bottom: 20 },
    });

    doc.save(filename);
};
