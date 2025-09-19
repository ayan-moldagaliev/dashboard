export interface Lead {
    id: string;
    client_name: string;
    phone: string;
    selected_car: string;
    summary: string;
    lead_quality: "Высокий" | "Хороший" | "Средний" | "Низкий";
    timestamp: string;
    source: string;
}