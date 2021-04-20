import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { CheckHomeworkComponent } from './check-homework.component';

const routes: Routes = [
    {
        path: '',
        component: CheckHomeworkComponent,
    },
];

@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class CheckHomeworkRoutingModule {}
