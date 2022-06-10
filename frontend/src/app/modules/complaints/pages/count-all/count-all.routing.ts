import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { CountAllComponent } from './count-all.component';

const routes: Routes = [
    {
        path: '',
        component: CountAllComponent,
    },
];

@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class CountAllRoutingModule {}
