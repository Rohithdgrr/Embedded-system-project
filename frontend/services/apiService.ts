const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

class ApiService {
  private sessionId: number | null = null;

  setSessionId(id: number) {
    this.sessionId = id;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`API Error: ${response.status} - ${error}`);
    }

    return response.json();
  }

  async createSession(name: string, expectedCount: number, streamUrl?: string) {
    const session = await this.request<any>('/sessions', {
      method: 'POST',
      body: JSON.stringify({ name, expectedCount, streamUrl }),
    });
    this.sessionId = session.id;
    return session;
  }

  async getAllSessions() {
    return this.request<any[]>('/sessions');
  }

  async getSession(id: number) {
    return this.request<any>(`/sessions/${id}`);
  }

  async startSession(id: number, streamUrl?: string) {
    const url = streamUrl
      ? `/sessions/${id}/start?streamUrl=${encodeURIComponent(streamUrl)}`
      : `/sessions/${id}/start`;
    return this.request<any>(url, { method: 'POST' });
  }

  async pauseSession(id: number) {
    return this.request<any>(`/sessions/${id}/pause`, { method: 'POST' });
  }

  async resumeSession(id: number) {
    return this.request<any>(`/sessions/${id}/resume`, { method: 'POST' });
  }

  async endSession(id: number) {
    return this.request<any>(`/sessions/${id}/end`, { method: 'POST' });
  }

  async updateHeadCount(id: number, count: number) {
    return this.request<any>(`/sessions/${id}/headcount?count=${count}`, {
      method: 'PUT',
    });
  }

  async deleteSession(id: number) {
    return this.request<void>(`/sessions/${id}`, { method: 'DELETE' });
  }

  async getActiveSessions() {
    return this.request<any[]>('/sessions/active');
  }

  async startStreamDetection(sessionId: number, streamUrl: string) {
    return this.request<any>(`/detect/stream?sessionId=${sessionId}&streamUrl=${encodeURIComponent(streamUrl)}`, {
      method: 'POST',
    });
  }

  async uploadVideo(sessionId: number, file: File) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('sessionId', sessionId.toString());

    const response = await fetch(`${API_BASE_URL}/detect/video`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.status}`);
    }

    return response.json();
  }

  async getJobStatus(jobId: string) {
    return this.request<any>(`/detect/status/${jobId}`);
  }

  async getSessionStats(sessionId: number) {
    return this.request<any>(`/detect/stats/${sessionId}`);
  }

  async getSessionDetections(sessionId: number) {
    return this.request<any[]>(`/detect/events/${sessionId}`);
  }

  async getSessionScores(sessionId: number) {
    return this.request<any[]>(`/detect/scores/${sessionId}`);
  }

  async getSessionReport(sessionId: number) {
    return this.request<any>(`/reports/${sessionId}`);
  }

  async getDashboardStats() {
    return this.request<any>('/reports/dashboard');
  }
}

export const apiService = new ApiService();
