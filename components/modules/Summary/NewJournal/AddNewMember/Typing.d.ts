import { MembersDTO } from "@/schemas/create_new_journal";

interface AddNewMemberProps {
  onClose: () => void;
  onAddMember?: (member: MembersDTO) => void;
  onUpdateMember?: (member: MembersDTO) => void;
  onEditMember?: MembersDTO;
}

export { AddNewMemberProps };
