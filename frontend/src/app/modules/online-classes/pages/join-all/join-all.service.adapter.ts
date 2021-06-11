import {JoinAllComponent} from './join-all.component';

export class JoinAllServiceAdapter {

    vm: JoinAllComponent;

    constructor() { }

    initialize(vm: JoinAllComponent): void {
        this.vm = vm;
    }

}
