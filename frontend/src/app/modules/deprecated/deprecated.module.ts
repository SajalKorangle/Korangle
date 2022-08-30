import { NgModule } from '@angular/core';

import { ComponentsModule } from '../../components/components.module';

import { DeprecatedComponent } from './deprecated.component';

import { DeprecatedRoutingModule } from './deprecated.routing';
import { ReportCardCbseModule } from '@modules/report-card/cbse/report-card-cbse.module';
import { ReportCardMpBoardModule } from '@modules/report-card/mp-board/report-card-mp-board.module';
import { ExpenseModule } from '@modules/expenses/expense.module';
import { StudentModule } from '@modules/students/student.module';
import { ExaminationModule } from '@modules/examination/examination.module';

@NgModule({
    declarations: [DeprecatedComponent],

    imports: [
        ComponentsModule,
        DeprecatedRoutingModule,
        ReportCardCbseModule,
        ReportCardMpBoardModule,
        ExpenseModule,
        StudentModule,
        ExaminationModule
    ],
    exports: [],
    providers: [],
    bootstrap: [DeprecatedComponent],
})
export class DeprecatedModule {}
