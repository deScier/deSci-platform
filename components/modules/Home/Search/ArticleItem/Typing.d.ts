interface ArticleItemProps {
  className?: string;
  id: string;
  published_date: string;
  access_type: "open" | "paid" | null;
  likes: number | null;
  views: number | null;
  image: string;
  title: string;
  tags: { id: string; name: string }[];
  document_type?: string;
  authors: { id: string; name: string }[];
  journal?: { id: string; name: string };
}

export { ArticleItemProps };
