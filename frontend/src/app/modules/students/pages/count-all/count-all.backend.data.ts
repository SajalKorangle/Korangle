import { CountAllComponent } from './count-all.component';

export class CountAllBackendData {

    tcList: any;

    vm: CountAllComponent;

    constructor() { }

    initialize(vm: CountAllComponent): void {
        this.vm = vm;
    }

}
