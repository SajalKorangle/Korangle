import { OnInit } from '@angular/core';
import { DataStorage } from "../../../classes/data-storage";
import { TemplateServiceAdapter } from './template-service-adapter';

export class TemplateComponent implements OnInit {

    // @Input() user;
    user: any;
    serviceAdapter: TemplateServiceAdapter;

    constructor() { }

    // Server Handling - Initial
    ngOnInit(): void {

        this.user = DataStorage.getInstance().getUser();

        this.serviceAdapter = new TemplateServiceAdapter();
        this.serviceAdapter.initialiseAdapter(this);
        this.serviceAdapter.initialiseData();

    }

}