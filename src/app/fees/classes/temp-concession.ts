import { Concession } from '../../classes/concession';

export class TempConcession extends Concession {

    studentName: string;
    className: string;
    scholarNumber: string;

    copy(concession: TempConcession) {
        super.copy(concession);
        this.studentName = concession.studentName;
        this.className = concession.className;
    }

}