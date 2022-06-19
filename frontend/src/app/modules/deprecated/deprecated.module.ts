import { NgModule } from '@angular/core';

import { ComponentsModule } from '../../components/components.module';

import { DeprecatedComponent } from './deprecated.component';

import { DeprecatedRoutingModule } from './deprecated.routing';
import { ReportCardCbseRoutingModule } from '@modules/report-card/cbse/report-card-cbse.routing';
import { ReportCardMpBoardRoutingModule } from '@modules/report-card/mp-board/report-card-mp-board.routing';
import { ExpenseRoutingModule } from '@modules/expenses/expense.routing';
import { StudentRoutingModule } from '@modules/students/student.routing';
import { ExaminationRoutingModule } from '@modules/examination/examination.routing';

@NgModule({
    declarations: [DeprecatedComponent],

    imports: [
        ComponentsModule, 
        DeprecatedRoutingModule,
        ReportCardCbseRoutingModule,
        ReportCardMpBoardRoutingModule,
        ExpenseRoutingModule,
        StudentRoutingModule,
        ExaminationRoutingModule
    ],
    exports: [],
    providers: [],
    bootstrap: [DeprecatedComponent],
})
export class DeprecatedModule {}
