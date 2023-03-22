import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManageWebsiteRoutingModule } from './manage-website.routing';
import { ManageWebsiteComponent } from './manage-website.component';


@NgModule({
    declarations: [ManageWebsiteComponent],
    imports: [
        CommonModule,
        ManageWebsiteRoutingModule
    ]
})
export class ManageWebsiteModule { }
