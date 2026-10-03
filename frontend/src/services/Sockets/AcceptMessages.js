import axios from "axios";


const BASE = "http://localhost/api";

const api = axios.create({
    baseURL: BASE,
    withCredentials: true,
});

// Logs the server's real error body, then rethrows so the caller can handle it.
const request = async (promise) => {
    try {
        const res = await promise;
        return res.data;
    } catch (err) {
        console.error(err.response?.data ?? err.message);
        throw err;
    }
};

export const fetchConversations = async () => {
    const res = await request(api.get("/conversations/mine/"));
    return res.data;
};

export const startConversation = (payload) =>
    request(api.post("/conversations/", payload));

export const startConversationFromProposal = (payload) =>
    request(api.post("/conversations/from-proposal/", payload));

export const startConversationFromDeal = (payload) =>
    request(api.post("/conversations/from-deal/", payload));

export const acceptProposal = (proposalId, payload = {}) =>
    request(api.post(`/proposals/${proposalId}/accept/`, payload));