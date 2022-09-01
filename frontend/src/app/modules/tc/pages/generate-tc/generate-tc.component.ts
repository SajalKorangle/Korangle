import { Component, OnInit } from '@angular/core';
import { DataStorage } from '../../../../classes/data-storage';

import { GenerateTCServiceAdapter } from './generate-tc.service.adapter';
import { StudentFee } from './../../../../services/modules/fees/models/student-fee';

import { TCService } from '@services/modules/tc/tc.service';
import { StudentService } from '@services/modules/student/student.service';
import { ClassService } from '@services/modules/class/class.service';
import { SubjectService } from '@services/modules/subject/subject.service';
import { SchoolService } from '@services/modules/school/school.service';
import { AttendanceService } from '@services/modules/attendance/attendance.service';
import { FeeService } from './../../../../services/modules/fees/fee.service';
import { TransferCertificateSettings } from './../../../../services/modules/tc/models/transfer-certificate-settings';
import { SchoolFeeRule } from './../../../../services/modules/fees/models/school-fee-rule';

import { PARAMETER_LIST, DPI_LIST } from './../../class/constants';
import { GenerateTCCanvasAdapter } from './generate-tc.canvas.adapter';

import * as jsPDF from 'jspdf';

@Component({
    selector: 'app-generate-tc',
    templateUrl: './generate-tc.component.html',
    styleUrls: ['./generate-tc.component.css'],
    providers: [TCService, StudentService, ClassService, SubjectService, SchoolService, AttendanceService, FeeService],
})
export class GenerateTCComponent implements OnInit {
    user: any;

    htmlAdapter: any = {
        parameterList: [...PARAMETER_LIST],
    };

    dpiList: number[] = DPI_LIST;

    selectedLayout: {
        id?: any;
        parentSchool: string;
        name: string;
        thumbnail?: string;
        publiclyShared: boolean;
        content: any;
        parentStudentSection?: number;
    };
    tcLayoutList: {
        id?: any;
        parentSchool: string;
        name: string;
        thumbnail?: string;
        publiclyShared: boolean;
        content: any;
        parentStudentSection?: number;
    }[] = [];

    studentList: any[];
    studentSectionList: any[];
    classList: any[];
    divisionList: any[];

    classSectionList: any[] = [];
    filteredStudentSectionList: any[] = [];

    tcSettings: TransferCertificateSettings;
    tcSchoolFeeRule: SchoolFeeRule;
    tcStudentFeeList: Array<StudentFee>;
    generatedTc: any[];

    DATA: {
        studentId: number;
        currentSession: number;
        data: {
            school: any;
            studentList: any[];
            studentSectionList: any[];
            studentParameterList: any[];
            studentParameterValueList: any[];
            classList: any[];
            divisionList: any[];
            subjectList: any[];
            attendanceList: any[];
            sessionList: any[];
            classSectionSignatureList: any[];
        };
        issueDate: string;
        leavingDate: string;
        isLeavingSchoolBecause: string;
        certificateNumber: number;
        lastClassPassed: string;
    } = {
        studentId: null,
        currentSession: null,
        data: {
            school: null,
            studentList: [],
            studentSectionList: [],
            studentParameterList: [],
            studentParameterValueList: [],
            classList: [],
            divisionList: [],
            subjectList: [],
            attendanceList: [],
            sessionList: [],
            classSectionSignatureList: [],
        },
        certificateNumber: -1,
        issueDate: null,
        leavingDate: null,
        isLeavingSchoolBecause: '',
        lastClassPassed: '',
    };

    canvasAdapter: GenerateTCCanvasAdapter;
    serviceAdapter: GenerateTCServiceAdapter;

    generatedTcs: number = 0;
    estimatedTime: any = null;

    isLoading: boolean = false;

    constructor(
        public tcService: TCService,
        public studentService: StudentService,
        public classService: ClassService,
        public subjectService: SubjectService,
        public schoolService: SchoolService,
        public attendanceService: AttendanceService,
        public feeService: FeeService
    ) {}

    ngOnInit() {
        this.user = DataStorage.getInstance().getUser();
        this.DATA.data.school = this.user.activeSchool;

        this.serviceAdapter = new GenerateTCServiceAdapter();
        this.serviceAdapter.initializeAdapter(this);
        this.serviceAdapter.initializeData();

        this.canvasAdapter = new GenerateTCCanvasAdapter();
        this.canvasAdapter.initilizeAdapter(this);
        console.log('comp: ', this);
    }

    populateClassSectionList(classList, divisionList): void {
        this.classSectionList = [];
        classList.forEach((classs) => {
            divisionList.forEach((division) => {
                if (
                    this.studentSectionList.find((studentSection) => {
                        return studentSection.parentClass == classs.id && studentSection.parentDivision == division.id;
                    }) != undefined
                ) {
                    this.classSectionList.push({
                        class: classs,
                        section: division,
                        selected: false,
                    });
                }
            });
        });

        const divisionPerClassCount = {}; // count of divisions in each class
        this.classSectionList.forEach((cs) => {
            if (divisionPerClassCount[cs.class.id]) divisionPerClassCount[cs.class.id] += 1;
            else divisionPerClassCount[cs.class.id] = 1;
        });

        this.classSectionList = this.classSectionList.map((cs) => {
            // showDivision based of division count per class
            if (divisionPerClassCount[cs.class.id] == 1) {
                return { ...cs, showDivision: false };
            } else {
                return { ...cs, showDivision: true };
            }
        });
    }

    populateExtraFieldsFromLayout(): void {
        const parsedData = JSON.parse(this.selectedLayout.content);
        this.DATA = { ...this.DATA, ...parsedData[0].extraFields };
        // console.log('parsed Data.extra fields : ', parsedData[0].extraFields);
    }

    disableStudentsWithTC(tcData): void {
        this.studentSectionList.forEach((ss) => {
            if (tcData.find((tc) => tc.parentStudent == ss.parentStudent)) {
                ss.disabled = true;
            }
            // else undefined which => false
        });
    }

    // selectAllClasses(): void {
    //     this.classSectionList.forEach((classSection) => (classSection.selected = true));
    // }

    unselectAllClasses(): void {
        this.classSectionList.forEach((classSection) => (classSection.selected = false));
    }

    getStudent = (id) => this.studentList.find((x) => x.id === id);
    getClass = (id) => this.classList.find((x) => x.id === id);
    getDivision = (id) => this.divisionList.find((x) => x.id === id);

    handleFilteredStudentSectionList = () => {
        this.filteredStudentSectionList = this.studentSectionList.filter((studentSection) => {
            return this.classSectionList.find((classSection) => {
                return (
                    classSection.selected &&
                    classSection.class.id === studentSection.parentClass &&
                    classSection.section.id === studentSection.parentDivision
                );
            });
        });
    }

    selectAllStudents(): void {
        this.filteredStudentSectionList.forEach((studentSection) => (studentSection.selected = !studentSection.disabled && true));
    }

    clearAllStudents(): void {
        this.filteredStudentSectionList.forEach((studentSection) => (studentSection.selected = false));
    }

    getSelectedStudentList(): any[] {
        return this.filteredStudentSectionList.filter((studentSection) => !studentSection.disabled && studentSection.selected);
    }

    sanityCheck(): boolean {
        if (!this.DATA.issueDate) {
            alert('Issue Date is a compulsary field');
            return false;
        } else if (!this.DATA.leavingDate) {
            alert('Leaving Date is a compulsary field');
            return false;
        } else if (!this.DATA.isLeavingSchoolBecause || this.DATA.isLeavingSchoolBecause == '') {
            alert('Is Leaving School Because is a compulsary field');
            return false;
        }
        return true;
    }

    async generateTC() {
        if (!this.sanityCheck()) {
            return;
        }

        if(!confirm("Are you sure you want to generate tc in 2022-23 session ?")){
            return;
        }
        
        this.isLoading = true;
        const serviceList = [];

        this.generatedTcs = 0;
        this.estimatedTime = null;

        let selectedLayutContent = JSON.parse(this.selectedLayout.content);

        this.DATA.data.studentSectionList = this.getSelectedStudentList();
        await this.serviceAdapter.getDataForGeneratingTC();

        let doc = new jsPDF({ orientation: 'p', unit: 'pt' });
        doc.deletePage(1);

        let stratTime: any = new Date();
        let startSerialNo;
        if (this.DATA.data.studentSectionList.length > 0)
            startSerialNo = this.filteredStudentSectionList.findIndex((ss) => ss.id == this.DATA.data.studentSectionList[0].id) + 1;

        let si;
        for (si = 0; si < this.DATA.data.studentList.length; si++) {
            this.DATA.studentId = this.DATA.data.studentList[si].id;
            const pdfCertificteSingle = new jsPDF({ orientation: 'p', unit: 'pt' });
            pdfCertificteSingle.deletePage(1);
            for (let i = 0; i < selectedLayutContent.length; i++) {
                if (doc.output('blob').size > 300 * 1024 * 1024) {
                    let endSerialNo;
                    if (i == 0)
                        // last iteration serial no
                        endSerialNo =
                            this.filteredStudentSectionList.findIndex((ss) => ss.id == this.DATA.data.studentSectionList[si - 1].id) + 1;
                    else
                        endSerialNo =
                            this.filteredStudentSectionList.findIndex((ss) => ss.id == this.DATA.data.studentSectionList[si].id) + 1;
                    doc.save(this.selectedLayout.name + `(${startSerialNo}-${endSerialNo})` + '.pdf');
                    doc = new jsPDF({ orientation: 'p', unit: 'pt' });
                    doc.deletePage(1);
                    startSerialNo =
                        this.filteredStudentSectionList.findIndex((ss) => ss.id == this.DATA.data.studentSectionList[si].id) + 1;
                }

                let layoutPage = selectedLayutContent[i];
                await this.canvasAdapter.loadData(layoutPage);
                await this.canvasAdapter.downloadPDF(doc);
                await this.canvasAdapter.downloadPDF(pdfCertificteSingle);
            }

            serviceList.push(
                this.serviceAdapter.generateTC(
                    this.DATA.studentId,
                    this.DATA.certificateNumber,
                    pdfCertificteSingle.output('blob', this.DATA.certificateNumber.toString() + '.pdf')
                )
            );
            this.DATA.certificateNumber += 1;

            this.generatedTcs++;
            let currTime: any = new Date();
            let timeTakenPerStudent: any = (currTime - stratTime) / (1000 * (si + 1)); // converting to seconds
            let estimatedTime = timeTakenPerStudent * (this.DATA.data.studentList.length - si - 1); // in seconds
            let secLeft = Math.ceil(estimatedTime % 60);
            let minutesleft = Math.floor(estimatedTime / 60);
            this.estimatedTime = { minutes: minutesleft, seconds: secLeft };
        }

        if (startSerialNo != this.filteredStudentSectionList.findIndex((ss) => ss.id == this.DATA.data.studentSectionList[0].id) + 1) {
            let endSerialNo = this.filteredStudentSectionList.findIndex((ss) => ss.id == this.DATA.data.studentSectionList[si - 1].id);
            doc.save(this.selectedLayout.name + `(${startSerialNo}-${endSerialNo})` + '.pdf');
        } else {
            doc.save(this.selectedLayout.name + '.pdf');
        }

        this.tcSettings.nextCertificateNumber = this.DATA.certificateNumber;

        Promise.all([
            Promise.all(serviceList).then((tc_list) => {
                this.disableStudentsWithTC(tc_list);
            }),
            this.serviceAdapter.updateTcSettings(),
        ]).then((res) => (this.isLoading = false));
    }
}
