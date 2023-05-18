import { faker } from '@faker-js/faker';
import { render, screen } from '@testing-library/react';
import { MultilineTextToParagraphs } from './multiline-text-to-paragraphs';

describe('MultilineTextToParagraphs', () => {
  const paragraphCount = faker.number.int({ min: 3, max: 5 });
  const paragraphSeparator = '\n\n';
  const exampleMultilineText = Array(paragraphCount)
    .fill(null)
    .map(() => faker.lorem.paragraph());
  const exampleMultilineTextJoined =
    exampleMultilineText.join(paragraphSeparator);

  it('should turn a string with multiple line break characters into multiple paragraph element', async () => {
    render(<MultilineTextToParagraphs text={exampleMultilineTextJoined} />);

    for (let i = 0; i < exampleMultilineText.length - 1; i++) {
      const paragraphElement = screen.getByText(exampleMultilineText[i]);
      const nextParagraphElement = screen.getByText(
        exampleMultilineText[i + 1],
      );

      expect(
        paragraphElement.compareDocumentPosition(nextParagraphElement),
      ).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
    }
  });
});
