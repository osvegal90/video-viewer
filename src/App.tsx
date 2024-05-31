import "./App.css";

import { useEffect, useState } from "react";
import useContentStore from "./store";
//import courseStructure from "./assets/courses/course_react_1/structure.json";
import courseStructure from "./assets/courses/course_nextjs_1/structure.json";
//import courseStructure from "./assets/courses/course_nextjs_2/structure.json";
//import courseStructure from "./assets/courses/course_react_2/structure.json";
import LessonSection from "./entities/LessonSection";
import Content from "./entities/Content";
import CourseControls from "./component/CourseControls";
import CourseSection from "./component/CourseSection";
import ContentPlayer from "./component/ContentPlayer";
import buildSrc from "./services/buildSrc";

function App() {
  const { content, setContent } = useContentStore();
  const [sections, setSections] = useState<LessonSection[] | undefined>();
  const [totalCourses, setTotalCourses] = useState<number>(0);
  const [complete, setComplete] = useState<number>(0);

  const calculateCourseCompletion = (courses: LessonSection[]) => {
    const completedCourses = courses.reduce((acc, current) => {
      const completedCourses = current.contents.filter(
        (c) => c.completed == true
      );
      return acc + completedCourses.length;
    }, 0);

    return completedCourses || 0;
  };

  const handleSelectContent = (
    activeSection: string,
    activeContent: string
  ) => {
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

  const handleNextContent = () => {
    //Logic to save the completed:true
    if (sections) {
      const currentSection = sections?.find(
        (s) => s.name == content.activeSection
      );

      let activeContent = currentSection?.contents.find(
        (c) => c.name == content.activeContent
      );

      // only update local storage if course is not completed
      if (activeContent && activeContent.completed === false) {
        const updatedSections = sections.map((s) => {
          if (s.name !== content.activeSection) return s;
          let completedContent = s.contents.map((c) =>
            c.name !== content.activeContent ? c : { ...c, completed: true }
          );
          return { ...s, contents: completedContent };
        });

        setSections(() => {
          // update local storage
          localStorage.setItem(
            courseStructure.name,
            JSON.stringify(updatedSections)
          );
          setComplete(calculateCourseCompletion(updatedSections));
          return updatedSections;
        });
      }

      if (!content.nextSection || !content.nextContent) return;
      localStorage.setItem(
        `${courseStructure.name}_index`,
        JSON.stringify({ ...content })
      );
      handleSelectContent(content.nextSection, content.nextContent);
    }
  };

  const handlePreviousContent = () => {
    if (!content.previousSection || !content.previousContent) return;
    handleSelectContent(content.previousSection, content.previousContent);
  };

  useEffect(() => {
    //load content to local storage if not already set
    const local = localStorage.getItem(courseStructure.name);
    const index = localStorage.getItem(`${courseStructure.name}_index`);

    // set state if local storage is already set
    if (local && local != null && index && index != null) {
      const allCourses: LessonSection[] = JSON.parse(local);
      const indexContent: Content = JSON.parse(index);

      // initialize component state
      setSections(allCourses);
      setComplete(calculateCourseCompletion(allCourses));
      setTotalCourses(
        allCourses.reduce((acc, current) => acc + current.contents.length, 0)
      );
      setContent(indexContent);

      return;
    }

    // set local storage if it haven't been set
    localStorage.setItem(
      courseStructure.name,
      JSON.stringify(courseStructure.sections)
    );

    //initialize the first video that should run
    localStorage.setItem(
      `${courseStructure.name}_index`,
      JSON.stringify({
        activeSection: courseStructure.sections[0].name,
        activeContent: courseStructure.sections[0].contents[0].name,
        activeSrc: buildSrc(
          courseStructure.name,
          courseStructure.sections[0].name,
          courseStructure.sections[0].contents[0].name
        ),
        nextSection: courseStructure.sections[0].name,
        nextContent: courseStructure.sections[0].contents[1].name,
        nextSrc: buildSrc(
          courseStructure.name,
          courseStructure.sections[0].name,
          courseStructure.sections[0].contents[1].name
        ),
        previousSection: undefined,
        previousContent: undefined,
        previousSrc: undefined,
      })
    );
  }, []);

  if (!sections) return;

  return (
    <div className="layout">
      <div className="layout-course-completion flex justify-center items-center">
        <h2>{Math.round((complete / totalCourses) * 100) + "% Completed"}</h2>
      </div>
      <div className="layout-top-nav bg-base-200 p-1">
        <CourseControls
          onNextContent={handleNextContent}
          onPreviousContent={handlePreviousContent}
        />
      </div>
      <div className="layout-side-nav bg-base-200">
        <CourseSection
          sections={sections}
          onSelectContent={handleSelectContent}
        />
      </div>
      <div className="layout-video">
        <ContentPlayer
          src={content?.activeSrc || ""}
          onVideoEnd={handleNextContent}
        />
      </div>
    </div>
  );
}

export default App;
