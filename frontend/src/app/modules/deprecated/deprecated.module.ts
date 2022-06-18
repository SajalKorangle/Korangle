import { NgModule } from '@angular/core';

import { ComponentsModule } from '../../components/components.module';

import { DeprecatedComponent } from './deprecated.component';

import { DeprecatedRoutingModule } from './deprecated.routing';
import { ReportCardCbseRoutingModule } from '@modules/report-card/cbse/report-card-cbse.routing';
import { ReportCardMpBoardRoutingModule } from '@modules/report-card/mp-board/report-card-mp-board.routing';
import { ExpenseRoutingModule } from '@modules/expenses/expense.routing';

@NgModule({
    declarations: [DeprecatedComponent],

    imports: [
        ComponentsModule, 
        DeprecatedRoutingModule,
        ReportCardCbseRoutingModule,
        ReportCardMpBoardRoutingModule,
        ExpenseRoutingModule
    ],
    exports: [],
    providers: [],
    bootstrap: [DeprecatedComponent],
})
export class DeprecatedModule {}
