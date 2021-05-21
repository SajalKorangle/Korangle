import { NgModule } from '@angular/core';

import { AddEmployeeComponent } from './add-employee.component';

import { AddEmployeeRoutingModule } from './add-employee.routing';
import { ComponentsModule } from '../../../../components/components.module';

import { InPagePermissionDialogComponent } from './../../component/in-page-permission-dialog/in-page-permission-dialog.component';
import { LocalComponentsModule } from '@modules/employee/component/local-components.module';

@NgModule({
    declarations: [AddEmployeeComponent],

    imports: [AddEmployeeRoutingModule, ComponentsModule, LocalComponentsModule],
    entryComponents: [InPagePermissionDialogComponent],
    exports: [],
    providers: [],
    bootstrap: [AddEmployeeComponent],
})
export class AddEmployeeModule { }
