import { Student } from '../../classes/student';
import { TempFee } from './temp-fee';
import { TempConcession } from './temp-concession';

export class TempStudent extends Student {

    className: string;
    sectionName: string;

    feesList: TempFee[] = [];
    concessionList: TempConcession[] = [];

    copy(student: any) {

        super.copy(student);

        this.className = student.className;
        this.sectionName = student.sectionName;

        this.feesList = [];
        this.concessionList = [];

        if (student.feesList) {
            student.feesList.forEach( fees => {
                const tempFees = new TempFee();
                tempFees.copy(fees);
                this.feesList.push(tempFees);
            });
        }

        if (student.concessionList) {
            student.concessionList.forEach( concession => {
                const tempConcession = new TempConcession();
                tempConcession.copy(concession);
                this.concessionList.push(tempConcession);
            });
        }

    }

}