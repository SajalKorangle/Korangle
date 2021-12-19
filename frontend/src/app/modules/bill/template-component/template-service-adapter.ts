import { TemplateComponent } from './template-component';

export class TemplateServiceAdapter {

    vm: TemplateComponent;

    initialiseAdapter(vm: TemplateComponent) {
        this.vm = vm;
    }


    initialiseData() {
    }

}