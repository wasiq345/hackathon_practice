const API_URL =
    import.meta.env.VITE_API_URL || "http://localhost:8000/api";

async function request(endpoint, options = {}) {
    const token = localStorage.getItem("access_token");

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,

        headers: {
            "Content-Type": "application/json",
            ...(token
                ? {
                    Authorization: `Bearer ${token}`,
                }
                : {}),
            ...(options.headers || {}),
        },
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));

        throw new Error(
            error.detail || "Something went wrong",
        );
    }

    return response.json();
}

export const api = {
    login: (email, password) =>
        request("/auth/login", {
            method: "POST",
            body: JSON.stringify({
                email,
                password,
            }),
        }),

    register: (data) =>
        request("/auth/register", {
            method: "POST",
            body: JSON.stringify(data),
        }),

    getIssues: () => request("/issues"),

    getIssue: (id) => request(`/issues/${id}`),

    createIssue: (data) =>
        request("/issues", {
            method: "POST",
            body: JSON.stringify(data),
        }),

    updateIssue: (id, data) =>
        request(`/issues/${id}`, {
            method: "PATCH",
            body: JSON.stringify(data),
        }),

    addComment: (id, text) =>
        request(`/issues/${id}/comments`, {
            method: "POST",
            body: JSON.stringify({
                text,
            }),
        }),

    upvoteIssue: (id) =>
        request(`/issues/${id}/upvote`, {
            method: "POST",
        }),
};
