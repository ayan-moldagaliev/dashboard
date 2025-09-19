export const exportToCSV = (rows: any[], filename = 'leads.csv') => {
    if (!rows || rows.length === 0) return;

    const headers = Object.keys(rows[0]);
    const csvRows = [];

    // 🔹 Заголовки через точку с запятой
    csvRows.push(headers.join(';'));

    // 🔹 Данные
    rows.forEach(row => {
        const values = headers.map(h => {
            const value = row[h] ?? '';
            // если значение содержит ; или " — заключаем в кавычки и экранируем
            if (typeof value === 'string' && (value.includes(';') || value.includes('"'))) {
                return `"${value.replace(/"/g, '""')}"`;
            }
            return value;
        });
        csvRows.push(values.join(';'));
    });

    // 🔹 UTF-8 BOM для Excel
    const csvString = '\uFEFF' + csvRows.join('\r\n');

    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
};
