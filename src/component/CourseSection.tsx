import LessonSection from "../entities/LessonSection";
import useContentStore from "../store";

interface Props {
  sections: LessonSection[];
  onSelectContent: (section: string, resource: string) => void;
}

const CourseSection = ({ sections, onSelectContent }: Props) => {
  const {
    content: { activeContent, activeSection },
  } = useContentStore();

  if (!sections) return;

  return (
    <>
      {sections.map((section) => (
        <div className="collapse bg-base-200 rounded-none " key={section.name}>
          <input type="checkbox" defaultChecked />
          <div className="collapse-title text-sm">{section.name}</div>
          <div className="collapse-content">
            {section.contents.map((v) => (
              <div
                key={section.name + "-" + v.name}
                className="flex justify-center items-center"
              >
                <input
                  type="checkbox"
                  checked={v.completed}
                  className="checkbox checkbox-primary pointer-events-none mr-1"
                  disabled
                />

                <button
                  onClick={() => {
                    onSelectContent(section.name, v.name);
                  }}
                  className={[
                    "btn my-1 w-full rounded-none text-sm text-left inline",
                    `${
                      activeContent == v.name && activeSection == section.name
                        ? "btn-primary"
                        : "btn-neutral"
                    }`,
                  ].join(" ")}
                >
                  {v.name}
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </>
  );
};

export default CourseSection;
