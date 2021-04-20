import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { ViewRecordComponent } from './view-record.component';

const routes: Routes = [
    {
        path: '',
        component: ViewRecordComponent,
    },
];

@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ViewRecordRoutingModule {}
