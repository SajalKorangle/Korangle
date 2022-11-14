import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { ManageStudentSessionsComponent } from './manage-student-sessions.component';

const routes: Routes = [
    {
        path: '',
        component: ManageStudentSessionsComponent,
    },
];

@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ManageStudentSessionsRoutingModule {}