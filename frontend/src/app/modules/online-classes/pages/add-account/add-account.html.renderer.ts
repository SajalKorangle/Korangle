import { AddAccountComponent } from './add-account.component';

export class AddAccountHtmlRenderer {

    vm: AddAccountComponent;

    constructor() { }

    initialize(vm: AddAccountComponent): void {
        this.vm = vm;
    }

    copyObject(obj: { [key: string]: any; }) {
        return { ...obj };
    }

    hasAccountInfo(employee): boolean {
        return Boolean(this.vm.backendData.accountInfoList.find(accountInfo => accountInfo.parentEmployee == employee.id));
    }

    isGmeetAccountDisabled(meetNumber, passcode): boolean {
        if ((meetNumber) || (passcode)) {
            return true;
        }
        else {
            return false;
        }
    }

    isZoomAccountDisabled(meetUrl): boolean {
        if (meetUrl) {
            return true;
        }
        else {
            return false;
        }
    }

}
