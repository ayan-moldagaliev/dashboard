"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendTelegramAlert = exports.subscribers = void 0;
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const node_telegram_bot_api_1 = __importDefault(require("node-telegram-bot-api"));
// 🔹 Токен Telegram-бота
const TELEGRAM_BOT_TOKEN = "8468282549:AAFYNxWXoZkr1LFDIr9r25cgFsY3cDzI7LA";
// 🔹 Список подписчиков (chat_id)
exports.subscribers = [];
// ========================
// Инициализация Telegram бота (long polling)
// ========================
const bot = new node_telegram_bot_api_1.default(TELEGRAM_BOT_TOKEN, { polling: true });
// Команда /start
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, "Добро пожаловать! Подпишитесь на уведомления о высококачественных лидах:", {
        reply_markup: {
            inline_keyboard: [
                [{ text: "✅ Subscribe", callback_data: "subscribe" }],
                [{ text: "❌ Unsubscribe", callback_data: "unsubscribe" }],
            ],
        },
    });
});
// Обработка кнопок
bot.on("callback_query", (query) => {
    const chatId = query.from.id;
    if (query.data === "subscribe") {
        if (!exports.subscribers.includes(chatId))
            exports.subscribers.push(chatId);
        bot.answerCallbackQuery(query.id, { text: "Вы подписаны ✅" });
    }
    if (query.data === "unsubscribe") {
        const index = exports.subscribers.indexOf(chatId);
        if (index > -1)
            exports.subscribers.splice(index, 1);
        bot.answerCallbackQuery(query.id, { text: "Вы отписаны ❌" });
    }
});
// ========================
// Express сервер
// ========================
const app = (0, express_1.default)();
app.use((0, cors_1.default)({ origin: "http://localhost:5174" }));
app.use(body_parser_1.default.json());
// REST API для уведомлений
app.post("/notify-lead", async (req, res) => {
    const lead = req.body;
    if (!lead)
        return res.status(400).send("Нет данных о лиде");
    // Проверяем качество лида
    if (lead.lead_quality === "Высокий") {
        await (0, exports.sendTelegramAlert)(lead);
    }
    res.sendStatus(200);
});
// ========================
// Функция отправки уведомлений
// ========================
const sendTelegramAlert = async (lead) => {
    const message = `
📢 Новый высококачественный лид!
👤 Имя: ${lead.client_name}
📞 Телефон: ${lead.phone}
🚘 Автомобиль: ${lead.selected_car}
🌐 Источник: ${lead.source}
📝 Описание: ${lead.summary}
📅 Дата: ${lead.timestamp}
  `;
    for (const chatId of exports.subscribers) {
        await bot.sendMessage(chatId, message);
    }
};
exports.sendTelegramAlert = sendTelegramAlert;
// ========================
// Запуск сервера
// ========================
app.listen(3000, () => {
    console.log("🚀 Telegram сервер запущен на http://localhost:3000");
});
