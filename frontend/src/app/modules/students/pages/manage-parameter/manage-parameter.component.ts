import {Component, Input, OnInit} from '@angular/core';

import { ManageParameterServiceAdapter } from './manage-parameter.service.adapter';
import {DataStorage} from '../../../../classes/data-storage';


@Component({
  selector: 'manage-parameter',
  templateUrl: './manage-parameter.component.html',
  styleUrls: ['./manage-parameter.component.css'],
    providers: [  ],
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

    serviceAdapter: ManageParameterServiceAdapter;

    isLoading = false;

    constructor () { }

    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();
        this.serviceAdapter = new ManageParameterServiceAdapter();
        this.serviceAdapter.initializeAdapter(this);
        this.serviceAdapter.initializeData();
    }

}
