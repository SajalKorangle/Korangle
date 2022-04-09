import { AppComponent } from './app.component';

export class AppHtmlRenderer {

    vm: AppComponent;

    constructor() { }

    initialize(vm: AppComponent): void {
        this.vm = vm;
    }

}
