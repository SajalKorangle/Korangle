import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule  } from '@angular/platform-browser';
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
import { FoundedByComponent } from './frontpage/founded-by/founded-by.component';
import { TextCarouselComponent } from './frontpage/text-carousel/text-carousel.component';
import { WhatKorangleCanDoComponent } from './frontpage/what-korangle-can-do/what-korangle-can-do.component';

@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        FrontpageComponent,
        AboutUsComponent,
        WhyKorangleComponent,
        ContactUsComponent,
        PricingComponent,
        FoundedByComponent,
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
  providers: [ PrintService ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
