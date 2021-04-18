import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { ViewHomeworkComponent } from './view-homework.component';

const routes: Routes = [
    {
        path: '',
        component: ViewHomeworkComponent,
    },
];

@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ViewHomeworkRoutingModule {}
