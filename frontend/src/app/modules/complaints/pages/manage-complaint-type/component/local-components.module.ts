import { NgModule } from '@angular/core';
import { ComponentsModule } from '@components/components.module';
import { AddStatusModalComponent } from './add-status-modal/add-status-modal.component';
import { ShowTableComponent } from './show-table/show-table.component';

@NgModule({
    declarations: [AddStatusModalComponent, ShowTableComponent],
    imports: [ComponentsModule],
    exports: [AddStatusModalComponent, ShowTableComponent],
})
export class LocalComponentsModule { }
