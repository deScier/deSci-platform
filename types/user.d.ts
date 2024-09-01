import { DocumentProps } from './document'

export type UserRoles = 'ADMIN' | 'USER'

export type CreateUserDTO = {
   name: string
   email: string
   password: string
   reviewerInviteCode?: string
   walletAddress?: string
}

export type AuthenticateProps = {
   email: string
   password: string
   reviewerInviteCode?: string
}

export type GoogleAuthenticateDTO = {
   name: string
   email: string
   googleId: string
   avatar?: string
   walletAddress: string
   signature: string
   nonce: string
}

export type Web3AuthenticateDTO = {
   walletAddress: string
   signature: string
   nonce: string
}

export type UserProps = {
   id: string
   name: string
   email: string
   password?: string
   lattes?: string | null
   title?: string
   avatar?: string
   walletAddress?: string
   confirmationCode?: string
   confirmationCodeExpiration?: Date
   isProfileConfirmed?: boolean
   googleId?: string
   aiUsageLimit: number
   role?: UserRoles
   createdAt: Date
   updatedAt?: Date
   library?: UserLibrary[]
}

export type UserLibrary = {
   id: string
   userId: string
   documentId: string
   document?: DocumentProps
}

export type UserResponse = {
   user: UserProps
   message?: string
}

export type UpdateUserDTO = {
   name?: string
   password?: string
   lattes?: string
   email?: string
   avatar?: string
   title?: string
   walletAddress?: string
   confirmationCode?: string | null
   confirmationCodeExpiration?: Date
   isProfileConfirmed?: boolean
   newPassword?: string
   aiUsageLimit?: number
   currentPassword: string
}

export type UpdateUserQuery = {
   name?: string
   password?: string
   email?: string
   title?: string
   lattes?: string
   avatar?: string
   walletAddress?: string
   confirmationCode?: string | null
   confirmationCodeExpiration?: Date
   isProfileConfirmed?: boolean
}

export type ConfirmProfileDTO = {
   confirmationCode: string
   userEmail: string
}

export type ValidateRecoveryPasswordDTO = {
   email: string
   confirmationCode: string
}

export type RecoveryPasswordDTO = {
   newPassword: string
   confirmPassword: string
   confirmationCode: string
   email: string
}

export type AddWalletDTO = {
   userId: string
   walletAddress: string
}

export type PaginationProps = {
   currentPage: number
   nextPage: number | null
   previousPage: number | null
   totalItems: number
}

export type FetchUserLibraryWithPagination = {
   data: UserLibrary[]
}

export type UserLibraryFilters = {
   userId: string
   title?: string
   author?: string
   page?: number
   perPage?: number
}
