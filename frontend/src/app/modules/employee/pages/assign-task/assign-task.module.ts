import { NgModule } from '@angular/core';

import { AssignTaskComponent } from './assign-task.component';

import { AssignTaskRoutingModule } from './assign-task.routing';
import { ComponentsModule } from '../../../../components/components.module';
import { InPagePermissionDialogComponent } from './../../component/in-page-permission-dialog/in-page-permission-dialog.component';
import { LocalComponentsModule } from '@modules/employee/component/local-components.module';
@NgModule({
    declarations: [AssignTaskComponent],
    imports: [
        AssignTaskRoutingModule,
        ComponentsModule,
        LocalComponentsModule
    ],
    entryComponents: [InPagePermissionDialogComponent],
    exports: [],
    providers: [],
    bootstrap: [AssignTaskComponent],
})
export class AssignTaskModule {}
