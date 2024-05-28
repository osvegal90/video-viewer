interface Lesson {
  name: string;
  completed: boolean;
}

export default interface LessonSection {
  name: string;
  contents: Lesson[];
}
