import { useSyncExternalStore } from 'react'
import { store } from './useMetamask'

export const useSyncProviders = () => useSyncExternalStore(store.subscribe, store.value, store.value)
