import { EIP1193EventMap, EIP1193RequestFn, EIP1474Methods } from 'viem';

interface EIP6963ProviderInfo {
  rdns: string;
  uuid: string;
  name: string;
  icon: string;
}

interface EIP6963ProviderDetail {
  info: EIP6963ProviderInfo;
  provider: EIP1193Provider;
}

type EIP6963AnnounceProviderEvent = {
  detail: {
    info: EIP6963ProviderInfo;
    provider: Readonly<EIP1193Provider>;
  };
};

interface EIP1193Provider {
  isStatus?: boolean;
  host?: string;
  path?: string;
  sendAsync?: (
    request: { method: string; params?: Array<unknown> },
    callback: (error: Error | null, response: unknown) => void
  ) => void;
  send?: (
    request: { method: string; params?: Array<unknown> },
    callback: (error: Error | null, response: unknown) => void
  ) => void;
  request: (request: { method: string; params?: Array<unknown> }) => Promise<unknown>;
}

declare global {
  interface Window {
    ethereum?: {
      on: <E extends keyof EIP1193EventMap>(event: E, listener: EIP1193EventMap[E]) => void;
      removeListener: <E extends keyof EIP1193EventMap>(event: E, listener: EIP1193EventMap[E]) => void;
      request: EIP1193RequestFn<EIP1474Methods>;
    };
  }
}
