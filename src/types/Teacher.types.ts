export type TeacherType = {
    id: number;
    name: string;
    username: string;
    email: string;
    group: string;
  };
  
export type TeacherStoreType = {
    loading: boolean;
    teachers: TeacherType[];
    error: any;
    getTeachers: () => void;
  };
  
export type TeacherInfo = {
    name: string;
    username: string;
    email: string;
    group: string;
  };
  