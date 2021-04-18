import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { ViewSentComponent } from './view-sent.component';

const routes: Routes = [
    {
        path: '',
        component: ViewSentComponent,
    },
];

@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ViewSentRoutingModule {}
