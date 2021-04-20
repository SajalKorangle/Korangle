import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { SetSchoolFeesComponent } from './set-school-fees.component';

const routes: Routes = [
    {
        path: '',
        component: SetSchoolFeesComponent,
    },
];

@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class SetSchoolFeesRoutingModule {}
