import { Key } from '@keplr-wallet/types'
import { atom } from 'recoil'

import { Wallet } from 'util/wallet-adapters'

export enum WalletStatusType {
  /* nothing happens to the wallet */
  idle = '@wallet-state/idle',
  /* restored wallets state from the cache */
  restored = '@wallet-state/restored',
  /* the wallet is fully connected */
  connected = '@wallet-state/connected',
  /* the wallet is fully connected */
  disconnected = '@wallet-state/disconnected',
  /* connecting to the wallet */
  connecting = '@wallet-state/connecting',
  /* error when tried to connect */
  error = '@wallet-state/error',
}

type GeneratedWalletState<
  TClient extends any,
  TStateExtension extends {}
> = TStateExtension & {
  client: TClient | null
  status: WalletStatusType
  address: string
  chainId: string
  network: Network
  activeWallet: string
}

type CreateWalletStateArgs<TState = {}> = {
  key: string
  default: TState
}

function createWalletState<TClient = any, TState = {}>({
  key,
  default: defaultState,
}: CreateWalletStateArgs<TState>) {
  return atom<GeneratedWalletState<TClient, TState>>({
    key,
    default: {
      status: WalletStatusType.idle,
      client: null,
      // chainId: 'juno-1',
      chainId: null,
      address: '',
      network: 'mainnet',
      activeWallet: '',
      ...defaultState,
    },
    dangerouslyAllowMutability: true,
    effects_UNSTABLE: [
      ({ onSet, setSelf }) => {
        const CACHE_KEY = `@wasmswap/wallet-state/wallet-type-${key}`
        const savedValue = localStorage.getItem(CACHE_KEY)
        if (savedValue) {
          try {
            const parsedSavedState = JSON.parse(savedValue)
            if (parsedSavedState?.address) {
              setSelf({
                ...parsedSavedState,
                client: null,
                status: WalletStatusType.restored,
              })
            }
          } catch (e) {}
        }

        onSet((newValue, oldValue) => {
          // const isReset = newValue.address !== (oldValue as any)?.address

          // if (isReset) {
          //   localStorage.removeItem(CACHE_KEY)
          // } else {
          localStorage.setItem(
            CACHE_KEY,
            /* let's not store the client in the cache */
            JSON.stringify({ ...newValue, client: null })
          )
          // }
        })
      },
    ],
  })
}

export const walletState = createWalletState<Wallet, { key?: Key }>({
  key: 'internal-wallet',
  default: {
    key: null,
  },
})

export const ibcWalletState = createWalletState<
  Wallet,
  {
    /* ibc wallet is connected */
    tokenSymbol?: string
  }
>({
  key: 'ibc-wallet',
  default: {
    tokenSymbol: null,
  },
})

type Network = 'testnet' | 'mainnet'
