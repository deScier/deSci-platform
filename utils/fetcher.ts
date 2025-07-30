import { Session } from 'next-auth';

export const fetcher = async (url: string, token?: string, method?: string, body?: any) => {
  let status_code = 0;
  let message = '';

  try {
    const request = await fetch(url, {
      method: method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    const text = await request.text();

    status_code = request.status;
    message = request.statusText;

    let data = text ? JSON.parse(text) : {};

    if (!request.ok) {
      if (status_code === 403) {
        return { error: 'Você não possui permissão para acessar este recurso.', status: status_code };
      } else {
        const errorMessage = data.message || message;
        throw new Error(errorMessage);
      }
    }

    return data;
  } catch (error: any) {
    return { error: error.message, status: status_code };
  }
};

export const fetcher_authenticated = (session: Session | null) => (url: string) => {
  if (!session?.user?.token) throw new Error('No token available');
  return fetcher(url, session.user.token);
};

export const authenticated_url = (session: Session | null, endpoint: string) =>
  session?.user?.token ? `${process.env.NEXT_PUBLIC_API_URL}${endpoint}` : null;
