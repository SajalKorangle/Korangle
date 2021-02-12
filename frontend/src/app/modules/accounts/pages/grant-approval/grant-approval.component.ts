import {Component, OnInit, Inject} from '@angular/core';
import {DataStorage} from "../../../../classes/data-storage";
import { GrantApprovalServiceAdapter } from './grant-approval.service.adapter'
import { AccountsService } from './../../../../services/modules/accounts/accounts.service'
import { EmployeeService } from './../../../../services/modules/employee/employee.service'

@Component({
    selector: 'grant-approval',
    templateUrl: './grant-approval.component.html',
    styleUrls: ['./grant-approval.component.css'],
    providers: [
        AccountsService,
        EmployeeService,
    ]
})

export class GrantApprovalComponent implements OnInit {


    // @Input() user;
    user: any;
    serviceAdapter: GrantApprovalServiceAdapter;

    approvalsList: any;
    loadingCount = 15;

    accountsList: any;
    employeeList: any;

    
    constructor( 
        public accountsService: AccountsService,
        public employeeService: EmployeeService,
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



}
