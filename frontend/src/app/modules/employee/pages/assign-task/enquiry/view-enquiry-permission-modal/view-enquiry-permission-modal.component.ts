import { Component, Inject, OnInit } from '@angular/core';
import { CommonFunctions } from '@classes/common-functions';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { GenericService } from '@services/generic/generic-service';
import { ViewEnquiryPermissionModalService } from './view-enquiry-permission-modal.service.adapter';
import { DataStorage } from '@classes/data-storage';

@Component({
  providers: [GenericService],
  selector: 'app-view-enquiry-permission-modal',
  templateUrl: './view-enquiry-permission-modal.component.html',
  styleUrls: ['./view-enquiry-permission-modal.component.css']
})
export class ViewEnquiryPermissionModalComponent implements OnInit {

  employee;
  user;

  employeeInPagePermissions: {
    id?: number,
    parentEmployeePermission: number,
    userType: string,
    viewStudent: boolean,
    viewSummary: boolean
  } = null;

  parentEmployeePermission: {
    configJSON: string,
    id: number,
    parentEmployee: number,
    parentTask: number
  } = null;

  userTypeOptionList = [
    {value: 'Admin', displayName: 'Admin'},
    {value: 'Surveyor', displayName: 'Surveyor'}
  ];

  isLoading: boolean = false;

  isMobile = CommonFunctions.getInstance().isMobileMenu;

  serviceAdapter: ViewEnquiryPermissionModalService;

  constructor(
    public genericService: GenericService,
    public dialogRef: MatDialogRef<ViewEnquiryPermissionModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { [key: string]: any; }
  ) {
    this.employee = data.employee;
    this.parentEmployeePermission = data.parentEmployeePermission;
  }

  ngOnInit() {
    this.user = DataStorage.getInstance().getUser();
    this.serviceAdapter = new ViewEnquiryPermissionModalService();
    this.serviceAdapter.initializeAdapter(this);
    this.serviceAdapter.initializeData();
  }

}
