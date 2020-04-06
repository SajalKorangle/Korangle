
import {Student} from '../../../classes/student';

class Result {
    testDbId: number;
    subjectDbId: number;
    maximumMarksAllowedDbId: number;
    marksObtained: number;
}

export class StudentTest extends Student {

    className: string;
    classDbId: number;
    sectionName: string;
    sectionDbId: number;
    showSectionName = false;

    showScholarNumber = false;

    resultList: Result[];
    attendance: number;

    copyTest(studentTest: any) {
        this.className = studentTest.className;
        this.classDbId = studentTest.classDbId;
        this.sectionName = studentTest.sectionName;
        this.sectionDbId = studentTest.sectionDbId;
        this.scholarNumber = studentTest.scholarNumber;
        this.resultList = studentTest.resultList;
        this.attendance = studentTest.attendance;
        this.showScholarNumber = studentTest.showScholarNumber;
    }

}