import {Component, OnInit, HostListener} from '@angular/core';
import {DataStorage} from "../../../../classes/data-storage";
import { MyApprovalRequestsServiceAdapter } from './my-approval-requests.service.adapter';

import { MatDialog } from '@angular/material';
import { ImagePreviewDialogComponent } from './../../components/image-preview-dialog/image-preview-dialog.component'
import { UseFortransactionDialogComponent } from './components/use-for-transaction-dialog/use-for-transaction-dialog.component'
import { NewApprovalDialogComponent } from './components/new-approval-dialog/new-approval-dialog.component';

import { AccountsService } from './../../../../services/modules/accounts/accounts.service';
import { EmployeeService } from './../../../../services/modules/employee/employee.service';
import { SchoolService } from './../../../../services/modules/school/school.service';

@Component({
    selector: 'my-approval-requests',
    templateUrl: './my-approval-requests.component.html',
    styleUrls: ['./my-approval-requests.component.css'],
    providers: [
        AccountsService,
        EmployeeService,
        SchoolService,
    ]
    
})
export class MyApprovalRequestsComponent implements OnInit {

    user: any;
    serviceAdapter: MyApprovalRequestsServiceAdapter;

    approvalsList: any = [];
    loadingCount = 10;

    accountsList: any;
    employeeList: any;

    
    minimumDate: any;
    maximumDate: any;
    
    loadMoreApprovals: any;
    isLoadingApproval: any;

    isLoading: boolean = false;

    constructor(
        public dialog: MatDialog,
        public accountsService: AccountsService,
        public employeeService: EmployeeService,
        public schoolService: SchoolService,
    ){ }
    // Server Handling - Initial
    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();
        this.serviceAdapter = new MyApprovalRequestsServiceAdapter;
        this.serviceAdapter.initialiseAdapter(this);
        this.serviceAdapter.initialiseData();
    }

    getButtonStyle(approval){
        let style = {
            'background': null,
            'color': 'white',
            'border':null,
        }
        if(approval.requestStatus == 'PENDING' || approval.parentTransaction != null ){
            style.background = 'rgba(196, 196, 196, 1)';
            style.border = '2px solid rgba(196, 196, 196, 1)';
        }
        else if(approval.requestStatus == 'APPROVED'){
            style.background = 'rgba(76, 175, 80, 1)';
            style.border = '2px solid rgba(76, 175, 80, 1)';
        }
        if(approval.requestStatus == 'DECLINED'){
            style.background = 'rgb(244 67 52';
            style.border = '2px solid rgb(244 67 52)';
        }
        
        return style;
    }

    getButtonString(approval): string{
        if(approval.parentTransaction != null){
            return 'Used';
        }
        else if(approval.requestStatus == 'PENDING'){
            return 'Pending';
        }
        else if(approval.requestStatus == 'APPROVED'){
            return 'Granted';
        }
        else{
            return 'Declined';
        }
    }

    openImagePreviewDialog(images: any, index: any, editable): void {
        console.log(images);
        const dialogRef = this.dialog.open(ImagePreviewDialogComponent, {
            maxWidth: '100vw',
            maxHeight: '100vh',
            height: '100%',
            width: '100%',
            data: {'images': images, 'index': index, 'editable': editable, 'isMobile': false}
        });
    
        dialogRef.afterClosed().subscribe(result => {
        });
    }

    openNewAprovalDialog(): void{
        this.dialog.open(NewApprovalDialogComponent);
    }

    openUseForPaymentDialog(approval: any): void {
        const dialogRef = this.dialog.open(UseFortransactionDialogComponent, {
            data: {'approval': JSON.parse(JSON.stringify(approval)), 'originalApproval': approval, 'vm': this}
        });
    
        dialogRef.afterClosed().subscribe(result => {
        });
    }

    @HostListener('window:scroll', ['$event']) onScrollEvent(event){
        if((document.documentElement.clientHeight + document.documentElement.scrollTop) > (0.7*document.documentElement.scrollHeight) ){
          
          console.log('added', this.loadMoreApprovals, this.isLoadingApproval);
        }
        if((document.documentElement.clientHeight + document.documentElement.scrollTop) > (0.7*document.documentElement.scrollHeight) && this.loadMoreApprovals == true && this.isLoadingApproval == false){
            this.serviceAdapter.loadMoreApprovals();
        }
    } 

    getDisplayDateFormat(str :any){
        // return str;
        let d = new Date(str);
        let month = '' + (d.getMonth() + 1);
        let day = '' + d.getDate();
        let year = d.getFullYear();
  
        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;
  
        return [day, month, year].join('/');
    }


}
