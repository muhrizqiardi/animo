import * as z from 'zod';

export const messageBookEntitySchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
});
export interface MessageBookEntity
  extends z.infer<typeof messageBookEntitySchema> {}
