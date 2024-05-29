interface Props {
  src: string;
  onVideoEnd: () => void;
}

const ContentPlayer = ({ src, onVideoEnd }: Props) => {
  if (src.includes(".pdf"))
    return (
      <embed src={src} width="100%" height="100%" type="application/pdf" />
    );

  return (
    <video width="100%" controls src={src} autoPlay onEnded={onVideoEnd} />
  );
};

export default ContentPlayer;
