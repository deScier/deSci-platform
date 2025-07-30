import { AuthorProps } from "@/schemas/create_document";

interface NewAuthorProps {
  onClose: () => void;
  onAddAuthor?: (author: AuthorProps) => void;
  onUpdateAuthor?: (author: AuthorProps) => void;
  onEditAuthor?: AuthorProps;
}

export { NewAuthorProps };
