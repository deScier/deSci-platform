import { Web3Auth } from '@web3auth/modal'
interface ProfileProps {
   className?: string
   onClose?: () => void
   connectWallet?: () => Promise<void>
   mobileWeb3auth?: Web3Auth | null
}

interface BadgeProps {
   status: string
}

interface SubmitedItemProps {
   id?: number
   title: string
   date: string
   status: string
   onClick: () => void
}

export { BadgeProps, ProfileProps, SubmitedItemProps }
