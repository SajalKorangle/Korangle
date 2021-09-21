import {TCService} from '@services/modules/tc/tc.service';
import {StudentService} from '@services/modules/student/student.service';

export async function getValidStudentSectionList(tcService: TCService, studentService: StudentService, studentSectionData: any) {
    let studentSectionList = await studentService.getObjectList(studentService.student_section, studentSectionData);
    let student_tc_data = {
        parentStudent__in: studentSectionList.map(studentSection => studentSection.parentStudent).join(','),
        parentSession: studentSectionData.parentSession,
        status__in: ['Generated', 'Issued'].join(','),
        fields__korangle: 'id,parentStudent,status'
    };

    const tc_generated_student_list = await tcService.getObjectList(tcService.transfer_certificate, student_tc_data);
    studentSectionList = studentSectionList.filter(student_section => {
        return tc_generated_student_list.find(tc => tc.parentStudent == student_section.parentStudent) == undefined;
    });
    return studentSectionList;
}