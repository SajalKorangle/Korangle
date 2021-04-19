import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { UploadListComponent } from './upload-list.component';

const routes: Routes = [
    {
        path: '',
        component: UploadListComponent,
    },
];

@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class UploadListRoutingModule {}
