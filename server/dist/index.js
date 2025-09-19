"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const googleapis_1 = require("googleapis");
const telegram_1 = require("./telegram");
// ========================
// Конфиг Google Sheets
// ========================
const SHEET_ID = "1DFfWMbSVJgSPm6HW65yC0HUvRZ8LQo0xZ59BttjPscw"; // 👉 вставь ID таблицы
const RANGE = "Лист1!A:G"; // 👉 диапазон (подстрой под свою таблицу)
// ========================
// Настройка Express
// ========================
const app = (0, express_1.default)();
app.use((0, cors_1.default)({ origin: "http://localhost:5174" }));
app.use(body_parser_1.default.json());
// ========================
// Авторизация Google
// ========================
async function getSheetsClient() {
    const auth = new googleapis_1.google.auth.GoogleAuth({
        keyFile: "service-account.json",
        scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });
    // ❌ НЕ делаем getClient()
    return googleapis_1.google.sheets({ version: "v4", auth });
}
// ========================
// 📌 Получение всех лидов
// ========================
app.get("/leads", async (req, res) => {
    try {
        const sheets = await getSheetsClient();
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: SHEET_ID,
            range: RANGE,
        });
        const rows = response.data.values || [];
        const headers = rows[0];
        const data = rows.slice(1).map((row) => {
            const obj = {};
            headers.forEach((h, i) => (obj[h] = row[i] || ""));
            return obj;
        });
        res.json(data);
    }
    catch (err) {
        console.error("Ошибка при чтении Google Sheets:", err);
        res.status(500).send("Ошибка при чтении данных");
    }
});
// ========================
// 📌 Добавление лида
// ========================
app.post("/add-lead", async (req, res) => {
    try {
        const lead = req.body;
        const sheets = await getSheetsClient();
        await sheets.spreadsheets.values.append({
            spreadsheetId: SHEET_ID,
            range: RANGE,
            valueInputOption: "RAW",
            requestBody: {
                values: [[
                        lead.client_name,
                        lead.phone,
                        lead.selected_car,
                        lead.source,
                        lead.summary,
                        lead.lead_quality,
                    ]],
            },
        });
        // 🔹 Только здесь отправляем уведомление
        if (lead.lead_quality === "Высокий") {
            await (0, telegram_1.sendTelegramAlert)(lead);
        }
        res.sendStatus(200);
    }
    catch (err) {
        console.error("Ошибка при добавлении лида:", err);
        res.status(500).send("Ошибка при добавлении данных");
    }
});
// ========================
// Запуск сервера
// ========================
app.listen(3000, () => console.log("✅ Server running on port 3000"));
