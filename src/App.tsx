import "./App.css";
import CourseSection from "./component/CourseSection";
import ContentPlayer from "./component/ContentPlayer";
import { useEffect, useState } from "react";
//import courseStructure from "./assets/course_nextjs_1/structure.json";
import courseStructure from "./assets/course_nextjs_2/structure.json";

import useContentStore from "./store";
import LessonSection from "./entities/LessonSection";
import buildSrc from "./services/buildSrc";
import CourseControls from "./component/CourseControls";

function App() {
  const { content, setContent } = useContentStore();
  const [sections, setSections] = useState<LessonSection[] | undefined>();
  const [totalCourses, setTotalCourses] = useState<number>(0);
  const [complete, setComplete] = useState<number>(0);

  const calculateCompletedCourses = (courses: LessonSection[]) => {
    const completedCourses = courses.reduce((acc, current) => {
      const completedCourses = current.contents.filter(
        (c) => c.completed == true
      );
      return acc + completedCourses.length;
    }, 0);

    return completedCourses || 0;
  };

  const onSelectContent = (activeSection: string, activeContent: string) => {
    if (!sections) return;

    // get active section
    const currentSectionIndex = sections.findIndex(
      (s) => s.name == activeSection
    );
    const currentSection = sections[currentSectionIndex];

    if (currentSection && currentSection.contents) {
      const currentVideoIndex = currentSection.contents.findIndex(
        (v) => v.name == activeContent
      );

      //find prev and next sections based on the active section
      const previousContent = currentSection.contents[currentVideoIndex - 1];
      const nextContent = currentSection.contents[currentVideoIndex + 1];

      // fill previous content data
      let previous;
      if (!previousContent) {
        let prevSection = sections[currentSectionIndex - 1];
        if (!prevSection) {
          previous = {
            previousSection: undefined,
            previousContent: undefined,
            previousSrc: undefined,
          };
        } else {
          const content = prevSection.contents[prevSection.contents.length - 1];
          previous = {
            previousSection: prevSection.name,
            previousContent: content.name,
            previousSrc: buildSrc(
              courseStructure.name,
              prevSection.name,
              content.name
            ),
          };
        }
      } else {
        previous = {
          previousSection: currentSection.name,
          previousContent: previousContent.name,
          previousSrc: buildSrc(
            courseStructure.name,
            currentSection.name,
            previousContent.name
          ),
        };
      }

      // fill next content data
      let next;
      if (!nextContent) {
        let nextSection = sections[currentSectionIndex + 1];
        if (!nextSection) {
          next = {
            nextSection: undefined,
            nextContent: undefined,
            nextSrc: undefined,
          };
        } else {
          const content = nextSection.contents[0];
          next = {
            nextSection: nextSection.name,
            nextContent: content.name,
            nextSrc: buildSrc(
              courseStructure.name,
              nextSection.name,
              content.name
            ),
          };
        }
      } else {
        next = {
          nextSection: currentSection.name,
          nextContent: nextContent.name,
          nextSrc: buildSrc(
            courseStructure.name,
            currentSection.name,
            nextContent.name
          ),
        };
      }

      // update state
      setContent({
        activeSection,
        activeContent,
        activeSrc: buildSrc(courseStructure.name, activeSection, activeContent),
        ...previous,
        ...next,
      });
    }
  };

  const onNext = () => {
    //Logic to save the completed:true
    if (sections) {
      const currentSectionIndex = sections?.findIndex(
        (s) => s.name == content.activeSection
      );
      const currentSection = sections[currentSectionIndex];

      let activeContent = currentSection.contents.find(
        (c) => c.name == content.activeContent
      );

      if (activeContent) activeContent.completed = true;

      // update local storage
      localStorage.setItem(courseStructure.name, JSON.stringify(sections));
      setComplete(calculateCompletedCourses(sections));

      if (!content.nextSection || !content.nextContent) return;
      onSelectContent(content.nextSection, content.nextContent);
    }
  };

  const onPrevious = () => {
    if (!content.previousSection || !content.previousContent) return;
    onSelectContent(content.previousSection, content.previousContent);
  };

  useEffect(() => {
    //load content to local storage if not already set
    const local = localStorage.getItem(courseStructure.name);

    // set state if local storage is already set
    if (local && local != null) {
      const allCourses: LessonSection[] = JSON.parse(local);

      // initialize component state
      setSections(allCourses);
      setComplete(calculateCompletedCourses(allCourses));
      setTotalCourses(
        allCourses.reduce((acc, current) => acc + current.contents.length, 0)
      );
      return;
    }

    // set local storage if it haven't been set
    localStorage.setItem(
      courseStructure.name,
      JSON.stringify(courseStructure.sections)
    );
  }, []);

  if (!sections) return;

  return (
    <div className="layout">
      <div className="layout-course-completion flex justify-center items-center">
        <h2>{Math.round((complete / totalCourses) * 100) + "% Completed"}</h2>
      </div>
      <div className="layout-top-nav bg-base-200 p-1">
        <CourseControls onNext={onNext} onPrevious={onPrevious} />
      </div>
      <div className="layout-side-nav bg-base-200">
        <CourseSection sections={sections} onSelectContent={onSelectContent} />
      </div>
      <div className="layout-video">
        <ContentPlayer video={content?.activeSrc || ""} />
      </div>
    </div>
  );
}

export default App;
