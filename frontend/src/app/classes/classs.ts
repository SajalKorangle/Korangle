import { Student } from './student';
import { Section } from './section';

export class Classs {
    dbId: number;
    name: string;
    sectionList: Section[] = [];
    studentList: Student[] = [];
}
