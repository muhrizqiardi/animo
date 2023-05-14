import * as z from 'zod';
import { createNewMessageBookResponseSchema } from '@/response-objects/back-end';
import { env } from '@/utils/env';
import { registerNewMessageFormDtoSchema } from '@/dtos';

export async function POST(request: Request) {
  try {
    const incomingRequestBody = await request.json();
    registerNewMessageFormDtoSchema.parse(incomingRequestBody);

    const outgoingRequestBody = {
      name: incomingRequestBody.name,
    };
    const backendResponse = await fetch(
      `${env.BACKEND_API_URL}/message-books`,
      {
        method: 'POST',
        body: JSON.stringify(outgoingRequestBody),
      },
    );
    const backendResponseBody = await backendResponse.json();
    const newMessageBook = z
      .object({
        success: z.boolean(),
        message: z.string(),
        data: createNewMessageBookResponseSchema,
      })
      .parse(backendResponseBody);

    const repsonseBody = JSON.stringify({
      success: true,
      message: 'Successfully added a new message book',
      data: {
        id: newMessageBook.data.id,
        slug: newMessageBook.data.slug,
        name: newMessageBook.data.name,
      },
    });

    return new Response(repsonseBody, {
      status: 201,
      headers: {
        'Set-Cookies': `token=${newMessageBook.data.token}; HttpOnly`,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error(error.flatten());
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Invalid request: property `name` is required',
        }),
      );
    }
  }
}
