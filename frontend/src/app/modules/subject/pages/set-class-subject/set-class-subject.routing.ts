import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { SetClassSubjectComponent } from './set-class-subject.component';

const routes: Routes = [
    {
        path: '',
        component: SetClassSubjectComponent,
    },
];

@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class SetClassSubjectRoutingModule {}
