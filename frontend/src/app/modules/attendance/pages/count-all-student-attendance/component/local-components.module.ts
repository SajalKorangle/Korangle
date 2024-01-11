import { NgModule } from '@angular/core';
import { ComponentsModule } from '@components/components.module';
import { ShowStudentListModalComponent } from './show-student-list-modal/show-student-list-modal.component';

@NgModule({
    declarations: [ShowStudentListModalComponent],
    imports: [ComponentsModule],
    exports: [ShowStudentListModalComponent],
})
export class LocalComponentsModule { }
