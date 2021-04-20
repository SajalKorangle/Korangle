import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { DeleteEmployeeComponent } from './delete-employee.component';

const routes: Routes = [
    {
        path: '',
        component: DeleteEmployeeComponent,
    },
];

@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class DeleteEmployeeRoutingModule {}
