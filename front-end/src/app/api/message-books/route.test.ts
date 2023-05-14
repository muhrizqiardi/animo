import { POST } from './route';
import { faker } from '@faker-js/faker';
import { RegisterNewMessageFormDto } from '@/dtos';
import { rest } from 'msw';
import { waitFor } from '@testing-library/react';
import { MessageBookEntity } from '@/entities';
import { setupServer } from 'msw/node';

const server = setupServer();

describe('POST /api/message-books', () => {
  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  it('should hit POST /message-books on backend and create response with received response', async () => {
    // define entity to be created
    const mockMessageBook: MessageBookEntity = {
      id: faker.string.uuid(),
      slug: faker.lorem.slug(),
      name: faker.person.fullName(),
    };

    // create the mock request object coming from client side
    const mockIncomingRequestBody: RegisterNewMessageFormDto = {
      name: mockMessageBook.name,
    };
    const mockIncomingRequest = new Request('/message-books', {
      body: JSON.stringify(mockIncomingRequestBody),
      method: 'POST',
    });

    // create the mock of outgoing request object to back end
    let expectedOutgoingRequestBody: RegisterNewMessageFormDto = {
      name: mockMessageBook.name,
    };
    let actualOutgoingRequestBody: object;

    // create the mock back end
    const mockBackendGeneratedToken = faker.lorem.words();
    const mockBackendSuccessResponse = {
      success: true,
      message: 'Successfully added a new message book',
      data: {
        id: mockMessageBook.id,
        slug: mockMessageBook.slug,
        name: mockMessageBook.name,
        token: mockBackendGeneratedToken,
      },
    };
    server.use(
      rest.post('*/message-books', async (req, res, ctx) => {
        actualOutgoingRequestBody = await req.json();
        return res(ctx.json(mockBackendSuccessResponse));
      }),
    );

    // set the expected response that will be returned from API to client side
    const expectedFrontendResponseBody = {
      success: true,
      message: 'Successfully added a new message book',
      data: {
        id: mockMessageBook.id,
        slug: mockMessageBook.slug,
        name: mockMessageBook.name,
      },
    };
    const expectedFrontendResponse = new Response(
      JSON.stringify(expectedFrontendResponseBody),
      {
        status: 201,
        headers: {
          'Set-Cookies': `token=${mockBackendGeneratedToken}; HttpOnly`,
        },
      },
    );

    console.log({ mockMessageBook });

    // call the handler
    const actualEndpointResponse = await POST(mockIncomingRequest);

    await waitFor(() =>
      expect(actualOutgoingRequestBody).toEqual(expectedOutgoingRequestBody),
    );
    expect(actualEndpointResponse).toEqual(expectedFrontendResponse);
  });
});
