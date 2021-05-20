import { NgModule } from '@angular/core';

import { AssignTaskComponent } from './assign-task.component';

import { AssignTaskRoutingModule } from './assign-task.routing';
import { ComponentsModule } from '../../../../components/components.module';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@NgModule({
    declarations: [AssignTaskComponent],

    imports: [AssignTaskRoutingModule, ComponentsModule, MatProgressSpinnerModule],
    exports: [],
    providers: [],
    bootstrap: [AssignTaskComponent],
})
export class AssignTaskModule { }
