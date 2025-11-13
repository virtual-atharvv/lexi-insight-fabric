const API_BASE_URL = "https://anonymousananta-jif-backend.hf.space";

interface ApiOptions extends RequestInit {
  requiresAuth?: boolean;
}

class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: any
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export const getToken = (): string | null => {
  return localStorage.getItem("jif_token");
};

export const setToken = (token: string): void => {
  localStorage.setItem("jif_token", token);
};

export const clearToken = (): void => {
  localStorage.removeItem("jif_token");
};

export const apiRequest = async <T = any>(
  endpoint: string,
  options: ApiOptions = {}
): Promise<T> => {
  const { requiresAuth = true, ...fetchOptions } = options;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...fetchOptions.headers,
  };

  if (requiresAuth) {
    const token = getToken();
    if (!token) {
      throw new ApiError("No authentication token found", 401);
    }
  }

  const url = `${API_BASE_URL}${endpoint}`;
  
  try {
    const response = await fetch(url, {
      ...fetchOptions,
      headers,
    });

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        errorData = { message: response.statusText };
      }

      throw new ApiError(
        errorData.message || errorData.detail || "API request failed",
        response.status,
        errorData
      );
    }

    const data = await response.json();
    return data as T;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError("Network error occurred", 0, error);
  }
};

// Auth APIs
export const authApi = {
  login: (email: string, password: string) =>
    apiRequest("/judge/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
      requiresAuth: false,
    }),
};

// Case APIs
export const caseApi = {
  getAll: () => apiRequest(`/cases/all?token=${getToken()}`),
  
  getById: (caseId: string) =>
    apiRequest(`/cases/${caseId}?token=${getToken()}`),
  
  create: (data: {
    title: string;
    client_name: string;
    description: string;
  }) =>
    apiRequest(`/cases/create?token=${getToken()}`, {
      method: "POST",
      body: JSON.stringify(data),
    }),
  
  updateStatus: (caseId: string, status: string, priority?: string) =>
    apiRequest(`/cases/${caseId}/update-status?token=${getToken()}`, {
      method: "POST",
      body: JSON.stringify({ status, priority }),
    }),
  
  getStatus: (caseId: string) =>
    apiRequest(`/cases/${caseId}/status?token=${getToken()}`),
  
  getSimilar: (caseId: string) =>
    apiRequest(`/cases/${caseId}/similar?token=${getToken()}`),
};

// Document APIs
export const documentApi = {
  upload: (caseId: string, file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    
    const token = getToken();
    return fetch(`${API_BASE_URL}/cases/${caseId}/upload-doc?token=${token}`, {
      method: "POST",
      body: formData,
    }).then(async (res) => {
      if (!res.ok) {
        const error = await res.json();
        throw new ApiError(error.detail || "Upload failed", res.status);
      }
      return res.json();
    });
  },
  
  getAll: (caseId: string) =>
    apiRequest(`/cases/${caseId}/documents?token=${getToken()}`),
  
  runOCR: (caseId: string, documentId: string) =>
    apiRequest(`/cases/${caseId}/ocr`, {
      method: "POST",
      body: JSON.stringify({ document_id: documentId, token: getToken() }),
    }),
};

// Analysis APIs
export const analysisApi = {
  suggestIPC: (caseId: string, documentId: string, textId: string) =>
    apiRequest(`/analyse/suggest_ipc`, {
      method: "POST",
      body: JSON.stringify({
        case_id: caseId,
        document_id: documentId,
        text_id: textId,
        token: getToken(),
      }),
    }),
  
  findPrecedents: (queryText: string, topK: number = 5) =>
    apiRequest(`/analyse/find_precedents`, {
      method: "POST",
      body: JSON.stringify({
        query_text: queryText,
        top_k: topK,
        token: getToken(),
      }),
    }),
};

// Notes APIs
export const noteApi = {
  getAll: (caseId: string) =>
    apiRequest(`/cases/${caseId}/notes?token=${getToken()}`),
  
  add: (caseId: string, content: string) =>
    apiRequest(`/cases/${caseId}/add-note?token=${getToken()}`, {
      method: "POST",
      body: JSON.stringify({ content }),
    }),
};

// Alerts APIs
export const alertApi = {
  getAll: (caseId: string) =>
    apiRequest(`/cases/${caseId}/alerts?token=${getToken()}`),
  
  add: (caseId: string, message: string, alertDate: string) =>
    apiRequest(`/cases/${caseId}/add-alert?token=${getToken()}`, {
      method: "POST",
      body: JSON.stringify({ message, alert_date: alertDate }),
    }),
};
