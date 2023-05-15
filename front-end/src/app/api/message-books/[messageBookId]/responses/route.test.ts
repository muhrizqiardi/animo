import { CreateResponseDto } from '@/dtos';
import { ResponseEntity } from '@/entities';
import { faker } from '@faker-js/faker';
import { POST } from './route';
import { rest } from 'msw';
import { waitFor } from '@testing-library/react';
import { setupServer } from 'msw/node';

const server = setupServer();

describe('POST /api/message-books/:messageBookId/responses', () => {
  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  it('should hit backend POST /message-books/:messageBookId and return the response to client side', async () => {
    const mockResponse: ResponseEntity = {
      id: faker.string.uuid(),
      content: faker.lorem.paragraph(),
      messageBookId: faker.string.uuid(),
    };

    // create the mock request object coming from client side
    const mockIncomingRequestBody: CreateResponseDto = {
      content: mockResponse.content,
    };
    const mockIncomingRequest = new Request(
      `/api/message-books/${mockResponse.messageBookId}/responses`,
      {
        method: 'POST',
        body: JSON.stringify(mockIncomingRequestBody),
      },
    );

    // create the mock of outgoing request object to back end
    let expectedOutgoingRequestBody: CreateResponseDto = {
      content: mockResponse.content,
    };
    let actualOutgoingRequestBody: object;

    // mock the back end
    const mockBackendSuccessResponse = {
      success: true,
      message: 'Successfully created new response',
      data: {
        id: mockResponse.id,
        messageBookId: mockResponse.messageBookId,
        content: mockResponse.content,
      },
    };
    server.use(
      rest.post(
        `*/message-books/${mockResponse.messageBookId}/responses`,
        async (req, res, ctx) => {
          actualOutgoingRequestBody = await req.json();
          return res(ctx.json(mockBackendSuccessResponse));
        },
      ),
    );

    // set the expected response that will be returned from API to client side
    const expectedFrontendResponseBody = {
      success: true,
      message: 'Successfully created new response',
      data: {
        id: mockResponse.id,
        messageBookId: mockResponse.messageBookId,
        content: mockResponse.content,
      },
    };
    const expectedFrontendResponse = new Response(
      JSON.stringify(expectedFrontendResponseBody),
      { status: 201 },
    );

    // call the handler
    const actualEndpointResponse = await POST(mockIncomingRequest, {
      params: { messageBookId: mockResponse.messageBookId },
    });

    await waitFor(() =>
      expect(actualOutgoingRequestBody).toEqual(expectedOutgoingRequestBody),
    );
    expect(await actualEndpointResponse.json()).toEqual(
      await expectedFrontendResponse.json(),
    );
    expect(actualEndpointResponse.status).toEqual(
      expectedFrontendResponse.status,
    );
  });
  it('should respond with error 404 if received error 404 from back end', async () => {});
  it('should respond with error if payload is invalid', async () => {});
});
