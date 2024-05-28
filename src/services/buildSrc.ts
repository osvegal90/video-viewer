const buildSrc = (courseName: string, section: string, content: string) => {
  return `src/assets/${courseName}/${section}/${content}`;
};

export default buildSrc;
