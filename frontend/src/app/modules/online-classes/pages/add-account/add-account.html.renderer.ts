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

}
