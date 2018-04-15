import { Student } from '../../classes/student';

export class StudentExtended extends Student {

    currentClassName: string;
    currentSectionName: string;

    copy(student: any) {
        super.copy(student);
    }

}