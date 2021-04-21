import { ViewAllComponent } from './view-all.component';

export class ViewAllBackendData {

    tcList: [];

    vm: ViewAllComponent;

    constructor() { }

    initialize(vm: ViewAllComponent): void {
        this.vm = vm;
    }

}
