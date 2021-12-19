import { Component, OnInit } from '@angular/core';
import { GenericService } from '@services/generic/generic-service';
import { DataStorage } from "../../../../classes/data-storage";
import { PayBillServiceAdapter } from './pay-bill.service.adapter';

@Component({
    selector: 'pay-bill',
    templateUrl: './pay-bill.component.html',
    styleUrls: ['./pay-bill.component.css'],
    providers: [GenericService]
})

export class PayBillComponent implements OnInit {

    // @Input() user;
    user: any;
    serviceAdapter: PayBillServiceAdapter;

    // Loader List
    isInitialLoading: boolean;

    unpaidBillList = [];

    constructor(genericService: GenericService) { }

    // Server Handling - Initial
    ngOnInit(): void {

        this.user = DataStorage.getInstance().getUser();

        this.serviceAdapter = new PayBillServiceAdapter;
        this.serviceAdapter.initialiseAdapter(this);
        this.serviceAdapter.initialiseData();

    }

}