import { uniqueId } from 'lodash'
import * as zod from 'zod'

export const KeyWordSchema = zod.object({
   id: zod.string().min(1, 'Id must be at least 3 characters.'),
   name: zod.string().min(1, 'Name must be at least 3 characters.')
})

export const FileSchema = zod.object({
   path: zod.string().min(3, 'Path must be at least 3 characters.'),
   name: zod.string().min(3, 'Name must be at least 3 characters.'),
   lastModified: zod.number().optional().nullable(),
   lastModifiedDate: zod.date().optional().nullable(),
   size: zod.number(),
   type: zod.string().min(3, 'Type must be at least 3 characters.'),
   preview: zod.string().min(3, 'Preview must be at least 3 characters.')
})

export const AuthorSchema = zod.object({
   id: zod
      .string()
      .min(3, 'Id must be at least 3 characters.')
      .default(uniqueId('author_' + Date.now() + '_' + Math.random())),
   name: zod.string({ required_error: 'Name is required' }),
   email: zod.string({ required_error: 'Email is required' }).email(),
   title: zod.string({ required_error: 'Title is required' }),
   revenuePercent: zod.string().optional(),
   walletAddress: zod.string().optional()
})

export const CreateDocumentSchema = zod.object({
   title: zod.string().min(3, 'Title must be at least 3 characters.'),
   abstract: zod.string().optional(),
   abstractChart: zod.string().optional(),
   field: zod.string().min(3, 'Field must be at least 3 characters.'),
   documentType: zod.string().min(3, 'Document type must be at least 3 characters.'),
   keywords: zod.array(KeyWordSchema).min(1, 'At least one keyword is required.'),
   accessType: zod.enum(['FREE', 'PAID'], { required_error: 'Access type is required.' }),
   price: zod.string(),
   file: FileSchema,
   cover: FileSchema,
   authors: zod.array(AuthorSchema).min(1, 'At least one author is required.'),
   category: zod.string({ required_error: 'Category type is required' })
})

/**
 * @title Create Document Props
 * @dev This type is used to infer the type of the form data.
 */
export type CreateDocumentProps = zod.infer<typeof CreateDocumentSchema>

export type AuthorProps = zod.infer<typeof AuthorSchema>
