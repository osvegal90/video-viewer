import useContentStore from "../store";

interface Props {
  onNextContent: () => void;
  onPreviousContent: () => void;
}

const CourseControls = ({ onNextContent, onPreviousContent }: Props) => {
  const { content } = useContentStore();

  return (
    <>
      <button
        onClick={onPreviousContent}
        className="btn btn-secondary mr-2"
        disabled={!content.previousContent}
      >
        Previous Lesson
      </button>
      <button
        onClick={onNextContent}
        className="btn btn-accent"
        disabled={!content.nextSection}
      >
        Complete | Next Lesson
      </button>
    </>
  );
};

export default CourseControls;
