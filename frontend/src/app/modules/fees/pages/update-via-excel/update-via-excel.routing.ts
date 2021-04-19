import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { UpdateViaExcelComponent } from './update-via-excel.component';

const routes: Routes = [
    {
        path: '',
        component: UpdateViaExcelComponent,
    },
];

@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class UpdateViaExcelRoutingModule {}
