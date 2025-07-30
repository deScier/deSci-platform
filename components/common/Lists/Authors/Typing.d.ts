import { Author } from '@/mock/submit_new_document';
import { DocumentGetProps } from '@/services/document/getArticles';

interface AuthorsListDragabbleProps {
  article: DocumentGetProps | null;
  authors: Author[];
  is_admin?: boolean;
  read_only?: boolean;
  onReorder: (newOrder: any[]) => void;
  onDelete?: (author: Author) => void;
  onEdit?: (author: Author) => void;
}

export { AuthorsListDragabbleProps };
