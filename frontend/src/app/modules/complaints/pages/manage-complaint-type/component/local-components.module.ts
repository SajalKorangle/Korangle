import { NgModule } from '@angular/core';
import { ComponentsModule } from '@components/components.module';
import { AddStatusModalComponent } from './add-status-modal/add-status-modal.component';

@NgModule({
    declarations: [AddStatusModalComponent],
    imports: [ComponentsModule],
    exports: [AddStatusModalComponent],
})
export class LocalComponentsModule { }
