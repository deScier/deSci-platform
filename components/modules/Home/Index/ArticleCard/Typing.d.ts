interface ArticleCardProps {
  id: string;
  title: string;
  authors: { id: string; name: string }[];
  image: string;
  likes?: number | null;
  views?: number | null;
  tags?: { id: string; name: string }[];
  className?: string;
  responsive?: boolean;
  publishedAt?: Date;
  documentType?: string;
  accessType?: 'open' | 'paid';
  field?: string;
  with_dot?: boolean;
  link?: string;
  journal: { id: stirng; name: string };
}

export { ArticleCardProps };
