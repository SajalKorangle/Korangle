
import { LockFeesComponent } from './lock-fees.component';

export class LockFeesServiceAdapter {

    vm: LockFeesComponent;

    constructor() {}

    // Data

    initializeAdapter(vm: LockFeesComponent): void {
        this.vm = vm;
    }

    //initialize data
    initializeData(): void {

        this.vm.isLoading = true;

        this.vm.schoolService.getObjectList(this.vm.schoolService.session,{}).then(session=>{
            this.vm.sessionList = session;
        })

        let lock_fee_list = {
            'parentSchool': this.vm.user.activeSchool.dbId,
            'parentSession': this.vm.user.activeSchool.currentSessionDbId,
        };

        this.vm.feeService.getObjectList(this.vm.feeService.lock_fees, lock_fee_list).then(value => {

            if (value.length == 0) {
                this.vm.lockFees = null;
            } else if (value.length == 1) {
                this.vm.lockFees = value[0];
            } else {
                alert('Error: Report admin');
            }

            this.vm.isLoading = false;

        }, error => {
            this.vm.isLoading = false;
        })

    }

    lockFees(): void {

        this.vm.isLoading = true;

        let lock_fee_object = {
            'parentSchool': this.vm.user.activeSchool.dbId,
            'parentSession': this.vm.user.activeSchool.currentSessionDbId,
        };

        this.vm.feeService.createObject(this.vm.feeService.lock_fees, lock_fee_object).then(value => {

            alert('Fee locked successfully');

            this.vm.lockFees = value;

            this.vm.isLoading = false;

        }, error => {
            this.vm.isLoading = false;
        })

    }

    unlockFees(): void {

        this.vm.isLoading = true;

        this.vm.feeService.deleteObject(this.vm.feeService.lock_fees, this.vm.lockFees).then(value => {

            alert('Fee unlocked successfully');

            this.vm.lockFees = null;

            this.vm.isLoading = false;

        }, error => {
            this.vm.isLoading = false;
        });

    }

}