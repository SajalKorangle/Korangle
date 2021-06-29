import { MyApprovalRequestsComponent } from './my-approval-requests.component';
import { NewCustomApproval } from './my-approval-requests.component';

export class MyApprovalRequestsHtmlRenderer {

    vm : MyApprovalRequestsComponent;

    initialise(vm: MyApprovalRequestsComponent) {
        this.vm = vm;
    }

    isApprovalSimple(approval: NewCustomApproval): boolean {
        if (approval.simple
            && approval.payFrom.length == 1
            && approval.payTo.length == 1) {
            return true;
        }
        return false;
    }

    getFreshApprovalObject(approval: NewCustomApproval): NewCustomApproval {
        return new NewCustomApproval(this.vm, {autoAdd: approval.autoAdd});
    }

}
