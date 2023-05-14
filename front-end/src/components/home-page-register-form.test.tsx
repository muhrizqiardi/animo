import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { faker } from '@faker-js/faker';
import { HomePageRegisterForm } from './home-page-register-form';
import { RegisterNewMessageFormDto } from '@/dtos';
import { useRouter } from 'next/navigation';

const server = setupServer();

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('HomePageRegisterForm', () => {
  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  it('should create POST request to /message-books on back end if inputs are valid after submitting form', async () => {
    // mock router
    const mockPush = jest.fn();
    const mockRouter = {
      push: mockPush,
    };
    (useRouter as jest.Mock).mockReturnValue(mockRouter);

    // msw mock API response
    let expectedRequestBody: RegisterNewMessageFormDto = {
      name: faker.person.fullName(),
    };
    let actualRequestBody: object;
    const mockSuccessResponse = {
      success: true,
      message: 'Successfully added a new message book',
      data: {
        id: faker.string.uuid(),
        slug: faker.lorem.slug(),
        name: faker.person.fullName(),
      },
    };
    server.use(
      rest.post('/api/message-books', async (req, res, ctx) => {
        actualRequestBody = await req.json();
        return res(ctx.json(mockSuccessResponse));
      }),
    );

    render(<HomePageRegisterForm />);

    const nameInputElement = screen.getByLabelText(/name/i);
    const registerButtonElement = screen.getByText(/register/i);

    fireEvent.change(nameInputElement, {
      target: {
        value: expectedRequestBody.name,
      },
    });
    fireEvent.click(registerButtonElement);
    await waitFor(() => expect(registerButtonElement).toBeDisabled());
    await waitFor(() => expect(nameInputElement).toBeDisabled());

    await waitFor(() => expect(actualRequestBody).toEqual(expectedRequestBody));
    expect(mockPush).toHaveBeenCalledWith(`/${mockSuccessResponse.data.slug}`);
  });

  it('should show error message if POST request failed', async () => {
    server.use(
      rest.post('/api/message-books', (_, res, ctx) =>
        res(
          ctx.status(500),
          ctx.json({
            success: false,
            message: 'Failed to create new message book',
          }),
        ),
      ),
    );

    render(<HomePageRegisterForm />);

    const nameInputElement = screen.getByLabelText(/name/i);
    const registerButtonElement = screen.getByText(/register/i);

    fireEvent.change(nameInputElement, {
      target: {
        value: faker.person.fullName(),
      },
    });
    fireEvent.click(registerButtonElement);

    await screen.findByText(/failed to create new message book/i);
  });
});
