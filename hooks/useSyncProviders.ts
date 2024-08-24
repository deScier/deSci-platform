import { store } from '@hooks/useMetamask'
import { useSyncExternalStore } from 'react'

export const useSyncProviders = () => useSyncExternalStore(store.subscribe, store.value, store.value)
