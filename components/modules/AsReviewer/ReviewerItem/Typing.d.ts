interface ReviewerItemProps {
  id?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  added_as: 'reviewer' | 'editor';
  published?: boolean;
  published_date?: string | null;
  access_type?: 'open' | 'paid' | null;
  likes?: number | null;
  views?: number | null;
  image: string;
  since: string;
  title: string;
  link: string;
  document_type?: string;
}

export { ReviewerItemProps };
