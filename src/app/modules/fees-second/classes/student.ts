import { Student } from '../../../classes/student';

// import { TempFee } from './temp-fee';
// import { TempConcession } from './temp-concession';

export class StudentExtended extends Student {

    currentClassName: string;
    currentSectionName: string;

    // feesList: TempFee[] = [];
    // concessionList: TempConcession[] = [];

    copy(student: any) {

        super.copy(student);

        this.currentClassName = student.currentClassName;
        this.currentSectionName = student.currentSectionName;

        // this.feesList = [];
        // this.concessionList = [];

        /*if (student.feesList) {
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
        }*/

    }

}