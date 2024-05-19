import { createContext, Dispatch, SetStateAction } from 'react';

interface WorkoutContextType {
  courseByWorkout: string;
  setCourseByWorkout: Dispatch<SetStateAction<string>>;
}

export const WorkoutContext = createContext<WorkoutContextType>({
  courseByWorkout: '',
  setCourseByWorkout: () => {},
});
