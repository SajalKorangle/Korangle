
import { getApiStructure, getVersionStructure, getModelStructure } from '@mock-api/apps/common-functions';

import { STUDENT_APP } from '@urls/student.url';
import { STUDENT_BASE_MODEL } from '@mock-data/apps/student/student.model';

export let STUDENT_API = getApiStructure(STUDENT_APP.url + STUDENT_APP.model_url.student);

function getStudentModelStructure(object): any {
    return getModelStructure(STUDENT_BASE_MODEL, object);
}

// Version 1
STUDENT_API.version_list.push(
    getVersionStructure(
        {[STUDENT_API.url]: 1},
        [getStudentModelStructure({
                id : 1,
                name : 'Mahima Surana',
                fathersName:  'Sunil Surana',
                mobileNumber: '9874852136',
                scholarNumber : '139',
                dateOfBirth : '2009-09-18',
                remark : '',
                motherName : 'Mamta Surana',
                gender : 'Female',
                caste : 'Surana',
                newCategoryField : 'ST',
                newReligionFeild : 'Hinduism',
                fatherOccupation : '',
                address : '',
                familySSMID : '',
                childSSMID : '',
                bankName : '',
                bankAccountNum : '',
                aadharNum : '777444446447',
                bloodGroup : 'AB -',
                fatherAnnualIncome : '',
                currentBusStop : '828',
                admissionSession : 2,
                parentSchool : 1,
                parentTransferCertificate : '',
                profileImage : '',
                dateOfAdmission : '2019-05-19',
                bankIfscCode : '',
                secondMobileNumber:  '0',
                rte : ''
            }), getStudentModelStructure({
                id : 2,
                name : 'Manoj Kushwah',
                fathersName:  'Raju Kushwah',
                mobileNumber: '9874852136',
                scholarNumber : '103',
                dateOfBirth : '1993-11-15',
                remark : '',
                motherName : 'Radha Kushwah',
                gender : 'Male',
                caste : 'Kushwah',
                newCategoryField : 'ST',
                newReligionFeild : 'Hinduism',
                fatherOccupation : '',
                address : '',
                familySSMID : '',
                childSSMID : '',
                bankName : 'SBI',
                bankAccountNum : '',
                aadharNum : '',
                bloodGroup : 'A -',
                fatherAnnualIncome : '',
                currentBusStop : '828',
                admissionSession : 2,
                parentSchool : 1,
                parentTransferCertificate : '',
                profileImage : '',
                dateOfAdmission : '2018-04-18',
                bankIfscCode : '',
                secondMobileNumber:  '0',
                rte : ''
            })]
    )
);
