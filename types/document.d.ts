export type UserProps = {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  title: string | null;
};

export type DocumentDTO = {
  title: string;
  abstract?: string;
  abstractChart?: string | null;
  keywords: string[];
  field: string;
  documentType: string;
  category: string;
  accessType: AccessType;
  price: number;
  userId: string;
  journalId: string;
  authors: AuthorsDTO[];
};

export type AuthorsDTO = {
  name: string;
  email: string;
  title: string;
  revenuePercent?: number;
  walletAddress?: string;
  position?: number;
};

export type ReviewersDTO = {
  name: string;
  email: string;
  title: string;
  role: string;
};

export type PaginationProps = {
  currentPage: number;
  nextPage: number | null;
  previousPage: number | null;
  totalItems: number;
};

export type DocumentPaginationProps = {
  pagination: PaginationProps;
  data: DocumentProps[];
};

export type DocumentProps = {
  id: string;
  title: string;
  abstract: string | null;
  abstractChart: string | null;
  keywords: string;
  field: string;
  cover: string | null;
  documentType: string;
  category: string;
  documentLink: string | null;
  accessType: string;
  price: number;
  status: ApprovalStatus;
  likes: number;
  downloads: number;
  views: number;
  userId: string;
  user?: UserProps;
  reviewerApprovals: number;
  editorsApprovals: number;
  adminApproval: number;
  reviewerInviteLink: string | null;
  documentLike?: DocumentLikeProps[];
  journalId: string | null;
  nftHash?: string | null;
  nftLink?: string | null;
  createdAt: Date;
  updatedAt: Date;
  authorsOnDocuments?: AuthorsOnDocuments[];
  reviewersOnDocuments?: ReviewersOnDocuments[];
  documentVersions?: DocumentVersion[];
  documentComments?: DocumentComment[];
  journal?: JournalProps | null;
};

export type DocumentPublicProps = {
  id: string;
  title: string;
  cover: string;
  abstract: string;
  abstractChart: string | null;
  documentLink: string | null;
  keywords: string;
  field: string;
  documentType: string;
  accessType: string;
  accessStatus?: string;
  price: number;
  likes: number;
  reviewerApprovals?: number;
  editorsApprovals?: number;
  downloads: number;
  views: number;
  authorName: string;
  journalId: string;
  nftHash?: string | null;
  nftLink?: string | null;
  createdAt: Date;
  updatedAt: Date;
  authors?: AuthorsPublicInfo[];
  reviewers?: ReviewersPublicInfo[];
  documentLikes?: DocumentLikeProps[];
  documentVersions?: DocumentVersion[];
  documentComments?: DocumentComment[];
  journal?: JournalProps | null;
};

export type JournalProps = {
  id: string;
  name: string;
};

export type DocumentLikeProps = {
  id: string;
  userId?: string;
  documentId: string;
  createdAt: Date;
  updatedAt: Date;
};

export type AuthorsPublicInfo = {
  name: string;
  title: string;
  position?: number;
};

export type ReviewersPublicInfo = {
  name: string;
  title: string;
  role: string;
};

export type DocumentVersion = {
  id: string;
  version: number;
  latest: boolean;
  link: string;
  fileName: string | null;
  documentId: string;
  createdAt: Date;
  updatedAt: Date;
};

export type DocumentComment = {
  id: string;
  comment: string;
  approvedByAuthor: string;
  authorComment: string | null;
  userId: string;
  user: UserProps;
  documentId: string;
  createdAt: Date;
  updatedAt: Date;
};

export type AuthorsOnDocuments = {
  id: string;
  authorEmail?: string;
  revenuePercent?: number | null;
  author?: AuthorProps;
  position: number | null;
};

export type ReviewersOnDocuments = {
  id: string;
  reviewerEmail: string;
  documentId: string;
  role: string;
  inviteStatus: string;
  approvedStatus: string;
  reviewer: ReviewerProps;
};

export type AuthorProps = {
  id?: string;
  name: string;
  email?: string;
  title: string;
  walletAddress?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
};

export type ReviewerProps = {
  id: string;
  name: string;
  email: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
};

export type FilterDocumentsProps = {
  accessType?: AccessType;
  field?: string;
  title?: string;
  createdFrom?: Date;
  createdUntil?: Date;
  status?: ApprovalStatus;
  page?: number;
  perPage?: number;
  all?: boolean;
};

export type FetchByUserFilters = {
  userId: string;
  status?: ApprovalStatus;
  perPage?: number;
  page?: number;
};

export type UpdateDocumentDTO = {
  title?: string;
  abstract?: string;
  cover?: string;
  abstractChart?: string | null;
  keywords?: string[];
  field?: string;
  accessType?: AccessType;
  price?: number;
  likes?: number;
  documentType?: string;
  documentLink?: string;
  reviewerInviteLink?: string;
  reviewerInviteCode?: string;
  status?: ApprovalStatus;
  authors?: AuthorsDTO[];
  views?: number;
  nftHash?: string;
  nftLink?: string;
  tokenId?: string;
  txHash?: string;
  txLink?: string;
  blockchain?: string;
};

export type UpdateAuthor = {
  id: string;
  name?: string;
  email?: string;
  title?: string;
  revenuePercent?: number;
  walletAddress?: string;
  position?: number;
};

export type GetVersionDTO = {
  version?: number;
  documentId: string;
  latest?: boolean;
};

export type CreateVersionDTO = {
  link: string;
  latest: boolean;
  fileName: string;
  version: number;
  documentId: string;
};

export type UpdateVersionDTO = {
  link?: string;
  latest?: boolean;
  fileName?: string;
};

export type StatisticsProps = {
  totalDocuments: number;
  totalSubmittedDocuments: number;
  totalUnderReviewDocuments: number;
  totalLikesOnDocuments: number;
  totalViewsOnDocuments: number;
  publishedDocuments: DocumentBasicProps[];
  pendingDocuments: DocumentBasicProps[];
};

export type DocumentBasicProps = {
  id: string;
  title: string;
  cover?: string;
  createdAt: Date;
  reviewerApprovals: number;
  editorsApprovals: number;
  likes: number;
  views: number;
};

export type AccessType = 'FREE' | 'PAID';

export type ApprovalStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUBMITTED' | 'ADMIN_APPROVE';
