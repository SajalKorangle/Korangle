import { Fee } from '../../classes/fee'

export class TempFee extends Fee {

    studentName: string;
    scholarNumber: string;
    fathersName: string;
    className: string;
    sectionName: string;

    copy(fee: TempFee) {
        super.copy(fee);
        this.studentName = fee.studentName;
        this.scholarNumber = fee.scholarNumber;
        this.fathersName = fee.fathersName;
        this.className = fee.className;
        this.sectionName = fee.sectionName;
    }

}