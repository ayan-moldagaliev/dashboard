import React from "react";
import { Button } from "@mui/material";
import { FaTelegramPlane } from "react-icons/fa";

interface TelegramButtonProps {
    botUsername: string;
}

const TelegramButton: React.FC<TelegramButtonProps> = ({ botUsername }) => {
    const telegramLink = `https://t.me/${botUsername}`;

    return (
        <Button
            variant="contained"
            color="primary"
            startIcon={<FaTelegramPlane />}
            onClick={() => window.open(telegramLink, "_blank")}
        >
            Подписаться на уведомления
        </Button>
    );
};

export default TelegramButton;
