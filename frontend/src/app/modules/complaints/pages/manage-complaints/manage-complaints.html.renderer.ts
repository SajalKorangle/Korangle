import { ManageComplaintsComponent } from './manage-complaints.component';

export class ManageComplaintsHtmlRenderer {

    vm: ManageComplaintsComponent;

    constructor() { }

    /* Initialize Renderer */
    initializeRenderer(vm: ManageComplaintsComponent): void {
        this.vm = vm;
    }  // Ends: initializeRenderer()
}
