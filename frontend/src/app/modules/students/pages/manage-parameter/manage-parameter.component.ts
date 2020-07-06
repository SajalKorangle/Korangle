import {Component, Input, OnInit} from '@angular/core';

import { ManageParameterServiceAdapter } from './manage-parameter.service.adapter';
import {DataStorage} from '../../../../classes/data-storage';
import {StudentService} from './../../../../services/modules/student/student.service'


@Component({
  selector: 'manage-parameter',
  templateUrl: './manage-parameter.component.html',
  styleUrls: ['./manage-parameter.component.css'],
    providers: [ StudentService ],
})

export class ManageParameterComponent implements OnInit {

    user: any;

    globalParametersList = [
        'Name',
        'Father\'s Name',
        'Mother\'s Name',
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
        'Father\'s Occupation',
        'Father\'s Annual Income',
        'Date Of Admission',
        'Alternate Mobile Number',
        'Address',
        'Remark'
    ];

    customParameterTypeList: any[] = [{type: 'TEXT', name: 'Text'}, {type: 'FILTER', name: 'Filter'}]
    customParameterList: any[] = [];
    currentParameter: any;
    newFilterValue: any = ''

    serviceAdapter: ManageParameterServiceAdapter;

    isLoading = false;

    constructor (
        public studentService: StudentService
    ) { }

    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();
        this.serviceAdapter = new ManageParameterServiceAdapter();
        this.serviceAdapter.initializeAdapter(this);
        this.serviceAdapter.initializeData();
    }

    setActiveParameter = parameter => {
        this.currentParameter = {...parameter, filterValues: JSON.parse(parameter.filterValues)}
    }

    addNewParameter = () => {
        this.currentParameter = {
            parentSchool: this.user.activeSchool.dbId,
            name: '',
            parameterType: 'TEXT',
            filterValues: []
        }
    }

    deleteFilter = filter => {
        this.currentParameter.filterValues = this.currentParameter.filterValues.filter(x => x!==filter)
    }

    addFilter = filter => {
        this.currentParameter.filterValues.push(filter)
        this.newFilterValue = ''
        console.log(this.currentParameter)
    }

    isValidParameterName = () => {
        // console.log(this.globalParametersList.find(x => x===this.currentParameter.name) || this.customParameterList.find(x => x.name===this.currentParameter.name && x.id!==this.currentParameter.id))
        return !(this.globalParametersList.find(x => x===this.currentParameter.name) || this.customParameterList.find(x => x.name===this.currentParameter.name && x.id!==this.currentParameter.id))
    }

}
