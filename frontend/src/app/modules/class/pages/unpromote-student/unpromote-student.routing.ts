import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { UnpromoteStudentComponent } from './unpromote-student.component';

const routes: Routes = [
    {
        path: '',
        component: UnpromoteStudentComponent,
    },
];

@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class UnpromoteStudentRoutingModule {}
