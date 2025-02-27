import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WebsiteRoutingModule } from './website.routing';
import { WebsiteComponent } from './website.component';


@NgModule({
    declarations: [
        WebsiteComponent
    ],
    imports: [
        CommonModule,
        WebsiteRoutingModule
    ]
})
export class WebsiteModule { }
