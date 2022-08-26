import { Component, OnInit } from '@angular/core';
import { PrintService } from '../../../../print/print-service';
import { PRINT_EMPLOYEE_LIST } from '../../../../print/print-routes.constants';
import { ExcelService } from "../../../../excel/excel-service";
import { DataStorage } from "../../../../classes/data-storage";
import { ViewAllServiceAdapter } from './view-all.service.adapter';
import { EmployeeService } from 'app/services/modules/employee/employee.service';
import { ImagePdfPreviewDialogComponent } from 'app/components/image-pdf-preview-dialog/image-pdf-preview-dialog.component';
import { MatDialog } from '@angular/material';
import { isMobile } from '../../../../classes/common.js'

import * as JSZip from 'jszip';
import * as FileSaver from 'file-saver';
import { toInteger } from 'lodash';

class ColumnFilter {
    showSerialNumber = true;
    showProfileImage = false;
    showName = true;
    showEmployeeNumber = false;
    showFatherName = true;
    showSpouseName = false;
    showMobileNumber = true;
    showDateOfBirth = false;
    showMotherName = false;
    showAadharNumber = false;
    showPassportNumber = false;
    showQualification = false;
    showCurrentPost = false;
    showDateOfJoining = false;
    showPanNumber = false;
    showGender = false;
    showAddress = true;
    showBankName = false;
    showBankAccountNumber = false;
    showEpfAccountNumber = false;
    showMonthlySalary = false;
    showPranNumber = false;
    showRemark = false;
    showIsNonSalariedEmployee = false;
}

@Component({
    selector: 'view-all',
    templateUrl: './view-all.component.html',
    styleUrls: ['./view-all.component.css'],
    providers: [EmployeeService]
})
export class ViewAllComponent implements OnInit {
    user;

    columnFilter: ColumnFilter;
    documentFilter: ColumnFilter;

    employeeProfileList = [];

    isLoading = false;

    currentProfileDocumentFilter;


    employeeParameterList: any[] = [];
    employeeParameterOtherList: any[] = [];
    employeeParameterDocumentList: any[] = [];

    employeeParameterValueList: any[] = [];

    profileDocumentSelectList = [
        'Profile',
        'Documents',
    ];

    percent_download_comlpleted;
    totalDownloadSize;
    download;
    totalFiles;
    downloadedFiles;
    totalFailed;

    profileColumns;
    documentColumns;

    noFileIcon = "/assets/img/nofile.png";
    pdfIcon = "/assets/img/pdfIcon.png";
    imageIcon = "/assets/img/imageIcon.png";

    serviceAdapter: ViewAllServiceAdapter;
    NULL_CONSTANT = null;

    displayEmployeeNumber = 0;


    constructor(public employeeService: EmployeeService,
        private excelService: ExcelService,
        private printService: PrintService,
        public dialog: MatDialog) { }

    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();

        this.columnFilter = new ColumnFilter();
        this.documentFilter = new ColumnFilter();
        this.serviceAdapter = new ViewAllServiceAdapter();
        this.serviceAdapter.initializeAdapter(this);
        this.serviceAdapter.initializeData();
        this.currentProfileDocumentFilter = this.profileDocumentSelectList[0];
        this.percent_download_comlpleted = 0;
        this.totalDownloadSize = 0;
        this.download = 'NOT';
        this.downloadedFiles = 0;
        this.totalFiles = 0;
        this.totalFailed = 0;

    }


    initializeEmployeeProfileList(employeeProfileList: any): void {
        this.employeeProfileList.forEach(employeeProfile => {
            employeeProfile['show'] = false;
            employeeProfile['selectProfile'] = false;
            employeeProfile['selectDocument'] = false;
        });
        this.handleEmployeeDisplay();
    }

    handleEmployeeDisplay(): void {
        let serialNumber = 0;
        this.displayEmployeeNumber = 0;

        this.employeeProfileList.forEach(employee => {


            ++this.displayEmployeeNumber;
            employee.show = true;
            employee.selectDocument = true;
            employee.selectProfile = true;
            employee.serialNumber = ++serialNumber;

        });

    }

    selectAllColumns(): void {
        Object.keys(this.columnFilter).forEach((key) => {
            this.columnFilter[key] = true;
        });
    }

    unSelectAllColumns(): void {
        Object.keys(this.columnFilter).forEach((key) => {
            this.columnFilter[key] = false;
        });
    }

    printEmployeeList(): void {
        const value = {
            employeeList: this.employeeProfileList,
            columnFilter: this.columnFilter,
        };
        this.printService.navigateToPrintRoute(PRINT_EMPLOYEE_LIST, { user: this.user, value });
    }

    downloadList(): void {
        let template: any;

        template = [this.getHeaderValues()];

        this.employeeProfileList.forEach((employee) => {
            template.push(this.getEmployeeDisplayInfo(employee));
        });

        this.excelService.downloadFile(template, 'korangle_employees.csv');
    }

    getHeaderValues(): any {
        let headerValues = [];
        this.columnFilter.showProfileImage ? headerValues.push('Profile Image') : '';
        this.columnFilter.showName ? headerValues.push('Name') : '';
        this.columnFilter.showEmployeeNumber ? headerValues.push('Employee Number') : '';
        this.columnFilter.showFatherName ? headerValues.push("Father's Name") : '';
        this.columnFilter.showSpouseName ? headerValues.push("Spouse's Name") : '';
        this.columnFilter.showMobileNumber ? headerValues.push('Mobile No.') : '';
        this.columnFilter.showDateOfBirth ? headerValues.push('Date of Birth') : '';
        this.columnFilter.showMotherName ? headerValues.push("Mother's Name") : '';
        this.columnFilter.showGender ? headerValues.push('Gender') : '';
        this.columnFilter.showAadharNumber ? headerValues.push('Aadhar No.') : '';
        this.columnFilter.showPassportNumber ? headerValues.push('Passport No.') : '';
        this.columnFilter.showQualification ? headerValues.push('Qualification') : '';
        this.columnFilter.showCurrentPost ? headerValues.push('Current Post') : '';
        this.columnFilter.showDateOfJoining ? headerValues.push('Date of Joining') : '';
        this.columnFilter.showPanNumber ? headerValues.push('Pan Number') : '';
        this.columnFilter.showGender ? headerValues.push('Gender') : '';
        this.columnFilter.showAddress ? headerValues.push('Address') : '';
        this.columnFilter.showBankName ? headerValues.push('Bank Name') : '';
        this.columnFilter.showBankAccountNumber ? headerValues.push('Bank Account Number') : '';
        this.columnFilter.showEpfAccountNumber ? headerValues.push('Epf Account Number') : '';
        this.columnFilter.showMonthlySalary ? headerValues.push('Monthly Salary') : '';
        this.columnFilter.showPranNumber ? headerValues.push('PRAN Number') : '';
        this.columnFilter.showRemark ? headerValues.push('Remark') : '';
        this.columnFilter.showIsNonSalariedEmployee ? headerValues.push('Is Non-Salaried Employee') : '';

        return headerValues;
    }

    getEmployeeDisplayInfo(employee: any): any {
        let employeeDisplay = [];

        this.columnFilter.showProfileImage ? employeeDisplay.push(employee.profileImage) : '';
        this.columnFilter.showName ? employeeDisplay.push(employee.name) : '';
        this.columnFilter.showEmployeeNumber ? employeeDisplay.push(employee.employeeNumber) : '';
        this.columnFilter.showFatherName ? employeeDisplay.push(employee.fatherName) : '';
        this.columnFilter.showSpouseName ? employeeDisplay.push(employee.spouseName) : '';
        this.columnFilter.showMobileNumber ? employeeDisplay.push(employee.mobileNumber) : '';
        this.columnFilter.showDateOfBirth ? employeeDisplay.push(employee.dateOfBirth) : '';
        this.columnFilter.showMotherName ? employeeDisplay.push(employee.motherName) : '';
        this.columnFilter.showGender ? employeeDisplay.push(employee.gender) : '';
        this.columnFilter.showAadharNumber ? employeeDisplay.push(employee.aadharNumber) : '';
        this.columnFilter.showPassportNumber ? employeeDisplay.push(employee.passportNumber) : '';
        this.columnFilter.showQualification ? employeeDisplay.push(employee.qualification) : '';
        this.columnFilter.showCurrentPost ? employeeDisplay.push(employee.currentPost) : '';
        this.columnFilter.showDateOfJoining ? employeeDisplay.push(employee.dateOfJoining) : '';
        this.columnFilter.showPanNumber ? employeeDisplay.push(employee.panNumber) : '';
        this.columnFilter.showGender ? employeeDisplay.push(employee.gender) : '';
        this.columnFilter.showAddress ? employeeDisplay.push(employee.address) : '';
        this.columnFilter.showBankName ? employeeDisplay.push(employee.bankName) : '';
        this.columnFilter.showBankAccountNumber ? employeeDisplay.push(employee.bankAccountNumber) : '';
        this.columnFilter.showEpfAccountNumber ? employeeDisplay.push(employee.epfAccountNumber) : '';
        this.columnFilter.showMonthlySalary ? employeeDisplay.push(employee.monthlySalary) : '';
        this.columnFilter.showPranNumber ? employeeDisplay.push(employee.pranNumber) : '';
        this.columnFilter.showRemark ? employeeDisplay.push(employee.remark) : '';
        this.columnFilter.showIsNonSalariedEmployee ? employeeDisplay.push(employee.isNonSalariedEmployee) : '';

        return employeeDisplay;
    }

    getSelectedEmployees() {
        let count = 0;
        if (this.currentProfileDocumentFilter === 'Profile') {
            count = 0;
            this.employeeProfileList.forEach(employee => {
                if (employee.show && employee.selectProfile) {
                    ++count;
                }
            });
        }
        else if (this.currentProfileDocumentFilter === 'Documents') {
            count = 0;
            this.employeeProfileList.forEach(employee => {
                if (employee.show && employee.selectDocument) {
                    ++count;
                }
            });
        }
        return count;
    }
    selectAllDocuments(): void {
        Object.keys(this.documentFilter).forEach((key) => {
            this.documentFilter[key] = true;
        });
        this.employeeParameterDocumentList.forEach(item => {
            item.show = true;
        });
    }

    unSelectAllDocuments(): void {
        Object.keys(this.documentFilter).forEach((key) => {
            this.documentFilter[key] = false;
        });
        this.employeeParameterDocumentList.forEach(item => {
            item.show = false;
        });
    }

    getParameterValue(employee, parameter) {
        try {
            if (this.currentProfileDocumentFilter === 'Profile') {
                return this.employeeParameterValueList.find(x =>
                    x.parentEmployee === employee.id && x.parentEmployeeParameter === parameter.id).value;
            }
            else {
                let value = this.employeeParameterValueList.find(x =>
                    x.parentEmployee === employee.id && x.parentEmployeeParameter === parameter.id).document_value;
                if (value) {
                    if (value === "" || value === undefined) {
                    }
                    else {
                        return value;
                    }
                }
                else {
                    return this.NULL_CONSTANT;
                }
            }
        } catch {
            return this.NULL_CONSTANT;
        }
    }

    getDownloadSize() {
        this.totalDownloadSize = 0;
        this.employeeProfileList.forEach(employee => {
            if (employee.selectDocument) {
                this.employeeParameterDocumentList.forEach(parameter => {
                    if (parameter.show) {
                        let item = this.employeeParameterValueList.find(x =>
                            (x.parentemployee === employee.id) && (x.parentEmployeeParameter === parameter.id)
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
        }
        else {
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
                this.percent_download_comlpleted += (value.length * 1.0) / (this.totalDownloadSize * 1.0) * 100;
                console.log(`Received ${receivedLength} of ${contentLength}`);
                console.log(`now total received is ${this.percent_download_comlpleted} %`);
            }
            let blob = new Blob(chunks);
            return blob;
        }
    }

    downloadDocuments() {
        this.totalFailed = 0;
        this.download = "START";
        this.getDownloadSize();
        if (this.totalDownloadSize) {
            alert("Your are about to download " + (this.totalFiles) + " files of size " + (this.totalDownloadSize / 1000000) + " MB");
            let zip = new JSZip();
            let check1 = 0;
            this.downloadedFiles = 0;
            let flag = 1;
            this.employeeParameterDocumentList.forEach(parameter => {
                if (parameter.show) {
                    var Folder = zip.folder(parameter.name);
                    this.employeeProfileList.forEach(employee => {
                        if (employee.selectDocument) {
                            let document_url = this.getParameterValue(employee, parameter);
                            if (document_url) {
                                check1 = check1 + 1;
                                this.download_each_file(document_url).then(blob => {
                                    if (blob) {
                                        let type = document_url.split(".");
                                        type = type[type.length - 1];
                                        let file = new Blob([blob], { type: type });
                                        Folder.file(employee.name + "_" + employee.id + "_" + parameter.name + "." + type, file);
                                        this.downloadedFiles = this.downloadedFiles + 1;
                                        console.log(check1, this.downloadedFiles);
                                    }
                                    if (check1 === this.downloadedFiles + this.totalFailed) {
                                        zip.generateAsync({ type: "blob" })
                                            .then(content => {
                                                FileSaver.saveAs(content, "Documents.zip");
                                                this.download = 'NOT';
                                            });
                                        this.isLoading = false;
                                        this.download = 'END';
                                        this.downloadedFiles = 0;
                                        this.totalFiles = 0;
                                        this.percent_download_comlpleted = 0;
                                        this.totalDownloadSize = 0;
                                    }
                                }, error => {
                                    this.download = "FAIL";
                                    this.isLoading = false;
                                    this.downloadedFiles = 0;
                                    this.totalFiles = 0;
                                    this.percent_download_comlpleted = 0;
                                    this.totalDownloadSize = 0;
                                });
                            }
                        }
                    });
                }
            });
        } else {
            alert("No documents are available for download.");
            this.download = "NOT";
        }
    }

    selectAllEmployees(): void {
        if (this.currentProfileDocumentFilter === 'Profile') {
            this.employeeProfileList.forEach(employee => {
                if (employee.show) {
                    employee.selectProfile = true;
                }
            });
        }
        else {
            this.employeeProfileList.forEach(employee => {
                if (employee.show) {
                    employee.selectDocument = true;
                }
            });
        }
    }

    unselectAllEmployees(): void {
        if (this.currentProfileDocumentFilter === 'Profile') {
            this.employeeProfileList.forEach(employee => {
                if (employee.show) {
                    employee.selectProfile = false;
                }
            });
        }
        else {
            this.employeeProfileList.forEach(employee => {
                if (employee.show) {
                    employee.selectDocument = false;
                }
            });
        }
    }

    openFilePreviewDialog(employee, parameter): void {
        let file = this.getParameterValue(employee, parameter);
        if (file) {
            let urlList = file.split(".");
            let extension = urlList[urlList.length - 1];
            let type;
            if (extension == "pdf") {
                type = "pdf";
            } else if (extension == "jpg" || extension == "jpeg" || extension == "png") {
                type = "img";
            }
            const dialogRef = this.dialog.open(ImagePdfPreviewDialogComponent, {
                width: '600px',
                data: { 'file': file, 'type': type }
            });
            dialogRef.afterClosed().subscribe(result => {
                console.log('The dialog was closed');
            });
        }
    }

    getDocumentIcon(employee, parameter) {
        try {
            let value = this.employeeParameterValueList.find(x => x.parentEmployee === employee.id
                && x.parentEmployeeParameter === parameter.id).document_value;
            if (value) {
                if (value === "" || value === undefined) {
                    return this.NULL_CONSTANT;
                } else {
                    let type = value.split(".");
                    type = type[type.length - 1];
                    if (type == "pdf") {
                        return this.pdfIcon;
                    }
                    else if (type == "jpg" || type == "jpeg" || type == "png") {
                        return this.imageIcon;
                    }
                }
            } else {
                return this.noFileIcon;
            }
        }
        catch {
            return this.noFileIcon;
        }
    }

    getFilteredEmployeeParameterList = () => this.employeeParameterList.filter(x => x.parameterType === 'FILTER');

    getFilteredFilterValues(parameter: any): any {
        if (parameter.filterFilterValues === '') {
            return parameter.filterValues;
        }
        return parameter.filterValues.filter(x => {
            return x.name.includes(parameter.filterFilterValues);
        });
    }

    fn(event: any) {
        console.log('changed event');
        console.log(event);
    }

    isMobile(): boolean {
        return isMobile();
    }

}
