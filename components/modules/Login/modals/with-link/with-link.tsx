import { home_routes } from '@/routes/home';
import { UpdateInviteStatusProps } from '@/schemas/update_invite_status';
import { updateInviteStatusService } from '@/services/reviewer/updateInvite.service';
import * as Button from '@components/common/Button/Button';
import * as Input from '@components/common/Input/Input';
import { useRouter } from 'next/navigation';
import React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

/**
 * @title WithLink Component
 * @notice This component provides an interface for responding to an invitation to review or edit an article.
 * It allows the user to accept or decline the invitation and specify their expertise and role.
 * @dev The component uses useForm for form handling and integrates routing with Next.js.
 */
const WithLink: React.FC<WithLinkProps> = ({ article_name, invited_by, inviteCode, onClose }: WithLinkProps) => {
  /** @dev Initialize form handling with default values for invite status and role */
  const { register, handleSubmit, setValue, trigger } = useForm<UpdateInviteStatusProps>({
    defaultValues: {
      inviteCode: inviteCode,
      inviteStatus: 'ACCEPTED',
      role: 'reviewer',
      title: '',
    },
  });

  /** @dev Initialize Next.js router */
  const router = useRouter();

  /** @dev State to manage loading status during form submission */
  const [loading, setLoading] = React.useState(false);

  /**
   * @dev Handles form submission, updates invite status, and navigates user upon success or failure
   * @param data The form data containing invite status, role, and title
   */
  const handleSubmitReview: SubmitHandler<UpdateInviteStatusProps> = async (data) => {
    setLoading(true);
    const response = await updateInviteStatusService(data);
    setLoading(false);

    const hasInviteOnLocalStorage = localStorage.getItem('invite');
    if (hasInviteOnLocalStorage) {
      localStorage.removeItem('invite');
    }

    if (response.success) {
      toast.success(`Invite ${data.inviteStatus} successfully.`);

      onClose();
      router.push(home_routes.as_reviewer);
      return;
    }

    toast.error(response.message);
  };

  /**
   * @dev Handles the action when the user declines the invitation
   */
  const handleDecline = () => {
    const hasInviteOnLocalStorage = localStorage.getItem('invite');
    if (hasInviteOnLocalStorage) {
      localStorage.removeItem('invite');
    }
    onClose();
  };

  return (
    <React.Fragment>
      <form className="grid gap-6" onSubmit={handleSubmit(handleSubmitReview)}>
        <div className="grid gap-2">
          <h3 className="text-xl font-semibold">You were invited to be a Reviewer/ Editor for an article</h3>
          <p className="text-sm">
            <p className="text-sm first-letter:uppercase">{invited_by}</p> has extended a kind invitation for you to
            serve as Reviewer/ Editor for the article entitled{' '}
            <span className="text-sm font-semibold">{article_name}</span> Would this invitation align with your skills
            and expertise?
          </p>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <Input.Root>
            <Input.Label>Your expertise</Input.Label>
            <Input.Input placeholder="Ex: Biologist" {...register('title')} />
          </Input.Root>
          <Input.Root>
            <Input.Label>Role</Input.Label>
            <Input.Select
              options={roles}
              placeholder="Select reviewing role"
              onValueChange={(value) => {
                (setValue('role', value), trigger('role'));
              }}
            />
          </Input.Root>
        </div>
        <div className="grid gap-4">
          <Button.Button className="py-3 px-8" type="submit" loading={loading}>
            Yes, I want to review/ edit!
          </Button.Button>
          <Button.Button variant="outline" className="py-3 px-8" onClick={handleDecline}>
            No, thanks
          </Button.Button>
        </div>
      </form>
    </React.Fragment>
  );
};

/**
 * @dev Props definition for the WithLink component
 * @param invited_by The name of the person who extended the invitation
 * @param article_name The title of the article for review/editing
 * @param inviteCode The unique code for the invitation
 * @param onClose Function to close the component
 */
interface WithLinkProps {
  invited_by: string;
  article_name: string;
  inviteCode: string;
  onClose: () => void;
}

/** @dev Predefined roles for the user to select from */
const roles = [
  {
    id: 1,
    value: 'reviewer',
    label: 'Reviewer',
  },
  {
    id: 2,
    value: 'editor',
    label: 'Editor',
  },
];

export default WithLink;
