import { Component, Inject, OnInit } from '@angular/core';
import { CommonFunctions } from '@classes/common-functions';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { GenericService } from '@services/generic/generic-service';
import { ViewDefaulterPermissionModalService } from './view-defaulter-permission-modal.service.adapter';
import { DataStorage } from '@classes/data-storage';

@Component({
  providers: [GenericService],
  selector: 'app-view-defaulter-permission-modal',
  templateUrl: './view-defaulter-permission-modal.component.html',
  styleUrls: ['./view-defaulter-permission-modal.component.css']
})
export class ViewDefaulterPermissionModalComponent implements OnInit {

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
    {value: 'Teacher', displayName: 'Teacher'}
  ];

  isLoading: boolean = false;

  isMobile = CommonFunctions.getInstance().isMobileMenu;

  serviceAdapter: ViewDefaulterPermissionModalService;

  constructor(
    public genericService: GenericService,
    public dialogRef: MatDialogRef<ViewDefaulterPermissionModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { [key: string]: any; }
  ){
    this.employee = data.employee;
  }

  
  ngOnInit() {
    this.user = DataStorage.getInstance().getUser();
    this.serviceAdapter = new ViewDefaulterPermissionModalService();
    this.serviceAdapter.initializeAdapter(this);
    this.serviceAdapter.initializeData();
  }

}
