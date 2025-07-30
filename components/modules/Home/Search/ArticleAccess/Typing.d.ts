interface ArticleAcessProps {
  access_status: "open" | "paid" | "purchased" | "author";
  access_type: "PAID" | "FREE";
  date: string;
  value: number;
  className?: string;
  onViewDocument?: () => void;
  onBuyDocument?: () => void;
}

export { ArticleAcessProps };
