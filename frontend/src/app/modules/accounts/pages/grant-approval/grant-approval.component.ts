import {Component, OnInit, Inject, HostListener} from '@angular/core';
import {DataStorage} from "../../../../classes/data-storage";
import { GrantApprovalServiceAdapter } from './grant-approval.service.adapter'
import { AccountsService } from './../../../../services/modules/accounts/accounts.service'
import { SchoolService } from './../../../../services/modules/school/school.service'
import { EmployeeService } from './../../../../services/modules/employee/employee.service'
import {MatDialog} from '@angular/material';
import { ImagePreviewDialogComponent } from './../../components/image-preview-dialog/image-preview-dialog.component'

@Component({
    selector: 'grant-approval',
    templateUrl: './grant-approval.component.html',
    styleUrls: ['./grant-approval.component.css'],
    providers: [
        AccountsService,
        EmployeeService,
        SchoolService,
    ]
})

export class GrantApprovalComponent implements OnInit {


    // @Input() user;
    user: any;
    serviceAdapter: GrantApprovalServiceAdapter;

    approvalsList: any;
    loadingCount = 10;

    accountsList: any;
    employeeList: any;

    loadMoreApprovals: any;
    isLoadingApproval: any;

    
    minimumDate: any;
    maximumDate: any;

    lockAccounts: any;
    
    constructor( 
        public accountsService: AccountsService,
        public employeeService: EmployeeService,
        public dialog: MatDialog,
        public schoolService: SchoolService,
    ){ }
    // Server Handling - Initial
    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();
        this.serviceAdapter = new GrantApprovalServiceAdapter;
        this.serviceAdapter.initialiseAdapter(this);
        this.serviceAdapter.initialiseData();
    }

    getGrantButtonStyle(approval){
        let style = {
            'background': null,
            'color': 'white',
            'cursor': 'pointer',
            'border':null,
        }
        if(approval.requestStatus == 'PENDING' || (approval.requestStatus == 'DECLINED' && approval.parentTransaction == null) ){
            style.background = 'rgba(76, 175, 80, 1)';
            style.border = '2px solid rgba(76, 175, 80, 1)';
        }
        else if(approval.requestStatus == 'APPROVED' || approval.parentTransaction != null){
            style.background = 'rgba(196, 196, 196, 1)';
            style.cursor = 'not-allowed'
            style.border = '2px solid rgba(196, 196, 196, 1)';
        }
        
        return style;
    }

    getDeclineButtonStyle(approval){
        let style = {
            'background': null,
            'color': 'white',
            'cursor': 'pointer',
            'border':null,
        }
        if(approval.requestStatus == 'PENDING' || (approval.requestStatus == 'APPROVED' && approval.parentTransaction == null) ){
            style.background = 'rgb(244 67 52';
            style.border = '2px solid rgb(244 67 52)';
        }
        else if(approval.requestStatus == 'DECLINED' || approval.parentTransaction != null){
            style.background = 'rgba(196, 196, 196, 1)';
            style.cursor = 'not-allowed'
            style.border = '2px solid rgba(196, 196, 196, 1)';
        }
        
        return style;
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
