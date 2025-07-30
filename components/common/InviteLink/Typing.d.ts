import { DocumentGetProps } from "@/services/document/getArticles";

interface InviteLinkProps {
  article: DocumentGetProps | null;
  open_status: boolean;
  onClick: () => void;
}

export { InviteLinkProps };
