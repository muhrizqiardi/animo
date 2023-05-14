import * as z from 'zod';

export const createNewMessageBookResponseSchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
  token: z.string(),
});
export interface CreateNewMessageBookResponse
  extends z.infer<typeof createNewMessageBookResponseSchema> {}
