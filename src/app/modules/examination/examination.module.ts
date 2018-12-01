import { NgModule } from '@angular/core';

import { ComponentsModule } from '../../components/components.module';

import { ExaminationComponent } from './examination.component';

import { CreateExaminationComponent} from './pages/create-examination/create-examination.component';
import { CreateTestComponent } from './pages/create-test/create-test.component';
import { GenerateHallTicketComponent } from './pages/generate-hall-ticket/generate-hall-ticket.component';

import { ExaminationRoutingModule } from './examination.routing';

import { ExaminationService } from '../../services/examination.service';

@NgModule({
    declarations: [

        ExaminationComponent,

        CreateExaminationComponent,
        CreateTestComponent,
        GenerateHallTicketComponent,

    ],

    imports: [

        ComponentsModule,
        ExaminationRoutingModule,

    ],
    exports: [
    ],
    providers: [ExaminationService],
    bootstrap: [ExaminationComponent],
})
export class ExaminationModule { }
