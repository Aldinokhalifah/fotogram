export function buildHeaders(optionsHeaders?: RequestInit['headers'], body?: RequestInit['body']): HeadersInit {
    const headers: Record<string, string> = {};
    const isFormLikeBody = body instanceof FormData || body instanceof URLSearchParams;

    if (body != null && !isFormLikeBody) {
        headers['Content-Type'] = 'application/json';
    }

    if (optionsHeaders instanceof Headers) {
        optionsHeaders.forEach((value, key) => {
            headers[key] = value;
        });
    } else if (Array.isArray(optionsHeaders)) {
        optionsHeaders.forEach(([key, value]) => {
            headers[key] = value;
        });
    } else if (optionsHeaders) {
        Object.assign(headers, optionsHeaders);
    }

    return headers;
}