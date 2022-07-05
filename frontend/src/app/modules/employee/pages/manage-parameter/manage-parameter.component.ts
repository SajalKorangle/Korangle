import { Component, Input, OnInit } from '@angular/core';

import { ManageParameterServiceAdapter } from './manage-parameter.service.adapter';
import { DataStorage } from '../../../../classes/data-storage';
import { EmployeeService } from 'app/services/modules/employee/employee.service';
//import {StudentService} from './../../../../services/modules/student/student.service'


@Component({
    selector: 'manage-parameter',
    templateUrl: './manage-parameter.component.html',
    styleUrls: ['./manage-parameter.component.css'],
    providers: [EmployeeService],
})

export class ManageParameterComponent implements OnInit {

    user: any;

    globalParametersList = [
        'Name',
        'Father\'s Name',
        'Mother\'s Name',
        'Spouse\'s Name',
        'Date of Birth',
        'Mobile Number',
        'Gender',
        'Aadhar Number',
        'Passport Number',
        'PRAN Number',
        'Employee Number',
        'Job Title',
        'Qualification',
        'Date of Joining',
        'Date of Leaving',
        'Bank Name',
        'Account Number',
        'EPF Account Number',
        'Bank IFSC Code',
        'Pan Number',
        'Monthly Salary',
        'Paid Leave',
        'Address',
        'Remark',
        'Is Non-Salaried Employee'
    ];

    ADD_PARAMETER_STRING = '<Add New Parameter>';

    // customParameterTypeList: any[] = [{type: 'TEXT', name: 'Text'}, {type: 'FILTER', name: 'Filter'}];
    customParameterTypeList = [
        'TEXT',
        'FILTER',
        'DOCUMENT'
    ];
    customParameterList = [];
    currentParameter: any;
    oldFilterValueList = [];
    newFilterValue: any = '';

    serviceAdapter: ManageParameterServiceAdapter;

    isLoading = false;

    constructor(
        //public studentService: StudentService
        public employeeService: EmployeeService
    ) { }

    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();
        this.serviceAdapter = new ManageParameterServiceAdapter();
        this.serviceAdapter.initializeAdapter(this);
        this.serviceAdapter.initializeData();
    }

    chooseParameter(value: any): void {
        if (value === this.ADD_PARAMETER_STRING) {
            this.addNewParameter();
        } else {
            this.setActiveParameter(value);
        }
    }

    setActiveParameter = parameter => {
        this.currentParameter = { ...parameter, filterValues: JSON.parse(parameter.filterValues) };
        this.oldFilterValueList = this.currentParameter.filterValues;
    }

    addNewParameter = () => {
        this.currentParameter = {
            parentSchool: this.user.activeSchool.dbId,
            name: '',
            parameterType: 'TEXT',
            filterValues: []
        };
    }

    deleteFilter(filter: any) {
        this.currentParameter.filterValues = this.currentParameter.filterValues.filter(x => x !== filter);
    }

    addFilter(filter: any) {
        filter = filter.trim();
        if (this.currentParameter.filterValues.indexOf(filter) !== -1) {
            alert('Filter Value:- ' + filter + ' is already present.');
            return;
        }
        this.currentParameter.filterValues.push(filter);
        this.newFilterValue = '';
    }

    isValidParameterName() {
        return !(this.globalParametersList.find(x => x === this.currentParameter.name)
            || this.customParameterList.find(x => x.name === this.currentParameter.name && x.id !== this.currentParameter.id));
    }

}
