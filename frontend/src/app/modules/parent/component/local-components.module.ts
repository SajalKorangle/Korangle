import { NgModule } from '@angular/core';
import { ComponentsModule } from '../../../components/components.module';
import { DeleteModalComponent } from './delete-modal/delete-modal.component';

@NgModule({
    declarations: [DeleteModalComponent],
    imports: [ComponentsModule],
    exports: [DeleteModalComponent],
})
export class LocalComponentsModule { }
