'use client';

import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  RegisterNewMessageFormDto,
  registerNewMessageFormDtoSchema,
} from '@/dtos';
import { useState } from 'react';

export function HomePageRegisterForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>();
  const { register, handleSubmit } = useForm<RegisterNewMessageFormDto>({
    resolver: zodResolver(registerNewMessageFormDtoSchema),
  });

  const onSubmit: SubmitHandler<RegisterNewMessageFormDto> = async (data) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/message-books', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      const responseBody = await response.json();
      console.log('response.ok: ', response.ok);
      if (!response.ok) throw new Error(responseBody.message);
    } catch (error) {
      console.log('bebek goreng');
      console.log('error instanceof Error', error instanceof Error);

      if (error instanceof Error) {
        setIsError(true);
        setErrorMessage(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  console.log({ isError });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <label htmlFor="name">Name</label>
      <input
        id="name"
        type="text"
        placeholder="Enter your name here..."
        disabled={isLoading}
        {...register('name')}
      />
      <button type="submit" disabled={isLoading}>
        Register
      </button>
      {isError ? <p>{errorMessage}</p> : null}
    </form>
  );
}
