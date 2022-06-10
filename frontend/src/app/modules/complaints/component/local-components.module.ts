import { NgModule } from '@angular/core';
import { ComponentsModule } from '../../../components/components.module';
import { DeleteTableModalComponent } from './delete-table-modal/delete-table-modal.component';

@NgModule({
    declarations: [DeleteTableModalComponent],
    imports: [ComponentsModule],
    exports: [DeleteTableModalComponent],
})
export class LocalComponentsModule { }
