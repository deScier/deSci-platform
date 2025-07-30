import * as zod from 'zod';
/**
 * @title Update Invite Status Zod Schema
 * @dev This schema is used to validate the Update Invite Status form and infer the type of the form data.
 */
export const UpdateInviteStatusSchema = zod.object({
  inviteCode: zod.string({ required_error: 'Invite code is required' }),
  inviteStatus: zod.enum(['ACCEPTED', 'REJECTED']),
  role: zod.string(),
  title: zod.string({ required_error: 'Title is required' }),
});

/**
 * @title Update Invite Status Props
 * @dev This type is used to infer the type of the form data.
 */
export type UpdateInviteStatusProps = zod.infer<typeof UpdateInviteStatusSchema>;
