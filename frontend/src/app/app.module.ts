import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { GestureConfig } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app.routing';
import { BasicComponentsModule } from './basic-components/basic-components.module';

import { AppComponent } from './app.component';

import { LoginComponent } from './authentication/login/login.component';
import { AuthenticationComponent } from './authentication/authentication.component';
import { ForgotPasswordComponent } from './authentication/forgot-password/forgot-password.component';

import { PrintService } from './print/print-service';
import { FrontpageComponent } from './frontpage/frontpage.component';
import { AboutUsComponent } from './frontpage/about-us/about-us.component';
import { WhyKorangleComponent } from './frontpage/why-korangle/why-korangle.component';
import { ContactUsComponent } from './frontpage/contact-us/contact-us.component';
import { PricingComponent } from './frontpage/pricing/pricing.component';
import { TextCarouselComponent } from './frontpage/text-carousel/text-carousel.component';
import { WhatKorangleCanDoComponent } from './frontpage/what-korangle-can-do/what-korangle-can-do.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SignupComponent } from './authentication/signup/signup.component';
import { DecimalPipe } from '@angular/common';
import { Frontpage2Component } from './frontpage2/frontpage2.component';

@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        ForgotPasswordComponent,
        SignupComponent,
        AuthenticationComponent,
        FrontpageComponent,
        AboutUsComponent,
        WhyKorangleComponent,
        ContactUsComponent,
        PricingComponent,
        TextCarouselComponent,
        WhatKorangleCanDoComponent,
        Frontpage2Component,
    ],
    imports: [
        BasicComponentsModule,
        AppRoutingModule,
        HttpClientModule,
        BrowserModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
        // RecaptchaModule,  // this is the recaptcha main module
    ],
    exports: [],
    providers: [{ provide: HAMMER_GESTURE_CONFIG, useClass: GestureConfig }, PrintService, DecimalPipe],
    bootstrap: [AppComponent],
})
export class AppModule {}
