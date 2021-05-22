import { NgModule } from '@angular/core';
import { ComponentsModule } from './../../../components/components.module';
import { InPagePermissionDialogComponent } from './in-page-permission-dialog/in-page-permission-dialog.component';

@NgModule({
    declarations: [
        InPagePermissionDialogComponent
    ],
    imports: [ComponentsModule],
    exports: [
        InPagePermissionDialogComponent
    ],
})
export class LocalComponentsModule { }
