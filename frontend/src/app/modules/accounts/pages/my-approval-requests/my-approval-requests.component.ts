import {Component, OnInit, Inject} from '@angular/core';
import {DataStorage} from "../../../../classes/data-storage";
import { MyApprovalRequestsServiceAdapter } from './my-approval-requests.service.adapter'
import { AccountsService } from './../../../../services/modules/accounts/accounts.service'
import { EmployeeService } from './../../../../services/modules/employee/employee.service'

@Component({
    selector: 'my-approval-requests',
    templateUrl: './my-approval-requests.component.html',
    styleUrls: ['./my-approval-requests.component.css'],
    providers: [
        AccountsService,
        EmployeeService,
    ]
    
})




export class MyApprovalRequestsComponent implements OnInit {


    // @Input() user;
    user: any;
    serviceAdapter: MyApprovalRequestsServiceAdapter;

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


}
