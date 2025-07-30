import { MembersDTO } from "@/schemas/create_new_journal";

interface MembersListDragabbleProps {
  members: MembersDTO[];
  is_admin?: boolean;
  onReorder: (newOrder: MembersDTO[]) => void;
  onDelete?: (member: MembersDTO) => void;
  onEdit?: (member: MembersDTO) => void;
}
export { MembersListDragabbleProps };
