import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { faker } from '@faker-js/faker';
import { HomePageRegisterForm } from './home-page-register-form';

const server = setupServer(
  rest.post('/message-books', (_req, res, ctx) =>
    res(
      ctx.json({
        success: true,
        message: 'Successfully added a new message book',
        data: {
          id: faker.string.uuid(),
          slug: faker.lorem.slug(),
          fullName: faker.person.fullName(),
        },
      }),
    ),
  ),
);

describe('HomePageRegisterForm', () => {
  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  it('should create POST request to /message-books on back end if inputs are valid after submitting form', async () => {
    let expectedRequestBody = {
      name: faker.person.fullName(),
    };
    let actualRequestBody: object;

    server.use(
      rest.post('/api/message-books', (_, res, ctx) =>
        res(
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
    expect(registerButtonElement).toBeDisabled();
    expect(nameInputElement).toBeDisabled();

    await waitFor(() => expect(actualRequestBody).toEqual(expectedRequestBody));
  });

  it('should show error message if POST request failed', async () => {
    server.use(
      rest.post('/api/message-books', (_, res, ctx) =>
        res(
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
