const API_URL = process.env.NEXT_PUBLIC_API_URL;
const fetchApi = async (endpoint: string, options: RequestInit = {}) => {
  try {
    const res = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'include',
    });

    return await res.json();
  } catch {
    return {
      success: false,
      message: 'Something went wrong, please try again later.',
    };
  }
};

export default fetchApi;
