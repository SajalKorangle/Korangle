import { NgModule } from '@angular/core';

import { BillComponent } from './bill.component';

import { BillRoutingModule } from './bill.routing';


@NgModule({
    declarations: [
        BillComponent,
    ],

    imports: [
        BillRoutingModule,
    ],
    exports: [],
    providers: [],
    bootstrap: [BillComponent],
})
export class BillModule { }
