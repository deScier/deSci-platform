import { ArticlesTypesFilter } from '@/mock/articles_types';

interface SelectArticleTypeProps {
  onValueChange: (value: string, name?: string) => void;
  selected: string | null;
  placeholder?: string;
  no_selected?: boolean;
  variant?: 'filter' | 'input';
  items?: ArticlesTypesFilter[];
  className?: string;
}

export { SelectArticleTypeProps };
