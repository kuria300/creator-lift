export const getErrorMessage = (err) => {
  const status = err?.response?.status;
  const data = err?.response?.data;

  if (
    status === 503 ||
    data?.error?.code === 503 ||
    data?.error?.status === "UNAVAILABLE" ||
    err?.message?.includes("503 UNAVAILABLE")
  ) {
    return "Our AI assistant is experiencing high demand right now. Please try again in a moment.";
  }

  if (status === 429 || data?.error?.code === 429) {
    return "You've sent too many requests. Please wait a moment and try again.";
  }

  if (status === 401) {
    return "Your session may have expired. Please log in again.";
  }

  if (status === 403) {
    return "You don't have permission to perform this action.";
  }

  if (status >= 500) {
    return "Our server encountered a problem. Please try again shortly.";
  }

  const apiMessage =
    data?.error?.message ||
    data?.detail ||
    data?.message ||
    data?.error;

  if (typeof apiMessage === "string" && apiMessage.trim()) {
    return apiMessage;
  }

  if (err?.message === "Network Error" || !err?.response) {
    return "Unable to connect to the server. Check your internet connection and try again.";
  }

  return "Something went wrong. Please try again.";
};