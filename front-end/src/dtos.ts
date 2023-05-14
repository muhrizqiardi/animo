import * as z from 'zod';

export const registerNewMessageFormDtoSchema = z.object({
  name: z.string(),
});
export interface RegisterNewMessageFormDto
  extends z.infer<typeof registerNewMessageFormDtoSchema> {}

export const createResponseDtoSchema = z.object({
  content: z.string(),
});
export interface CreateResponseDto
  extends z.infer<typeof createResponseDtoSchema> {}
