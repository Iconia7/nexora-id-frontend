const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  };

  // If we're using sessions, we need to include credentials
  (defaultOptions as any).credentials = 'include';

  const response = await fetch(url, defaultOptions);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    // Create a rich error object that includes all fields from the server
    const error = new Error(errorData.error || 'API Request failed') as any;
    Object.assign(error, errorData);
    throw error;
  }

  if (response.status === 204) return null;
  return response.json();
}
