import { MyApprovalRequestsComponent } from './my-approval-requests.component';

export class MyApprovalRequestsHtmlRenderer {

    vm : MyApprovalRequestsComponent;

    initialise(vm: MyApprovalRequestsComponent){
        this.vm = vm;
    }

    isApprovalSimple(approval: any): boolean {
        return true;
    }

}
