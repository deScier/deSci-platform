import { AddWalletDTO } from '@/services/user/addWallet.service';
import { loginUserService, Web3AuthenticateDTO } from '@/services/user/login.service';
import { signIn } from 'next-auth/react';
import { toast } from 'react-toastify';
import { createWalletClient, custom } from 'viem';
import { sepolia } from 'viem/chains';

export const useMetamaskAuth = (): UseMetamaskAuthReturn => {
  const { getNounce, web3GoogleAuthenticate } = loginUserService();

  const walletClient =
    typeof window !== 'undefined' && window.ethereum
      ? createWalletClient({
          chain: sepolia,
          transport: custom(window.ethereum!),
        })
      : null;

  const handleConnectProvider = async () => {
    try {
      const accounts = await window?.ethereum?.request({
        method: 'eth_requestAccounts',
      });
      let selectedAccount;
      if (accounts && accounts.length > 0) {
        selectedAccount = accounts[0];
      } else {
        toast.error('No accounts found. Please connect to MetaMask.');
        return;
      }
    } catch (error) {
      console.error('MetaMask connection error:', error);
      toast.error('Failed to connect to MetaMask.');
      return;
    }
  };

  const handleMetamaskAuth = async (
    e: React.MouseEvent<HTMLElement>,
    { onSuccess, onError, noRedirect, onRegister, onClose, onWallet }: MetamaskAuthOptions
  ) => {
    e.preventDefault();

    await handleConnectProvider();

    try {
      if (!walletClient) {
        toast.error('No wallet providers available. Install MetaMask or another wallet provider.');
        return;
      }

      const [account] = await walletClient.getAddresses().catch(() => []);

      if (!account) {
        toast.error('No accounts found. Please connect to MetaMask.');
        return;
      }

      const nonce = await getNounce();

      if (!nonce) {
        toast.error('Failed to get nonce. Please try again.');
        return;
      }

      const signedMessage = await walletClient
        .signMessage({
          account,
          message: nonce.nonce,
        })
        .catch(() => '');

      if (!signedMessage) {
        toast.error('Failed to sign message. Please try again.');
        return;
      }

      onWallet?.(account);

      const data: Web3AuthenticateDTO = {
        walletAddress: account,
        signature: signedMessage,
        nonce: nonce.nonce,
        provider: 'wallet',
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

      const result = await signIn('wallet', {
        redirect: false,
        walletAddress: account,
        signature: signedMessage,
        nonce: nonce.nonce,
      });

      if (result?.error) {
        toast.error(`Failed to create session: ${result.error}`);
        onError?.();
      } else {
        toast.success('Successfully logged in with MetaMask.');
        if (noRedirect) {
          onClose?.();
        } else {
          onSuccess?.();
        }
      }
    } catch (error) {
      console.error('MetaMask login error:', error);
      onError?.();
    }
  };

  const handleGetMetamaskAccount = async (): Promise<AddWalletDTO | undefined> => {
    await handleConnectProvider();

    if (!walletClient) {
      toast.error('No wallet providers available. Install MetaMask or another wallet provider.');
      return undefined;
    }

    try {
      const [walletAddress] = await walletClient.getAddresses();
      if (!walletAddress) {
        throw new Error('Failed to get wallet address');
      }

      const nonce = await getNounce();

      const signature = await walletClient.signMessage({
        account: walletAddress,
        message: nonce.nonce,
      });

      return { walletAddress, signature, nonce: nonce.nonce };
    } catch (error) {
      console.error('MetaMask account retrieval error:', error);
      toast.error('Failed to get account');
      toast.info('Please try open MetaMask extension and try again.');
      return undefined;
    }
  };

  return { handleMetamaskAuth, handleGetMetamaskAccount };
};

interface MetamaskAuthOptions {
  noRedirect?: boolean;
  onSuccess?: () => void;
  onError?: () => void;
  onRegister?: () => void;
  onClose?: () => void;
  onWallet?: (address: string) => void;
}

interface UseMetamaskAuthReturn {
  handleMetamaskAuth: (e: React.MouseEvent<HTMLElement>, options: MetamaskAuthOptions) => Promise<void>;
  handleGetMetamaskAccount: () => Promise<AddWalletDTO | undefined>;
}
