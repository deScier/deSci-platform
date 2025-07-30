import * as z from "zod";
import { FileSchema, KeyWordSchema } from "./create_document";

export const MembersSchema = z.object({
  id: z.string().min(3, "Id must be at least 3 characters."),
  name: z.string({ required_error: "Name is required" }),
  email: z.string({ required_error: "Email is required" }),
  role: z.enum(["EDITOR_IN_CHIEF", "MEMBER", "EDITORIAL_BOARD_MEMBER"], { required_error: "Role is required" }),
});

export const CreateJournalSchema = z.object({
  name: z.string({ required_error: "Name is required" }),
  field: z.string({ required_error: "Field is required" }),
  keywords: z.array(KeyWordSchema).min(1, "At least one keyword is required."),
  rationale: z.string({ required_error: "Rationale is required" }),
  originatesFrom: z
    .string({ required_error: "Originates from is required" })
    .min(2, "Originates from must be at least 2 characters."),
  cover: FileSchema,
  members: z.array(MembersSchema).min(1, "At least one member is required."),
});

export type MembersDTO = z.infer<typeof MembersSchema>;
export type CreateJournalDTO = z.infer<typeof CreateJournalSchema>;
