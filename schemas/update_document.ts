import * as zod from 'zod';

export const KeyWordSchema = zod.object({
  id: zod.string().min(3, 'Id must be at least 3 characters.'),
  name: zod.string().min(3, 'Name must be at least 3 characters.'),
});

export const FileSchema = zod.object({
  path: zod.string().min(3, 'Path must be at least 3 characters.'),
  name: zod.string().min(3, 'Name must be at least 3 characters.'),
  lastModified: zod.number(),
  lastModifiedDate: zod.date(),
  size: zod.number(),
  type: zod.string().min(3, 'Type must be at least 3 characters.'),
  preview: zod.string().min(3, 'Preview must be at least 3 characters.'),
});

export const AuthorSchema = zod.object({
  name: zod.string({ required_error: 'Name is required' }),
  email: zod.string({ required_error: 'Email is required' }).email(),
  title: zod.string({ required_error: 'Title is required' }),
  revenuePercent: zod.string().optional(),
  walletAddress: zod.string().optional(),
});

export const UpdateDocumentSchema = zod.object({
  title: zod.string().optional(),
  abstract: zod.string().optional(),
  abstractChart: zod.string().optional(),
  field: zod.string().optional(),
  documentType: zod.string().optional(),
  keywords: zod.array(KeyWordSchema).optional(),
  accessType: zod.enum(['FREE', 'PAID']).optional(),
  price: zod.string().optional(),
  file: zod.array(FileSchema).optional(),
  cover: FileSchema.optional(),
  authors: zod.array(AuthorSchema).optional(),
  category: zod.string({ required_error: 'Category type is required' }),
});

/**
 * @title Update Document Props
 * @dev This type is used to infer the type of the form data.
 */
export type UpdateDocumentProps = zod.infer<typeof UpdateDocumentSchema>;

export type AuthorProps = zod.infer<typeof AuthorSchema>;
