import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import { MyCollectionServiceAdapter } from "./my-collection.service.adapter";
import { FeeService } from "../../../../services/fee.service";

@Component({
    selector: 'my-collection',
    templateUrl: './my-collection.component.html',
    styleUrls: ['./my-collection.component.css'],
    providers: [ FeeService ],
})

export class MyCollectionComponent implements OnInit {

    @Input() user;

    classStudentCCEMarksList: any;

    selectedClass: any;

    serviceAdapter: MyCollectionServiceAdapter;

    isLoading = false;

    constructor(public feeService: FeeService,
                private cdRef: ChangeDetectorRef) {}

    ngOnInit(): void {
        this.serviceAdapter = new MyCollectionServiceAdapter();
        this.serviceAdapter.initializeAdapter(this);
        this.serviceAdapter.initializeData();
    }

    detectChanges(): void {
        this.cdRef.detectChanges();
    }

}
