import { NgModule } from '@angular/core';

import { AssignTaskComponent } from './assign-task.component';

import { AssignTaskRoutingModule } from './assign-task.routing';
import { ComponentsModule } from '../../../../components/components.module';
import { InPagePermissionDialogComponent } from './../../component/in-page-permission-dialog/in-page-permission-dialog.component';
import { LocalComponentsModule } from '@modules/employee/component/local-components.module';
import { ViewDefaulterPermissionModalComponent } from './view-defaulter-permission-modal/view-defaulter-permission-modal.component';
import { ViewEnquiryPermissionModalComponent } from './enquiry/view-enquiry-permission-modal/view-enquiry-permission-modal.component';
@NgModule({
    declarations: [AssignTaskComponent, ViewDefaulterPermissionModalComponent, ViewEnquiryPermissionModalComponent],
    imports: [
        AssignTaskRoutingModule,
        ComponentsModule,
        LocalComponentsModule
    ],
    entryComponents: [InPagePermissionDialogComponent, ViewDefaulterPermissionModalComponent, ViewEnquiryPermissionModalComponent],
    exports: [],
    providers: [],
    bootstrap: [AssignTaskComponent],
})
export class AssignTaskModule {}
