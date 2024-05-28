const buildSrc = (courseName: string, section: string, content: string) => {
  return `src/assets/courses/${courseName}/${section}/${content}`;
};

export default buildSrc;
