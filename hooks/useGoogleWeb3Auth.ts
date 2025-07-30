import { loginUserService, Web3AuthenticateDTO } from '@/services/user/login.service';
import { CHAIN_NAMESPACES, WALLET_ADAPTERS, WEB3AUTH_NETWORK } from '@web3auth/base';
import { EthereumPrivateKeyProvider } from '@web3auth/ethereum-provider';
import { Web3AuthNoModal } from '@web3auth/no-modal';
import { OpenloginAdapter } from '@web3auth/openlogin-adapter';
import { signIn } from 'next-auth/react';
import { toast } from 'react-toastify';

import { AddWalletDTO } from '@/services/user/addWallet.service';
import React from 'react';

export const useGoogleWeb3Auth = (): UseGoogleWeb3AuthReturn => {
  const { getNounce, web3GoogleAuthenticate } = loginUserService();

  const [web3auth, setWeb3auth] = React.useState<Web3AuthNoModal | null>(null);

  React.useEffect(() => {
    const init = async () => {
      try {
        const chainConfig = {
          chainNamespace: CHAIN_NAMESPACES.EIP155,
          chainId: '0x1',
          rpcTarget: 'https://rpc.ankr.com/eth',
          displayName: 'Ethereum Devnet',
          blockExplorerUrl: 'https://etherscan.io/',
          ticker: 'ETH',
          tickerName: 'Ethereum',
          logo: 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
        };

        const privateKeyProvider = new EthereumPrivateKeyProvider({ config: { chainConfig } });

        const web3auth = new Web3AuthNoModal({
          clientId: process.env.WEB3AUTH_CLIENT_ID || 'your_client_id',
          web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
          privateKeyProvider,
        });

        const openloginAdapter = new OpenloginAdapter({
          loginSettings: {
            mfaLevel: 'optional',
          },
          adapterSettings: {
            uxMode: 'popup',
            whiteLabel: { defaultLanguage: 'en' },
            mfaSettings: {
              deviceShareFactor: {
                enable: true,
                priority: 1,
                mandatory: true,
              },
              backUpShareFactor: {
                enable: true,
                priority: 2,
                mandatory: false,
              },
              socialBackupFactor: {
                enable: true,
                priority: 3,
                mandatory: false,
              },
              passwordFactor: {
                enable: true,
                priority: 4,
                mandatory: true,
              },
            },
            loginConfig: {
              google: {
                verifier: process.env.WEB3AUTH_VERIFIER || 'your_verifier',
                typeOfLogin: 'google',
                clientId: process.env.GOOGLE_ID || 'google_id',
              },
            },
          },
        });

        web3auth.configureAdapter(openloginAdapter);
        setWeb3auth(web3auth);

        await web3auth.init();

        if (web3auth.connected) {
        }
      } catch (error) {
        console.error(error);
      }
    };

    init();
  }, []);

  const handleGoogleAuth = async (
    e: React.MouseEvent<HTMLElement>,
    { onSuccess, onError, noRedirect, onRegister, onClose }: GoogleWeb3AuthOptions
  ) => {
    e.preventDefault();
    console.info('Starting Google login process');

    if (!web3auth) {
      toast.error('Web3Auth not initialized yet');
      onError?.();
      return;
    }

    try {
      const web3authProvider = await web3auth.connectTo(WALLET_ADAPTERS.OPENLOGIN, { loginProvider: 'google' });

      if (!web3authProvider) {
        throw new Error('Failed to get Web3Auth provider');
      }

      const userInfo = await web3auth.getUserInfo();

      const nonce = await getNounce();
      const accounts = await web3authProvider.request<never, string[]>({ method: 'eth_accounts' });

      if (!accounts) {
        throw new Error('Failed to get user accounts');
      }

      const from = accounts[0] ?? 'from';
      const signedMessage = await web3authProvider.request<[string, string], string>({
        method: 'personal_sign',
        params: [nonce.nonce, from],
      });

      const data: Web3AuthenticateDTO = {
        walletAddress: from,
        signature: signedMessage ?? '',
        nonce: nonce.nonce,
        provider: 'google',
        idToken: userInfo.idToken,
      };

      const response = await web3GoogleAuthenticate(data);

      if (response.status === 404) {
        toast.info('User not found. Please register first.');
        onRegister?.();
        return;
      }

      if (!String(response.status).startsWith('20')) {
        toast.error(response.reason || 'Authentication failed');
        return;
      }

      const result = await signIn('google', {
        redirect: false,
        walletAddress: from,
        signature: signedMessage,
        nonce: nonce.nonce,
        idToken: userInfo.idToken,
      });

      if (result?.error) {
        toast.error(`Failed to create session: ${result.error}`);
        onError?.();
      } else {
        toast.success('Successfully logged in with Google.');
        if (noRedirect) {
          onClose?.();
        } else {
          onSuccess?.();
        }
      }
    } catch (error) {
      console.error('Google login error:', error);
      if (error instanceof Error) {
        if (error.message.includes('Already connected')) {
          toast.info('Already connected. Please disconnect first.');
        } else {
          toast.error(`Login failed: ${error.message}`);
        }
      }
      onError?.();
    }
  };

  const handleGetGoogleAccount = async (): Promise<AddWalletDTO | undefined> => {
    if (!web3auth) {
      toast.error('Web3Auth not initialized yet');
      return undefined;
    }

    try {
      const web3authProvider = await web3auth.connectTo(WALLET_ADAPTERS.OPENLOGIN, { loginProvider: 'google' });
      if (!web3authProvider) {
        toast.error('Failed to get Web3Auth provider');
        return undefined;
      }

      const accounts = await web3authProvider.request<never, string[]>({ method: 'eth_accounts' });
      if (!accounts) {
        throw new Error('Failed to get user accounts');
      }

      const walletAddress = accounts[0] ?? '';
      const nonce = await getNounce();
      const signature = await web3authProvider.request<[string, string], string>({
        method: 'personal_sign',
        params: [nonce.nonce, walletAddress],
      });

      return { walletAddress, signature: signature as string, nonce: nonce.nonce };
    } catch (error) {
      console.error('Google account retrieval error:', error);
      toast.error('Failed to get account');
      return undefined;
    }
  };

  return { handleGoogleAuth, handleGetGoogleAccount };
};

interface GoogleWeb3AuthOptions {
  noRedirect?: boolean;
  onError?: () => void;
  onRegister?: () => void;
  onClose?: () => void;
  onSuccess?: () => void;
}

interface UseGoogleWeb3AuthReturn {
  handleGoogleAuth: (e: React.MouseEvent<HTMLElement>, options: GoogleWeb3AuthOptions) => Promise<void>;
  handleGetGoogleAccount: () => Promise<AddWalletDTO | undefined>;
}
