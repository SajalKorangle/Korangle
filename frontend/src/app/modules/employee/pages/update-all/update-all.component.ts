import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DataStorage } from '../../../../classes/data-storage';
import { UpdateAllServiceAdapter } from './update-all.service.adapter';
import { EmployeeService } from '../../../../services/modules/employee/employee.service';
import { PARAMETER_TYPE_LIST } from 'app/classes/constants/parameter';
import {formatDate} from '@angular/common';
import { BankService } from '@services/bank.service';

class ColumnHandle {
    name: any;
    key: any;
    inputType: string;
    show: boolean;
    list: any;

    constructor(name, key, inputType, show, list) {
        this.name = name;
        this.key = key;
        this.inputType = inputType;
        this.show = show;
        this.list = list;
    }
}

const GENDER_LIST = ['Male', 'Female', 'Other'];
const BOOLEAN_LIST = ['true', 'false'];

@Component({
    selector: 'app-update-all',
    templateUrl: './update-all.component.html',
    styleUrls: ['./update-all.component.css'],
    providers: [EmployeeService, BankService],
})
export class UpdateAllComponent implements OnInit {
    user;
    employeeFullProfileList = [];

    COLUMNHANDLES: ColumnHandle[] = [
        // value, key, inputType, show, selectedList
        new ColumnHandle('S No.', 'serialNumber', null, true, ''), // 1
        new ColumnHandle('Name', 'name', 'text', true, ''), // 2
        new ColumnHandle('Employee No.', 'employeeNumber', 'text', false, ''), // 3
        new ColumnHandle("Father's Name", 'fatherName', 'text', true, ''), // 4
        new ColumnHandle("Spouse's Name", 'spouseName', 'text', false, ''), // 5
        new ColumnHandle('Mobile No.', 'mobileNumber', 'number', true, ''), // 6
        new ColumnHandle('Date Of Birth', 'dateOfBirth', 'date', false, ''), // 7
        new ColumnHandle("Mother's Name", 'motherName', 'text', false, ''), // 8
        new ColumnHandle('Aadhar No.', 'aadharNumber', 'number', false, ''), // 9
        new ColumnHandle('Passport No.', 'passportNumber', 'text', false, ''), // 10
        new ColumnHandle('Qualification', 'qualification', 'text', false, ''), // 11
        new ColumnHandle('Current Post', 'currentPost', 'text', false, ''), // 12
        new ColumnHandle('Date Of Joining', 'dateOfJoining', 'date', false, ''), // 13
        new ColumnHandle('Pan No.', 'panNumber', 'text', false, ''), // 14
        new ColumnHandle('Gender', 'gender', 'list', false, GENDER_LIST), // 15
        new ColumnHandle('Address', 'address', 'text', false, ''), // 16
        new ColumnHandle('Bank Name', 'bankName', 'text', false, ''), // 17
        new ColumnHandle('Bank Acc. No.', 'bankAccountNumber', 'text', false, ''), // 18
        new ColumnHandle('Bank IFSC Code', 'bankIfscCode', 'text', false, ''), // 19
        new ColumnHandle('Epf Acc. No.', 'epfAccountNumber', 'number', false, ''), // 20
        new ColumnHandle('Month Salary', 'monthlySalary', 'number', false, ''), // 21
        new ColumnHandle('Pran No.', 'pranNumber', 'number', false, ''), // 22
        new ColumnHandle('Remark', 'remark', 'text', false, ''), // 23
        new ColumnHandle('Is Non-Salaried Employee', 'isNonSalariedEmployee', 'list', false, BOOLEAN_LIST), // 24
    ];

    employeeParameterList: any[] = [];
    employeeParameterValueList: any[] = [];
    parameter_type_list = PARAMETER_TYPE_LIST;
    NULL_CONSTANT = null;
    noFileIcon = "/assets/img/noFileIcon.png";
    pdfIcon = "/assets/img/pdfIcon.png";
    imageIcon = "/assets/img/imageIcon.png";


    serviceAdapter: UpdateAllServiceAdapter;

    isLoading = false;

    constructor(
        public employeeService: EmployeeService,
        public cdRef: ChangeDetectorRef,
        public bankService: BankService,
    ) { }

    ngOnInit() {
        this.user = DataStorage.getInstance().getUser();

        this.serviceAdapter = new UpdateAllServiceAdapter();
        this.serviceAdapter.initializeAdapter(this);
        this.serviceAdapter.initializeData();
    }

    getParameterValue = (employee, parameter) => {
        try {
            return this.employeeParameterValueList.find(x => x.parentEmployee === employee.id && x.parentEmployeeParameter === parameter.id).value;
        } catch {
            return this.NULL_CONSTANT;
        }
    }

    getBankName(employee, event) {
        if (event === null || event === '') {
            this.serviceAdapter.updateEmloyeeField('Bank Name', "bankName", employee, null, 'text');
        }
        else if (event.length != 11) {
            return;
        } else {
            this.bankService.getDetailsFromIFSCCode(event.toString())
            .then((value) => {
                if (value === null) {
                    alert('Please enter a valid IFSC code');
                    return;
                }
                this.serviceAdapter.updateEmloyeeField('Bank IFSC Code', "bankIfscCode", employee, event, 'text');
                this.serviceAdapter.updateEmloyeeField('Bank Name', "bankName", employee, value, 'text');
            },
            );
        }
    }

    getDocumentName(employee, parameter) {
        let item = this.employeeParameterValueList.find(x => x.parentEmployee === employee.id && x.parentEmployeeParameter === parameter.id);
        if (item) {
            if (item.document_name) {
                return item.document_name;
            } else {
                let document_name = item.document_value.split("/");
                document_name = document_name[document_name.length - 1];
                return document_name.substring(document_name.indexOf("_") + 1, document_name.length);
            }
        }
        return "No File Chosen";
    }

    getDocumentIcon(employee, parameter) {
        try {
            let value = this.employeeParameterValueList.find(x => x.parentEmployee === employee.id
                && x.parentEmployeeParameter === parameter.id).document_value;
            if (value) {
                if (value === "" || value === undefined) {
                    return this.NULL_CONSTANT;
                }
                else {
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

    checkOnlyUppercaseFields(key: any) {
        return key == 'panNumber' || key == 'passportNumber' || key == 'bankIfscCode';
    }

    handleOnKeyDown(inputType: any, event: any, backendKey: any) {
        let keyPressed = event.keyCode;
        if (inputType == 'text' && (backendKey == 'panNumber' || backendKey == 'passportNumber') && keyPressed == 32) { //space
            event.preventDefault(); // if space is pressed prevent Default
        } else if (inputType == 'date' && keyPressed != 8 && keyPressed != 46) { //check if it is date and not delete
            return false; // don't allow to input any value
        }
    }

    getMaxDateForDateType(key: any, inputType: string) {
        if (key == 'dateOfBirth' && inputType == 'date' ) {
            return formatDate(new Date(), 'yyyy-MM-dd', 'en');
        }
        return '';
    }
}
