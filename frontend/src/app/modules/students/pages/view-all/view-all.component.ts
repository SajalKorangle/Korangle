import { Component, Input, OnInit } from '@angular/core';

import { StudentOldService } from '../../../../services/modules/student/student-old.service';

import { PrintService } from '../../../../print/print-service';
import { PRINT_STUDENT_LIST } from '../../../../print/print-routes.constants';
import { ExcelService } from '../../../../excel/excel-service';
import { DataStorage } from '../../../../classes/data-storage';
import { GenericService } from '@services/generic/generic-service';

import { MatDialog } from '@angular/material';
import { ImagePdfPreviewDialogComponent } from '../../../../components/image-pdf-preview-dialog/image-pdf-preview-dialog.component';

import * as JSZip from 'jszip';
import * as FileSaver from 'file-saver';
import { toInteger, filter } from 'lodash';
import { CommonFunctions } from '@classes/common-functions';
import { ViewImageModalComponent } from '@components/view-image-modal/view-image-modal.component';
import { ComponentsModule } from 'app/components/components.module';

import { ViewAllServiceAdapter } from './view-all.service.adapter';
import { ViewAllBackendData } from './view-all.backend.data';
import { ViewAllHtmlRenderer } from './view-all.html.renderer';

import { getAge } from "../../common/common-functions";

import { MessageService } from '@services/message-service';
import { NotificationService } from '@services/modules/notification/notification.service';
import { UserService } from '@services/modules/user/user.service';
import { SmsService } from '@services/modules/sms/sms.service';

class ColumnFilter {
    showSerialNumber = true;
    showProfileImage = false;
    showName = true;
    showClassName = false;
    showSectionName = false;
    showRollNumber = false;
    showFathersName = true;
    showMobileNumber = true;
    showSecondMobileNumber = false;
    showScholarNumber = false;
    showDateOfBirth = false;
    showMotherName = false;
    showGender = false;
    showCaste = false;
    showCategory = false;
    showReligion = false;
    showFatherOccupation = false;
    showAddress = true;
    showChildSSMID = false;
    showFamilySSMID = false;
    showBankName = false;
    showBankIfscCode = false;
    showBankAccountNum = false;
    showAadharNum = false;
    showBloodGroup = false;
    showFatherAnnualIncome = false;
    showRTE = false;
    showAdmissionSession = false;
    showBusStopName = false;
    showDateOfAdmission = false;
    showRemark = false;
}

@Component({
    selector: 'view-all',
    templateUrl: './view-all.component.html',
    styleUrls: ['./view-all.component.css'],
    providers: [
        StudentOldService,
        ExcelService,
        GenericService,
        NotificationService,
        UserService,
        SmsService
    ],
})
export class ViewAllComponent implements OnInit {
    user;

    NULL_CONSTANT = null;

    showFilters = false;

    session_list = [];

    columnFilter: ColumnFilter;
    documentFilter: ColumnFilter;

    /* Age Check */
    minAge: any;
    maxAge: any;
    asOnDate = new Date();

    /* Category Options */
    scSelected = false;
    stSelected = false;
    obcSelected = false;
    generalSelected = false;

    /* Gender Options */
    maleSelected = false;
    femaleSelected = false;
    otherGenderSelected = false;

    /* Admission Session Options */
    newAdmission = true;
    oldAdmission = true;

    /* RTE Options */
    yesRTE = true;
    noRTE = true;
    noneRTE = true;

    /* TC Options */
    noTC = true;
    yesTC = true;

    /* Is Logged In? Options */
    messageService: any;
    isLogged = false;
    isNotLogged = false;

    displayStudentNumber = 0;

    classSectionList = [];
    classList = [];
    sectionList = [];

    studentFullProfileList = [];

    busStopList = [];

    studentParameterList: any[] = [];
    studentParameterOtherList: any[] = [];
    studentParameterDocumentList: any[] = [];

    studentParameterValueList: any[] = [];

    profileDocumentSelectList = ['Profile', 'Documents'];
    currentProfileDocumentFilter;

    percent_download_comlpleted;
    totalDownloadSize;
    download;
    totalFiles;
    downloadedFiles;
    totalFailed;

    profileColumns;
    documentColumns;

    noFileIcon = '/assets/img/nofile.png';
    pdfIcon = '/assets/img/pdfIcon.png';
    imageIcon = '/assets/img/imageIcon.png';

    isLoading = false;

    serviceAdapter: ViewAllServiceAdapter;
    backendData: ViewAllBackendData;
    htmlRenderer: ViewAllHtmlRenderer;

    constructor(
        public studentOldService: StudentOldService,
        public excelService: ExcelService,
        public printService: PrintService,
        public genericService: GenericService,
        public dialog: MatDialog,
        public notificationService: NotificationService,
        public userService: UserService,
        public smsService: SmsService,
    ) { }

    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();
        this.columnFilter = new ColumnFilter();
        this.documentFilter = new ColumnFilter();

        this.backendData = new ViewAllBackendData();
        this.backendData.initialize(this);

        this.messageService = new MessageService(this.notificationService, this.userService, this.smsService);

        this.serviceAdapter = new ViewAllServiceAdapter();
        this.serviceAdapter.initializeAdapter(this);
        this.serviceAdapter.initializeData();

        this.htmlRenderer = new ViewAllHtmlRenderer();
        this.htmlRenderer.initializeRenderer(this);

        this.currentProfileDocumentFilter = this.profileDocumentSelectList[0];
        this.percent_download_comlpleted = 0;
        this.totalDownloadSize = 0;
        this.download = 'NOT';
        this.downloadedFiles = 0;
        this.totalFiles = 0;
        this.totalFailed = 0;
    }

    initializeClassSectionList(classSectionList: any): void {
        this.classSectionList = classSectionList;
        this.classSectionList.forEach((classs) => {
            classs.sectionList.forEach((section) => {
                section.selected = false;
                section.containsStudent = false;
            });
        });
    }

    getParameterValue(student, parameter) {
        try {
            if (this.currentProfileDocumentFilter === 'Profile') {
                return this.studentParameterValueList.find(
                    (x) => x.parentStudent === student.dbId && x.parentStudentParameter === parameter.id
                ).value;
            } else {
                let value = this.studentParameterValueList.find(
                    (x) => x.parentStudent === student.dbId && x.parentStudentParameter === parameter.id
                ).document_value;
                if (value) {
                    if (value === '' || value === undefined) {
                    } else {
                        return value;
                    }
                } else {
                    return this.NULL_CONSTANT;
                }
            }
        } catch {
            return this.NULL_CONSTANT;
        }
    }

    getDocumentIcon(student, parameter) {
        try {
            let value = this.studentParameterValueList.find(
                (x) => x.parentStudent === student.dbId && x.parentStudentParameter === parameter.id
            ).document_value;
            if (value) {
                if (value === '' || value === undefined) {
                    return this.NULL_CONSTANT;
                } else {
                    let type = value.split('.');
                    type = type[type.length - 1];
                    if (type == 'pdf') {
                        return this.pdfIcon;
                    } else if (type == 'jpg' || type == 'jpeg' || type == 'png') {
                        return this.imageIcon;
                    }
                }
            } else {
                return this.noFileIcon;
            }
        } catch {
            return this.noFileIcon;
        }
    }

    getFilteredStudentParameterList = () => this.studentParameterList.filter((x) => x.parameterType === 'FILTER');

    getFilteredFilterValues(parameter: any): any {
        if (parameter.filterFilterValues === '') {
            return parameter.filterValues;
        }
        return parameter.filterValues.filter((x) => {
            return x.name.includes(parameter.filterFilterValues);
        });
    }

    initializeStudentFullProfileList(studentFullProfileList: any): void {
        this.studentFullProfileList = studentFullProfileList;
        this.studentFullProfileList.forEach((studentFullProfile) => {
            studentFullProfile['sectionObject'] = this.getSectionObject(studentFullProfile.classDbId, studentFullProfile.sectionDbId);
            studentFullProfile['show'] = false;
            studentFullProfile['selectProfile'] = false;
            studentFullProfile['selectDocument'] = false;
            studentFullProfile['newTransferCertificate'] = this.backendData.tcList.find(tc => tc.parentStudent == studentFullProfile.dbId);
        });
        this.handleStudentDisplay();
    }

    getAdmissionSession(admissionSessionDbId: number): string {
        let admissionSession = null;
        this.session_list.every((session) => {
            if (session.id === admissionSessionDbId) {
                admissionSession = session.name;
                return false;
            }
            return true;
        });
        return admissionSession;
    }

    getBusStopName(busStopDbId: any) {
        let stopName = '';
        if (busStopDbId !== null) {
            this.busStopList.forEach((busStop) => {
                if (busStop.id === busStopDbId) {
                    stopName = busStop.stopName;
                    return;
                }
            });
        }
        return stopName;
    }

    getSectionObject(classDbId: any, sectionDbId: number): any {
        let sectionObject = null;
        this.classSectionList.every((classs) => {
            classs.sectionList.every((section) => {
                if (sectionDbId === section.id && classDbId === classs.id) {
                    sectionObject = section;
                    section.containsStudent = true;
                    return false;
                }
                return true;
            });
            if (sectionObject) {
                return false;
            }
            return true;
        });
        if (!sectionObject) {
            console.log('Error: should have section object');
        }
        return sectionObject;
    }

    printStudentList(): void {
        // alert('Functionality needs to be implemented once again');
        const value = {
            studentList: this.studentFullProfileList.filter((student) => {
                return student.show;
            }),
            columnFilter: this.columnFilter,
        };
        this.printService.navigateToPrintRoute(PRINT_STUDENT_LIST, { user: this.user, value });
    }

    unselectAllClasses(): void {
        this.classSectionList.forEach((classs) => {
            classs.sectionList.forEach((section) => {
                section.selected = false;
            });
        });
        this.handleStudentDisplay();
    }

    selectAllClasses(): void {
        this.classSectionList.forEach((classs) => {
            classs.sectionList.forEach((section) => {
                section.selected = true;
            });
        });
        this.handleStudentDisplay();
    }

    selectAllColumns(): void {
        Object.keys(this.columnFilter).forEach((key) => {
            this.columnFilter[key] = true;
        });
        this.studentParameterList.forEach((item) => {
            item.show = true;
        });
    }

    unSelectAllColumns(): void {
        Object.keys(this.columnFilter).forEach((key) => {
            this.columnFilter[key] = false;
        });
        this.studentParameterList.forEach((item) => {
            item.show = false;
        });
    }

    selectAllDocuments(): void {
        Object.keys(this.documentFilter).forEach((key) => {
            this.documentFilter[key] = true;
        });
        this.studentParameterDocumentList.forEach((item) => {
            item.show = true;
        });
    }

    unSelectAllDocuments(): void {
        Object.keys(this.documentFilter).forEach((key) => {
            this.documentFilter[key] = false;
        });
        this.studentParameterDocumentList.forEach((item) => {
            item.show = false;
        });
    }

    selectAllStudents(): void {
        if (this.currentProfileDocumentFilter === 'Profile') {
            this.studentFullProfileList.forEach((student) => {
                if (student.show) {
                    student.selectProfile = true;
                }
            });
        } else {
            this.studentFullProfileList.forEach((student) => {
                if (student.show) {
                    student.selectDocument = true;
                }
            });
        }
    }

    unselectAllStudents(): void {
        if (this.currentProfileDocumentFilter === 'Profile') {
            this.studentFullProfileList.forEach((student) => {
                if (student.show) {
                    student.selectProfile = false;
                }
            });
        } else {
            this.studentFullProfileList.forEach((student) => {
                if (student.show) {
                    student.selectDocument = false;
                }
            });
        }
    }

    getSelectedStudents() {
        let count = 0;
        if (this.currentProfileDocumentFilter === 'Profile') {
            count = 0;
            this.studentFullProfileList.forEach((student) => {
                if (student.show && student.selectProfile) {
                    ++count;
                }
            });
        } else if (this.currentProfileDocumentFilter === 'Documents') {
            count = 0;
            this.studentFullProfileList.forEach((student) => {
                if (student.show && student.selectDocument) {
                    ++count;
                }
            });
        }
        return count;
    }

    showSectionName(classs: any): boolean {
        let sectionLength = 0;
        classs.sectionList.every((section) => {
            if (section.containsStudent) {
                ++sectionLength;
            }
            if (sectionLength > 1) {
                return false;
            } else {
                return true;
            }
        });
        return sectionLength > 1;
    }

    handleStudentDisplay(): void {
        let serialNumber = 0;
        this.displayStudentNumber = 0;

        this.studentFullProfileList.forEach((student) => {
            /* Class Section Check */
            if (!student.sectionObject.selected) {
                student.show = false;
                return;
            }

            /* Age Check */
            if (this.asOnDate) {
                let age = null;

                if (student.dateOfBirth) {
                    age = getAge(this.asOnDate, student.dateOfBirth);
                }

                if (this.minAge != null && !isNaN(this.minAge)) {
                    if (age == null) {
                        student.show = false;
                        return;
                    } else if (age < this.minAge) {
                        student.show = false;
                        return;
                    }
                }

                if (this.maxAge != null && !isNaN(this.maxAge)) {
                    if (age == null) {
                        student.show = false;
                        return;
                    } else if (age > this.maxAge) {
                        student.show = false;
                        return;
                    }
                }
            }

            /* Category Check */
            if (
                !(this.scSelected && this.stSelected && this.obcSelected && this.generalSelected) &&
                !(!this.scSelected && !this.stSelected && !this.obcSelected && !this.generalSelected)
            ) {
                if (student.category === null || student.category === '') {
                    student.show = false;
                    return;
                }
                switch (student.category) {
                    case 'SC':
                        if (!this.scSelected) {
                            student.show = false;
                            return;
                        }
                        break;
                    case 'ST':
                        if (!this.stSelected) {
                            student.show = false;
                            return;
                        }
                        break;
                    case 'OBC':
                        if (!this.obcSelected) {
                            student.show = false;
                            return;
                        }
                        break;
                    case 'Gen.':
                        if (!this.generalSelected) {
                            student.show = false;
                            return;
                        }
                        break;
                }
            }

            /* Gender Check */
            if (
                !(this.maleSelected && this.femaleSelected && this.otherGenderSelected) &&
                !(!this.maleSelected && !this.femaleSelected && !this.otherGenderSelected)
            ) {
                if (student.gender === null || student.gender === '') {
                    student.show = false;
                    return;
                }
                switch (student.gender) {
                    case 'Male':
                        if (!this.maleSelected) {
                            student.show = false;
                            return;
                        }
                        break;
                    case 'Female':
                        if (!this.femaleSelected) {
                            student.show = false;
                            return;
                        }
                        break;
                    case 'Other':
                        if (!this.otherGenderSelected) {
                            student.show = false;
                            return;
                        }
                        break;
                }
            }

            /* Admission Filter Check */
            if (!this.newAdmission && student.admissionSessionDbId === this.user.activeSchool.currentSessionDbId) {
                student.show = false;
                return;
            } else if (!this.oldAdmission && student.admissionSessionDbId !== this.user.activeSchool.currentSessionDbId) {
                student.show = false;
                return;
            }

            /* RTE Filter Check */
            if (
                !(
                    (this.yesRTE && student.rte === 'YES') ||
                    (this.noRTE && student.rte === 'NO') ||
                    (this.noneRTE && student.rte != 'YES' && student.rte != 'NO')
                )
            ) {
                /*
                 First we are checking for which conditions student should be visible then we are applying a 'NOT'
                 to the whole to get student invisible condition
                 */
                student.show = false;
                return;
            }

            // Transfer Certiicate Check
            if (!((this.noTC && !student.parentTransferCertificate && !student.newTransferCertificate)
                || (this.yesTC && (student.parentTransferCertificate || student.newTransferCertificate)))) {
                student.show = false;
                return;
            }

            // isLoggedIn Filter Check
            if (!(this.isLogged && this.isNotLogged) && !(!this.isLogged && !this.isNotLogged)) {
                if ((this.isLogged && !(student.notification || student.secondNumberNotification)) ||
                (this.isNotLogged && (student.notification || student.secondNumberNotification))) {
                    student.show = false;
                    return;
                }
            }

            // Custom filters check
            for (let x of this.getFilteredStudentParameterList()) {
                let flag = x.showNone;
                x.filterValues.forEach((filter) => {
                    flag = flag || filter.show;
                });
                if (flag) {
                    let parameterValue = this.getParameterValue(student, x);
                    if (parameterValue === this.NULL_CONSTANT && x.showNone) {
                    } else if (
                        !x.filterValues
                            .filter((filter) => filter.show)
                            .map((filter) => filter.name)
                            .includes(parameterValue)
                    ) {
                        student.show = false;
                        return;
                    }
                }
            }
            ++this.displayStudentNumber;
            student.show = true;
            student.selectDocument = true;
            student.selectProfile = true;
            student.serialNumber = ++serialNumber;
        });
    }

    getDownloadSize() {
        this.totalDownloadSize = 0;
        this.studentFullProfileList.forEach((student) => {
            if (student.selectDocument) {
                this.studentParameterDocumentList.forEach((parameter) => {
                    if (parameter.show) {
                        let item = this.studentParameterValueList.find(
                            (x) => x.parentStudent === student.dbId && x.parentStudentParameter === parameter.id
                        );
                        if (item) {
                            this.totalFiles += 1;
                            if (item.document_size) {
                                this.totalDownloadSize += toInteger(item.document_size);
                            }
                        }
                    }
                });
            }
        });
    }

    dataURLtoFile(dataurl, filename) {
        try {
            const arr = dataurl.split(',');
            const mime = arr[0].match(/:(.*?);/)[1];
            const bstr = atob(arr[1]);
            let n = bstr.length;
            const u8arr = new Uint8Array(n);

            while (n--) {
                u8arr[n] = bstr.charCodeAt(n);
            }

            return new File([u8arr], filename, { type: mime });
        } catch (e) {
            return null;
        }
    }

    async download_each_file(document_url) {
        const response = await fetch(document_url);
        if (response.status == 403) {
            ++this.totalFailed;
        } else {
            const reader = response.body.getReader();
            const contentLength = response.headers.get('Content-Length');
            let receivedLength = 0;
            let chunks = [];
            while (true) {
                const { done, value } = await reader.read();
                if (done) {
                    break;
                }
                chunks.push(value);
                receivedLength += value.length;
                this.percent_download_comlpleted += ((value.length * 1.0) / (this.totalDownloadSize * 1.0)) * 100;
                console.log(`Received ${receivedLength} of ${contentLength}`);
                console.log(`now total received is ${this.percent_download_comlpleted} %`);
            }
            let blob = new Blob(chunks);
            return blob;
        }
    }

    downloadDocuments() {
        this.totalFailed = 0;
        this.download = 'START';
        this.getDownloadSize();
        if (this.totalDownloadSize) {
            alert('Your are about to download ' + this.totalFiles + ' files of size ' + this.totalDownloadSize / 1000000 + ' MB');
            let zip = new JSZip();
            let check1 = 0;
            this.downloadedFiles = 0;
            let flag = 1;
            this.studentParameterDocumentList.forEach((parameter) => {
                if (parameter.show) {
                    var Folder = zip.folder(parameter.name);
                    this.studentFullProfileList.forEach((student) => {
                        if (student.selectDocument) {
                            let document_url = this.getParameterValue(student, parameter);
                            if (document_url) {
                                check1 = check1 + 1;
                                this.download_each_file(document_url).then(
                                    (blob) => {
                                        if (blob) {
                                            let type = document_url.split('.');
                                            type = type[type.length - 1];
                                            let file = new Blob([blob], { type: type });
                                            Folder.file(student.name + '_' + student.dbId + '_' + parameter.name + '.' + type, file);
                                            this.downloadedFiles = this.downloadedFiles + 1;
                                            console.log(check1, this.downloadedFiles);
                                        }
                                        if (check1 === this.downloadedFiles + this.totalFailed) {
                                            zip.generateAsync({ type: 'blob' }).then((content) => {
                                                FileSaver.saveAs(content, 'Documents.zip');
                                                this.download = 'NOT';
                                            });
                                            this.isLoading = false;
                                            this.download = 'END';
                                            this.downloadedFiles = 0;
                                            this.totalFiles = 0;
                                            this.percent_download_comlpleted = 0;
                                            this.totalDownloadSize = 0;
                                        }
                                    },
                                    (error) => {
                                        this.download = 'FAIL';
                                        this.isLoading = false;
                                        this.downloadedFiles = 0;
                                        this.totalFiles = 0;
                                        this.percent_download_comlpleted = 0;
                                        this.totalDownloadSize = 0;
                                    }
                                );
                            }
                        }
                    });
                }
            });
        } else {
            alert('No documents are available for download.');
            this.download = 'NOT';
        }
    }

    downloadList(): void {
        if (this.currentProfileDocumentFilter === 'Profile') {
            let template: any;
            template = [this.getHeaderValues()];
            this.studentFullProfileList.forEach((student) => {
                if (student.selectProfile && student.show) {
                    template.push(this.getStudentDisplayInfo(student));
                }
            });
            this.excelService.downloadFile(template, 'korangle_students.csv');
        } else if (this.currentProfileDocumentFilter === 'Documents') {
            this.downloadDocuments();
        }
    }

    openFilePreviewDialog(student, parameter): void {
        let file = this.getParameterValue(student, parameter);
        if (file) {
            let urlList = file.split('.');
            let extension = urlList[urlList.length - 1];
            let type;
            if (extension == 'pdf') {
                type = 'pdf';
            } else if (extension == 'jpg' || extension == 'jpeg' || extension == 'png') {
                type = 'img';
            }
            let dummyImageList = [];
            if (type == 'img') {
                let data = { imageUrl: file };
                dummyImageList.push(data);
            }
            const dialogRef = this.dialog.open(ViewImageModalComponent, {
                maxWidth: '100vw',
                maxHeight: '100vh',
                height: '100%',
                width: '100%',
                data: { imageList: dummyImageList, file: file, index: 0, type: 1, fileType: type, isMobile: this.isMobile() },
            });
            dialogRef.afterClosed().subscribe((result) => {
                console.log('The dialog was closed');
            });
        }
    }

    isMobile(): boolean {
        return CommonFunctions.getInstance().isMobileMenu();
    }

    getHeaderValues(): any {
        let headerValues = [];
        this.columnFilter.showSerialNumber ? headerValues.push('Serial No.') : '';
        this.columnFilter.showProfileImage ? headerValues.push('Profile Image') : '';
        this.columnFilter.showName ? headerValues.push('Name') : '';
        this.columnFilter.showClassName ? headerValues.push('Class Name') : '';
        this.columnFilter.showSectionName ? headerValues.push('Section Name') : '';
        this.columnFilter.showRollNumber ? headerValues.push('Roll Number') : '';
        this.columnFilter.showFathersName ? headerValues.push("Father's Name") : '';
        this.columnFilter.showMobileNumber ? headerValues.push('Mobile No.') : '';
        this.columnFilter.showSecondMobileNumber ? headerValues.push('Alt. Mobile No.') : '';
        this.columnFilter.showScholarNumber ? headerValues.push('Scholar No.') : '';
        this.columnFilter.showDateOfBirth ? headerValues.push('Date of Birth') : '';
        this.columnFilter.showMotherName ? headerValues.push("Mother's Name") : '';
        this.columnFilter.showGender ? headerValues.push('Gender') : '';
        this.columnFilter.showCaste ? headerValues.push('Caste') : '';
        this.columnFilter.showCategory ? headerValues.push('Category') : '';
        this.columnFilter.showReligion ? headerValues.push('Religion') : '';
        this.columnFilter.showFatherOccupation ? headerValues.push("Father's Occupation") : '';
        this.columnFilter.showAddress ? headerValues.push('Address') : '';
        this.columnFilter.showChildSSMID ? headerValues.push('Child SSMID') : '';
        this.columnFilter.showFamilySSMID ? headerValues.push('Family SSMID') : '';
        this.columnFilter.showBankName ? headerValues.push('Bank Name') : '';
        this.columnFilter.showBankIfscCode ? headerValues.push('Bank Ifsc Code') : '';
        this.columnFilter.showBankAccountNum ? headerValues.push('Bank Account No.') : '';
        this.columnFilter.showAadharNum ? headerValues.push('Aadhar No.') : '';
        this.columnFilter.showBloodGroup ? headerValues.push('Blood Group') : '';
        this.columnFilter.showFatherAnnualIncome ? headerValues.push("Father's Annual Income") : '';
        this.columnFilter.showRTE ? headerValues.push('RTE') : '';
        this.columnFilter.showDateOfAdmission ? headerValues.push('Date of Admission') : '';
        this.columnFilter.showAdmissionSession ? headerValues.push('Admission Session') : '';
        this.columnFilter.showBusStopName ? headerValues.push('Bus Stop') : '';
        this.columnFilter.showRemark ? headerValues.push('remark') : '';
        // Custom parameters
        this.studentParameterOtherList.forEach((item) => (item.show ? headerValues.push(item.name) : ''));
        return headerValues;
    }

    getStudentDisplayInfo(student: any): any {
        let studentDisplay = [];
        this.columnFilter.showSerialNumber ? studentDisplay.push(student.serialNumber) : '';
        this.columnFilter.showProfileImage ? studentDisplay.push(student.profileImage) : '';
        this.columnFilter.showName ? studentDisplay.push(student.name) : '';
        this.columnFilter.showClassName ? studentDisplay.push(student.className) : '';
        this.columnFilter.showSectionName ? studentDisplay.push(student.sectionName) : '';
        this.columnFilter.showRollNumber ? studentDisplay.push(student.rollNumber) : '';
        this.columnFilter.showFathersName ? studentDisplay.push(student.fathersName) : '';
        this.columnFilter.showMobileNumber ? studentDisplay.push(student.mobileNumber) : '';
        this.columnFilter.showSecondMobileNumber ? studentDisplay.push(student.secondMobileNumber) : '';
        this.columnFilter.showScholarNumber ? studentDisplay.push(student.scholarNumber) : '';
        this.columnFilter.showDateOfBirth ? studentDisplay.push(student.dateOfBirth) : '';
        this.columnFilter.showMotherName ? studentDisplay.push(student.motherName) : '';
        this.columnFilter.showGender ? studentDisplay.push(student.gender) : '';
        this.columnFilter.showCaste ? studentDisplay.push(student.caste) : '';
        this.columnFilter.showCategory ? studentDisplay.push(student.category) : '';
        this.columnFilter.showReligion ? studentDisplay.push(student.religion) : '';
        this.columnFilter.showFatherOccupation ? studentDisplay.push(student.fatherOccupation) : '';
        this.columnFilter.showAddress ? studentDisplay.push(student.address) : '';
        this.columnFilter.showChildSSMID ? studentDisplay.push(student.childSSMID) : '';
        this.columnFilter.showFamilySSMID ? studentDisplay.push(student.familySSMID) : '';
        this.columnFilter.showBankName ? studentDisplay.push(student.bankName) : '';
        this.columnFilter.showBankIfscCode ? studentDisplay.push(student.bankIfscCode) : '';
        this.columnFilter.showBankAccountNum ? studentDisplay.push(student.bankAccountNum) : '';
        this.columnFilter.showAadharNum ? studentDisplay.push(student.aadharNum ? student.aadharNum.toString() : '') : '';
        this.columnFilter.showBloodGroup ? studentDisplay.push(student.bloodGroup) : '';
        this.columnFilter.showFatherAnnualIncome ? studentDisplay.push(student.fatherAnnualIncome) : '';
        this.columnFilter.showRTE ? studentDisplay.push(student.rte) : '';
        this.columnFilter.showDateOfAdmission ? studentDisplay.push(student.dateOfAdmission) : '';
        this.columnFilter.showAdmissionSession ? studentDisplay.push(this.getAdmissionSession(student.admissionSessionDbId)) : '';
        this.columnFilter.showBusStopName ? studentDisplay.push(this.getBusStopName(student.busStopDbId)) : '';
        this.columnFilter.showRemark ? studentDisplay.push(student.remark) : '';
        // Custom parameter values
        this.studentParameterOtherList.forEach((item) => (item.show ? studentDisplay.push(this.getParameterValue(student, item)) : ''));

        return studentDisplay;
    }
}
