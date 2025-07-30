import { UserProps } from '@/types/user';

export const loginUserService = () => {
  const getNounce = async (): Promise<GetNounceResponse> => {
    const request = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/generate-nonce`);
    const response = await request.json();
    return response;
  };

  const web3GoogleAuthenticate = async (data: Web3AuthenticateDTO): Promise<Web3AuthenticateResponse> => {
    const request = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/web3-auth`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const response: Web3AuthenticateResponse = await request.json();

    return {
      status: request.status,
      message: request.ok ? 'Authentication successful' : 'Authentication failed',
      reason: response.message ?? null,
      user: response.user ?? null,
      token: response.token ?? null,
    };
  };

  const addWalletAddress = async (data: AddWalletDTO, token: string) => {
    const request = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/add-wallet`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(data),
    });
    const response = await request.json();

    return response;
  };

  return {
    getNounce,
    web3GoogleAuthenticate,
    addWalletAddress,
  };
};

export type GetNounceResponse = {
  nonce: string;
};

export type Web3AuthenticateDTO = {
  walletAddress: string;
  signature: string;
  nonce: string;
  provider: string;
  idToken?: string;
};

export type AddWalletDTO = {
  walletAddress: string;
  signature: string;
  nonce: string;
};

export type Web3AuthenticateResponse = {
  status: number;
  user: UserProps;
  token: string;
  reason?: string | null;
  message?: string;
};
