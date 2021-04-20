import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { ContactUsComponent } from './contact-us.component';

const routes: Routes = [
    {
        path: '',
        component: ContactUsComponent,
    },
];

@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ContactUsRoutingModule {}
