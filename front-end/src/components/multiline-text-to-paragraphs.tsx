interface MultilineTextToParagraphsProps {
  text: string;
}

export function MultilineTextToParagraphs(
  props: MultilineTextToParagraphsProps,
) {
  return (
    <>
      {props.text.split('\n\n').map((paragraph, index) => (
        <p key={index}>{paragraph}</p>
      ))}
    </>
  );
}
