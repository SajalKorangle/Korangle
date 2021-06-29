import { NgModule } from '@angular/core';
import { ComponentsModule } from './../../../components/components.module';
import { NewOnlineClassDialogComponent } from './new-online-class-dialog/new-online-class-dialog.component';

@NgModule({
    declarations: [
        NewOnlineClassDialogComponent
    ],
    imports: [ComponentsModule],
    exports: [
        NewOnlineClassDialogComponent
    ],
})
export class LocalComponentsModule { }
