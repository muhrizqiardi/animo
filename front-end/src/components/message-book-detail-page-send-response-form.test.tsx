import { CreateResponseDto } from '@/dtos';
import { faker } from '@faker-js/faker';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { MessageBookDetailPageSendResponseForm } from './message-book-detail-page-send-response-form';

const server = setupServer();

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('MessageBookDetailPageSendResponseForm', () => {
  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  it('should hit POST /api/responses and show success prompt when form is submitted and inputs are valid', async () => {
    let expectedRequestBody: CreateResponseDto = {
      content: faker.person.fullName(),
    };
    let actualRequestBody: object;
    const mockSuccessResponse = {
      success: true,
      message: 'Successfully added a new message book',
      data: {
        id: faker.string.uuid(),
        messageBookId: faker.lorem.slug(),
        content: faker.lorem.paragraph(),
      },
    };
    server.use(
      rest.post('/api/responses', async (req, res, ctx) => {
        actualRequestBody = await req.json();
        return res(ctx.json(mockSuccessResponse));
      }),
    );

    render(<MessageBookDetailPageSendResponseForm />);

    const contentTextareaElement = screen.getByLabelText(/content/i);
    const sendButtonElement = screen.getByText(/send/i);

    fireEvent.change(contentTextareaElement, {
      target: {
        value: expectedRequestBody.content,
      },
    });
    fireEvent.click(sendButtonElement);
    await waitFor(() => expect(sendButtonElement).toBeDisabled());
    await waitFor(() => expect(contentTextareaElement).toBeDisabled());
    await waitFor(() => expect(actualRequestBody).toEqual(expectedRequestBody));
    await screen.findByText(/your message has been sent/i);
  });
  it.todo('should show error message if POST request failed');
});
