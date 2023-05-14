'use client';

import { CreateResponseDto, createResponseDtoSchema } from '@/dtos';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

export function MessageBookDetailPageSendResponseForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>();
  const [messageIsSent, setMessageIsSent] = useState(false);
  const { register, handleSubmit } = useForm<CreateResponseDto>({
    resolver: zodResolver(createResponseDtoSchema),
  });

  const onSubmit: SubmitHandler<CreateResponseDto> = async (data) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/responses', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      const responseBody = await response.json();
      if (!response.ok) throw new Error(responseBody.message);
      setMessageIsSent(true);
    } catch (error) {
      if (error instanceof Error) {
        console.error(error);
        setIsError(true);
        setErrorMessage(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!messageIsSent)
    return (
      <form onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="content">Content</label>
        <textarea id="content" disabled={isLoading} {...register('content')} />
        <button disabled={isLoading}>Send</button>
        {isError ? (
          <p>
            {errorMessage !== undefined
              ? errorMessage
              : 'Failed to send response'}
          </p>
        ) : null}
      </form>
    );

  return <p>Your message has been sent!</p>;
}
