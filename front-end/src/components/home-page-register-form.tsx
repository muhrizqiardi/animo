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
      if (!response.ok) throw new Error(responseBody.message);
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
        setIsError(true);
        setErrorMessage(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

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
