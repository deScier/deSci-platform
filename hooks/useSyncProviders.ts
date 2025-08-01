import { EIP6963AnnounceProviderEvent, EIP6963ProviderDetail } from '@/globals';
import { useSyncExternalStore } from 'react';

const store = {
  value: () => providers,
  subscribe: (callback: () => void) => {
    function onAnnouncement(event: EIP6963AnnounceProviderEvent) {
      if (providers.map((p) => p.info.uuid).includes(event.detail.info.uuid)) return;
      providers = [...providers, event.detail];
      callback();
    }

    // Listen for eip6963:announceProvider and call onAnnouncement when the event is triggered.
    window.addEventListener('eip6963:announceProvider', onAnnouncement);

    // Dispatch the event, which triggers the event listener in the MetaMask wallet.
    window.dispatchEvent(new Event('eip6963:requestProvider'));

    // Return a function that removes the event listern.
    return () => window.removeEventListener('eip6963:announceProvider', onAnnouncement);
  },
};

declare global {
  interface WindowEventMap {
    'eip6963:announceProvider': CustomEvent;
  }
}

let providers: EIP6963ProviderDetail[] = [];

export const useSyncProviders = () => useSyncExternalStore(store.subscribe, store.value, store.value);
