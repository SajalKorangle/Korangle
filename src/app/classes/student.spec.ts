
import { Student } from './student';

describe( 'copy' , () => {

    it('should copy student\'s name information', () => {

        let student = {
            name: 'dummy',
            dbId: 12,
            fathersName: 'Dummy',
            mobileNumber: 1223,
            dateOfBirth: '2018-01-01',
            rollNumber: '123',
            scholarNumber: '123',
            totalFees: 123,
            feesDue: 123,
            sectionDbId: 11,
            remark: 'okay',
            motherName: 'mother',
            gender: 'male',
            caste: 'SC',
            category: 'goyal',
            religion: 'Hinduism',
            fatherOccupation: 'farmer',
            address: 'Hadlay, Akodia',
            childSSMID: 123123123,
            familySSMID: 12341234,
            bankName: 'SBI',
            bankAccountNum: 'SBI000023435242234',
            aadharNum: 123412341234,
            bloodGroup: 'O +',
            fatherAnnualIncome: '1.5 lacs',
        };

        const tempStudent = new Student();
        tempStudent.copy(student);

        expect(tempStudent.name).toBe(student.name);
        expect(tempStudent.dbId).toBe(student.dbId);
        expect(tempStudent.fathersName).toBe(student.fathersName);
        expect(tempStudent.mobileNumber).toBe(student.mobileNumber);
        expect(tempStudent.dateOfBirth).toBe(student.dateOfBirth);
        expect(tempStudent.rollNumber).toBe(student.rollNumber);
        expect(tempStudent.scholarNumber).toBe(student.scholarNumber);
        expect(tempStudent.sectionDbId).toBe(student.sectionDbId);
        expect(tempStudent.remark).toBe(student.remark);
        expect(tempStudent.motherName).toBe(student.motherName);
        expect(tempStudent.gender).toBe(student.gender);
        expect(tempStudent.caste).toBe(student.caste);
        expect(tempStudent.category).toBe(student.category);
        expect(tempStudent.religion).toBe(student.religion);
        expect(tempStudent.fatherOccupation).toBe(student.fatherOccupation);
        expect(tempStudent.address).toBe(student.address);
        expect(tempStudent.childSSMID).toBe(student.childSSMID);
        expect(tempStudent.familySSMID).toBe(student.familySSMID);
        expect(tempStudent.bankName).toBe(student.bankName);
        expect(tempStudent.bankAccountNum).toBe(student.bankAccountNum);
        expect(tempStudent.aadharNum).toBe(student.aadharNum);
        expect(tempStudent.bloodGroup).toBe(student.bloodGroup);
        expect(tempStudent.fatherAnnualIncome).toBe(student.fatherAnnualIncome);

    });

});
