import { Student } from './student';

export class Section {
    dbId: number;
    name: string;
    studentList: Student[] = [];
}