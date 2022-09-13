import { Component, Input, OnInit } from '@angular/core';

import { ManageParameterServiceAdapter } from './manage-parameter.service.adapter';
import { DataStorage } from '../../../../classes/data-storage';
import { StudentService } from './../../../../services/modules/student/student.service';

@Component({
    selector: 'manage-parameter',
    templateUrl: './manage-parameter.component.html',
    styleUrls: ['./manage-parameter.component.css'],
    providers: [StudentService],
})
export class ManageParameterComponent implements OnInit {
    user: any;

    globalParametersList = [
        'Name',
        "Father's Name",
        "Mother's Name",
        'Roll No.',
        'Scholar No.',
        'Date of Birth',
        'Mobile Number',
        'Admission Session',
        'Bus Stop',
        'RTE',
        'Gender',
        'Category',
        'Religion',
        'Blood Group',
        'Family SSMID',
        'Child SSMID',
        'Aadhar Number',
        'Caste',
        'Bank Name',
        'Account Number',
        'Bank IFSC Code',
        "Father's Occupation",
        "Father's Annual Income",
        'Date Of Admission',
        'Alternate Mobile Number',
        'Address',
        'Remark',
    ];

    ADD_PARAMETER_STRING = '<Add New Parameter>';

    // customParameterTypeList: any[] = [{type: 'TEXT', name: 'Text'}, {type: 'FILTER', name: 'Filter'}];
    customParameterTypeList = ['TEXT', 'FILTER', 'DOCUMENT'];
    customParameterList = [];
    currentParameter: any;
    oldFilterValueList = [];
    newFilterValue: any = '';

    serviceAdapter: ManageParameterServiceAdapter;

    isLoading = false;

    constructor(public studentService: StudentService) {}

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

    setActiveParameter = (parameter) => {
        this.currentParameter = { ...parameter, filterValues: JSON.parse(parameter.filterValues) };
        this.oldFilterValueList = this.currentParameter.filterValues;
    }

    addNewParameter = () => {
        this.currentParameter = {
            parentSchool: this.user.activeSchool.dbId,
            name: '',
            parameterType: 'TEXT',
            filterValues: [],
        };
    }

    deleteFilter(filter: any) {
        this.currentParameter.filterValues = this.currentParameter.filterValues.filter((x) => x !== filter);
    }

    addFilter(filter: any) {
        filter = filter.trim();
        if (!filter || filter.length === 0) {
            alert("Filter cannot be blank");
            return;
        }
        if (this.currentParameter.filterValues.indexOf(filter) !== -1) {
            alert('Filter Value:- ' + filter + ' is already present.');
            return;
        }
        this.currentParameter.filterValues.push(filter);
        this.newFilterValue = '';
    }

    isValidParameterName() {
        return !(
            this.globalParametersList.find((x) => x === this.currentParameter.name) ||
            this.customParameterList.find((x) => x.name === this.currentParameter.name && x.id !== this.currentParameter.id)
        );
    }
}
