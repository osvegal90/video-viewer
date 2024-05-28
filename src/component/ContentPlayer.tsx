interface Props {
  src: string;
}

const ContentPlayer = ({ src }: Props) => {
  if (src.includes(".pdf"))
    return (
      <embed src={src} width="100%" height="100%" type="application/pdf" />
    );

  return <video width="100%" controls src={src} />;
};

export default ContentPlayer;
