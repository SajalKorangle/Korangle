import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { GestureConfig} from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app.routing';
import { BasicComponentsModule } from "./basic-components/basic-components.module";

import { AppComponent } from './app.component';

import { LoginComponent } from './authentication/login.component';

import { PrintService } from './print/print-service';
import { FrontpageComponent } from './frontpage/frontpage.component';
import { AboutUsComponent } from './frontpage/about-us/about-us.component';
import { WhyKorangleComponent } from './frontpage/why-korangle/why-korangle.component';
import { ContactUsComponent } from './frontpage/contact-us/contact-us.component';
import { PricingComponent } from './frontpage/pricing/pricing.component';
import { TextCarouselComponent } from './frontpage/text-carousel/text-carousel.component';
import { WhatKorangleCanDoComponent } from './frontpage/what-korangle-can-do/what-korangle-can-do.component';
import {RouteReuseStrategy} from '@angular/router';
import {CustomReuseStrategy} from './custom-reuse-strategy';

@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        FrontpageComponent,
        AboutUsComponent,
        WhyKorangleComponent,
        ContactUsComponent,
        PricingComponent,
        TextCarouselComponent,
        WhatKorangleCanDoComponent,
    ],
    imports: [
        BasicComponentsModule,
        AppRoutingModule,
        HttpClientModule,
        BrowserModule,
        BrowserAnimationsModule,
    ],
    exports: [
    ],
  providers: [ { provide: HAMMER_GESTURE_CONFIG, useClass: GestureConfig }, PrintService, {provide: RouteReuseStrategy, useClass: CustomReuseStrategy} ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
