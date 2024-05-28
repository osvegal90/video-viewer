interface Props {
  video: string;
}

const ContentPlayer = ({ video }: Props) => {
  if (video.includes(".pdf"))
    return (
      <embed src={video} width="100%" height="100%" type="application/pdf" />
    );

  return <video width="100%" controls src={video} />;
};

export default ContentPlayer;
