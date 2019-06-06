import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import { LockFeesServiceAdapter } from "./lock-fees.service.adapter";
import { FeeService } from "../../../../services/fee.service";
import {SESSION_LIST} from "../../../../classes/constants/session";

@Component({
    selector: 'lock-fees',
    templateUrl: './lock-fees.component.html',
    styleUrls: ['./lock-fees.component.css'],
    providers: [ FeeService ],
})

export class LockFeesComponent implements OnInit {

    sessionList = SESSION_LIST;

    @Input() user;

    serviceAdapter: LockFeesServiceAdapter;

    lockFees = null;

    isLoading = false;

    constructor(public feeService: FeeService,
                private cdRef: ChangeDetectorRef) {}

    ngOnInit(): void {
        this.serviceAdapter = new LockFeesServiceAdapter();
        this.serviceAdapter.initializeAdapter(this);
        this.serviceAdapter.initializeData();
    }

    detectChanges(): void {
        this.cdRef.detectChanges();
    }

    getSession(sessionId: any): any {
        return this.sessionList.find(session => {
            return session.id == sessionId;
        });
    }

}
