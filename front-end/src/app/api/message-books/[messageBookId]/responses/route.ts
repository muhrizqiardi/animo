import { createResponseDtoSchema } from '@/dtos';
import { createNewResponseResponseSchema } from '@/response-objects/back-end';
import { env } from '@/utils/env';
import * as z from 'zod';

export async function POST(
  request: Request,
  params: { params: { messageBookId: string } },
) {
  try {
    const incomingRequestBody = await request.json();
    const parsedRequestBody =
      createResponseDtoSchema.parse(incomingRequestBody);

    const backendResponse = await fetch(
      `${env.BACKEND_API_URL}/message-books/${params.params.messageBookId}/responses`,
      {
        method: 'POST',
        body: JSON.stringify(parsedRequestBody),
      },
    );
    const backendResponseBody = await backendResponse.json();
    const parsedBackendResponseBody = z
      .object({
        success: z.boolean(),
        message: z.string(),
        data: createNewResponseResponseSchema,
      })
      .parse(backendResponseBody);

    const frontendResponseBody = {
      success: true,
      message: 'Successfully created new response',
      data: parsedBackendResponseBody.data,
    };
    return new Response(JSON.stringify(frontendResponseBody), { status: 201 });
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Failed to create new response',
      }),
      {
        status: 500,
      },
    );
  }
}
