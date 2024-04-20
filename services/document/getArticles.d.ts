export type DocumentPaginationProps = {
   documents: DocumentProps[]
}

export type DocumentGetProps = {
   document: DocumentProps
}

export type GetDocumentPublicProps = {
   document: DocumentPublicProps
}

export type DocumentPublicProps = {
   id: string
   title: string
   cover: string
   abstract: string
   abstractChart: string | null
   documentLink: string | null
   keywords: string
   field: string
   documentType: string
   accessType: string
   accessStatus?: string
   price: number
   likes: number
   reviewerApprovals?: number
   editorsApprovals?: number
   downloads: number
   views: number
   authorName: string
   journal: DocumentJournalProps
   createdAt: Date
   updatedAt: Date
   nftHash: string | null
   nftLink: string | null
   authors?: AuthorsPublicInfo[]
   reviewers?: ReviewersPublicInfo[]
   documentLikes: DocumentLikeProps[]
}

export type DocumentProps = {
   id: string
   title: string
   abstract: string
   abstractChart: string | null
   keywords: string
   field: string
   cover: string | null
   documentType: string
   documentLink: string | null
   accessType: string
   price: number
   status: ApprovalStatus
   likes: number
   downloads: number
   views: number
   userId: string
   user?: UserProps
   category: string
   reviewerApprovals: number
   editorsApprovals: number
   adminApproval: number
   nftHash?: string
   nftLink?: string
   journal: DocumentJournalProps
   reviewerInviteLink: string | null
   documentLike?: DocumentLikeProps[]
   createdAt: Date
   updatedAt: Date
   authorsOnDocuments?: AuthorsOnDocuments[]
   reviewersOnDocuments?: ReviewersOnDocuments[]
   documentVersions?: DocumentVersion[]
   documentComments?: DocumentComment[]
}

export type ApprovalStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUBMITTED' | 'ADMIN_APPROVE'

type DocumentJournalProps = {
   id: string
   name: string
}

export type UserProps = {
   id: string
   name: string
   email: string
   avatar: string | null
}

export type DocumentComment = {
   comment_author: string
   id: string
   comment: string
   approvedByAuthor: string
   authorComment: string | null
   userId: string
   user: UserProps
   documentId: string
   createdAt: Date
   updatedAt: Date
}

export type DocumentLikeProps = {
   id: string
   userId?: string
   documentId: string
   createdAt: Date
   updatedAt: Date
}

export type DocumentVersion = {
   id: string
   version: number
   latest: boolean
   link: string
   fileName: string | null
   documentId: string
   createdAt: Date
   updatedAt: Date
}

export type AuthorsOnDocuments = {
   id: string
   authorEmail?: string
   revenuePercent?: number | null
   author?: AuthorProps
}

export type AuthorProps = {
   id?: string
   name: string
   email?: string
   userId?: string
   title: string
   walletAddress?: string | null
   createdAt?: Date
   updatedAt?: Date
}

export type ReviewersOnDocuments = {
   id: string
   reviewerEmail: string
   documentId: string
   role: string
   inviteStatus: string
   approvedStatus: string
   reviewer: ReviewerProps
}

export type ReviewerProps = {
   id: string
   name: string
   email: string
   title: string
   createdAt: Date
   updatedAt: Date
}

export type AuthorsPublicInfo = {
   name: string
   title: string
}

export type ReviewersPublicInfo = {
   name: string
   title: string
   role: string
}

type DocumentLikeProps = {
   id: string
   userId?: string
   documentId: string
   createdAt: Date
   updatedAt: Date
}
