import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import TelegramBot from "node-telegram-bot-api";
require('dotenv').config();

// 🔹 Токен Telegram-бота
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

// 🔹 Список подписчиков (chat_id)
export const subscribers: number[] = [];

// ========================
// Инициализация Telegram бота (long polling)
// ========================
const bot = new TelegramBot(TELEGRAM_BOT_TOKEN!, { polling: true });

// Команда /start
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(
        chatId,
        "Добро пожаловать! Подпишитесь на уведомления о высококачественных лидах:",
        {
            reply_markup: {
                inline_keyboard: [
                    [{ text: "✅ Subscribe", callback_data: "subscribe" }],
                    [{ text: "❌ Unsubscribe", callback_data: "unsubscribe" }],
                ],
            },
        }
    );
});

// Обработка кнопок
bot.on("callback_query", (query) => {
    const chatId = query.from.id;

    if (query.data === "subscribe") {
        if (!subscribers.includes(chatId)) subscribers.push(chatId);
        bot.answerCallbackQuery(query.id, { text: "Вы подписаны ✅" });
    }

    if (query.data === "unsubscribe") {
        const index = subscribers.indexOf(chatId);
        if (index > -1) subscribers.splice(index, 1);
        bot.answerCallbackQuery(query.id, { text: "Вы отписаны ❌" });
    }
});

// ========================
// Express сервер
// ========================
const app = express();
app.use(cors({ origin: "http://localhost:5174" }));
app.use(bodyParser.json());

// REST API для уведомлений
app.post("/notify-lead", async (req, res) => {
    const lead = req.body;
    if (!lead) return res.status(400).send("Нет данных о лиде");

    // Проверяем качество лида
    if (lead.lead_quality === "Высокий") {
        await sendTelegramAlert(lead);
    }

    res.sendStatus(200);
});

// ========================
// Функция отправки уведомлений
// ========================
export const sendTelegramAlert = async (lead: any) => {
    const message = `
📢 Новый высококачественный лид!
👤 Имя: ${lead.client_name}
📞 Телефон: ${lead.phone}
🚘 Автомобиль: ${lead.selected_car}
🌐 Источник: ${lead.source}
📝 Описание: ${lead.summary}
📅 Дата: ${lead.timestamp}
  `;

    for (const chatId of subscribers) {
        await bot.sendMessage(chatId, message);
    }
};

// ========================
// Запуск сервера
// ========================
app.listen(3000, () => {
    console.log("🚀 Telegram сервер запущен на http://localhost:3000");
});
