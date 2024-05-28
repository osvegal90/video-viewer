import useContentStore from "../store";

interface Props {
  onNext: () => void;
  onPrevious: () => void;
}

const CourseControls = ({ onNext, onPrevious }: Props) => {
  const { content } = useContentStore();

  return (
    <>
      <button
        onClick={onPrevious}
        className="btn btn-secondary mr-2"
        disabled={!content.previousContent}
      >
        Previous Lesson
      </button>
      <button
        onClick={onNext}
        className="btn btn-accent"
        disabled={!content.nextSection}
      >
        Complete | Next Lesson
      </button>
    </>
  );
};

export default CourseControls;
