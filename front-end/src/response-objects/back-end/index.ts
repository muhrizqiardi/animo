import * as z from 'zod';

export const createNewMessageBookResponseSchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
  token: z.string(),
});
export interface CreateNewMessageBookResponse
  extends z.infer<typeof createNewMessageBookResponseSchema> {}

export const createNewResponseResponseSchema = z.object({
  id: z.string(),
  content: z.string(),
  messageBookId: z.string(),
});
export interface CreateNewResponseResponse
  extends z.infer<typeof createNewResponseResponseSchema> {}
