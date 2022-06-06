import { AssignEmployeeModalComponent } from './assign-employee-modal.component';
import { Query } from '@services/generic/query';

export class AssignEmployeeModalServiceAdapter {
    vm: AssignEmployeeModalComponent;

    constructor() { }

    /* Initialize Adapter */
    initializeAdapter(vm: AssignEmployeeModalComponent): void {
        this.vm = vm;
    }  // Ends: initializeAdapter()

    /* Get Employee from ID */
    getEmployee(id) {
        for (let i = 0; i < this.vm.employeeList.length; i++) {
            if (this.vm.employeeList[i].id == id) {
                return this.vm.employeeList[i];
            }
        }
    }  // Ends: getEmployee()

    /* Send Notification */
    async sendNotification(parentEmployee) {

        /* Get User */
        const parentUserQuery = new Query()
            .filter({ username: parentEmployee["mobileNumber"] })
            .getObjectList({ user_app: 'User' });

        let parentUserList = [];
        [
            parentUserList,   // 0
        ] = await Promise.all([
            parentUserQuery,   // 0
        ]);

        let notificationObject = {};
        let employee = this.getEmployee(this.vm.user.activeSchool.employeeId);

        notificationObject["content"] = "Renotification for comlpaint " + this.vm.openedComplaint.title + " by " + employee.name;
        notificationObject["parentSchool"] = this.vm.user.activeSchool.dbId;
        notificationObject["parentUser"] = parentUserList[0].id;

        const notification = await new Query().createObject({notification_app: 'Notification'}, notificationObject);
        alert("Renotified successfully.");
    }  // Ends: sendNotification()
}
