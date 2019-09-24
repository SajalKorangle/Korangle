
import {GenerateFinalReportComponent} from './generate-final-report.component';
import {ATTENDANCE_STATUS_LIST} from '../../../../attendance/classes/constants';

export class GenerateFinalReportServiceAdapter {

    vm: GenerateFinalReportComponent;

    constructor() {}

    // Data
    classList: any;
    sectionList: any;

    initializeAdapter(vm: GenerateFinalReportComponent): void {
        this.vm = vm;
    }

    copyObject(object: any): any {
        let tempObject = {};
        Object.keys(object).forEach(key => {
            tempObject[key] = object[key];
        });
        return tempObject;
    }

    initializeData(): void {

        this.vm.isLoading = true;

        let report_card_mapping_data = {
            'parentSchool': this.vm.user.activeSchool.dbId,
            'parentSession': this.vm.user.activeSchool.currentSessionDbId,
        };

        let student_section_data = {
            'parentStudent__parentTransferCertificate': 'null__korangle',
            'parentStudent__parentSchool': this.vm.user.activeSchool.dbId,
            'parentSession': this.vm.user.activeSchool.currentSessionDbId,
        };

        Promise.all([
            this.vm.reportCardCbseService.getObjectList(this.vm.reportCardCbseService.report_card_mapping, report_card_mapping_data),
            this.vm.studentService.getObjectList(this.vm.studentService.student_section, student_section_data),
            this.vm.classService.getObjectList(this.vm.classService.classs, ''),
            this.vm.classService.getObjectList(this.vm.classService.division, ''),
        ]).then(value => {

            if (value[0].length > 0 || value[1].length > 0) {

                this.vm.reportCardMappingList = value[0];
                this.vm.studentSectionList = value[1];

                let student_data = {
                    'id__in': this.vm.studentSectionList.map(a => a.parentStudent),
                };

                Promise.all([
                    this.vm.studentService.getObjectList(this.vm.studentService.student, student_data),
                ]).then(value2 => {

                    let examination_data = this.getExaminationIdList();

                    Promise.all([
                        this.vm.reportCardCbseService.getObjectList(this.vm.reportCardCbseService.term, ''),
                        this.vm.reportCardCbseService.getObjectList(this.vm.reportCardCbseService.extra_field, ''),
                        this.vm.examinationService.getObjectList(this.vm.examinationService.examination, examination_data),
                        this.vm.subjectService.getObjectList(this.vm.subjectService.subject, {}),
                    ]).then(value3 => {

                        this.vm.termList = value3[0];
                        this.vm.extraFieldList = value3[1];
                        this.vm.examinationList = value3[2];
                        this.vm.subjectList = value3[3];

                    });

                    this.vm.studentSectionList.forEach(studentSection => {
                        studentSection['student'] = value2[0].find(student => {
                            return student.id == studentSection.parentStudent;
                        });
                        studentSection['selected'] = false;
                    });

                    this.vm.isLoading = false;
                }, error => {
                    this.vm.isLoading = false;
                });

                /*this.vm.classSectionList = value[2].filter(classs => {
                    classs['sectionList'] = value[3].filter(section => {
                        return this.vm.studentSectionList.find(studentSection => {
                            return studentSection.parentClass == classs.id
                                && studentSection.parentDivision == section.id;
                        }) != undefined;
                    });
                    return classs['sectionList'].length > 0;
                });*/

                this.vm.classSectionList = [];
                value[2].filter(classs => {
                    value[3].filter(section => {
                        if (this.vm.studentSectionList.find(studentSection => {
                                return studentSection.parentClass == classs.id
                                    && studentSection.parentDivision == section.id;
                            }) != undefined) {
                            this.vm.classSectionList.push({
                                'class': classs,
                                'section': section,
                                'selected': false,
                            });
                        }
                    });
                });

            } else {
                this.vm.isLoading = false;
            }

        }, error => {
            this.vm.isLoading = false;
        });

    }

    getExaminationIdList(): any {
        let id_list = [];
        this.vm.reportCardMappingList.forEach(reportCardMapping => {
            id_list.push(reportCardMapping.parentExaminationPeriodicTest);
            id_list.push(reportCardMapping.parentExaminationNoteBook);
            id_list.push(reportCardMapping.parentExaminationSubEnrichment);
            id_list.push(reportCardMapping.parentExaminationFinalTerm);
        });
        return [new Set(id_list)].join(',');
    }

    getStudentFinalReport(): void {
        alert('Functionality yet to be implemented');
    }

}
