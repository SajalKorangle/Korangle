import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { AddViaExcelComponent } from './add-via-excel.component';

const routes: Routes = [
    {
        path: '',
        component: AddViaExcelComponent,
    },
];

@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class AddViaExcelRoutingModule {}
