export class APIError extends Error {
  constructor(public status: number, message: string) {
    super(message)
    this.name = 'APIError'
  }
}

export async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
  }

  const mergedOptions: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  }

  try {
    const response = await fetch(`/api${endpoint}`, mergedOptions)
    
    // Parse JSON safely
    let data
    try {
      data = await response.json()
    } catch {
      data = null
    }

    if (!response.ok) {
      throw new APIError(
        response.status,
        data?.error || data?.message || 'An unexpected error occurred'
      )
    }

    return data as T
  } catch (err) {
    if (err instanceof APIError) throw err
    
    // Network or other fetch errors
    throw new APIError(500, err instanceof Error ? err.message : 'Network error')
  }
}
