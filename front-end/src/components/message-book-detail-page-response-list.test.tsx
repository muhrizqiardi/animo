import { ResponseEntity } from '@/entities';
import { faker } from '@faker-js/faker';
import { render, screen } from '@testing-library/react';
import { MessageBookDetailPageResponseList } from './message-book-detail-page-response-list';

describe('MessageBookDetailPageResponseList', () => {
  it('should list every response', async () => {
    let mockResponseList = Array(0)
      .fill(null)
      .map<ResponseEntity>(() => ({
        id: faker.string.uuid(),
        content: faker.lorem.paragraph(),
        messageBookId: faker.string.uuid(),
      }));

    render(
      <>
        {/* @ts-expect-error Async Server Component */}
        <MessageBookDetailPageResponseList responseList={mockResponseList} />
      </>,
    );

    const responseListElements = screen.queryAllByRole('paragraph');
    mockResponseList.forEach(async (responseItem, index) => {
      expect(responseListElements[index]).toHaveTextContent(
        responseItem.content,
      );
    });
  });
});
