import Cookie from "js-cookie";

const sockets = { chat: null, notifications: null };

// 0 connecting, 1 open, 2 closing, 3 closed
const isActive = (socket) => socket && socket.readyState <= 1;

const connect = (name, path, token) => {
    const baseUrl = import.meta.env.VITE_SERVER_URL
        .replace(/^http/, "ws")
        .replace(/\/$/, "");

    const socket = new WebSocket(`${baseUrl}${path}?token=${token}`);
    sockets[name] = socket;

    socket.onopen = () => console.log(`${name} socket connected`);
    socket.onerror = (e) => console.error(`${name} socket error`, e);
    socket.onclose = (e) => {
        console.log(`${name} socket disconnected`, e.code, e.reason);
        if (sockets[name] === socket) sockets[name] = null; // ignore stale sockets
    };
};

export const singletonSockets = () => {
    const token = Cookie.get("access_token");

    if (!token) {
        throw new Error("No access token found in cookies.");
    }

    if (!isActive(sockets.chat)) connect("chat", "/ws/chat/", token);
    if (!isActive(sockets.notifications)) connect("notifications", "/ws/notifications/", token);

    return { chatSocket: sockets.chat, notificationSocket: sockets.notifications };
};

export const closeSockets = () => {
    sockets.chat?.close(1000);
    sockets.notifications?.close(1000);
    sockets.chat = null;
    sockets.notifications = null;
};