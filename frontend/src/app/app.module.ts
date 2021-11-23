import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { GestureConfig } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app.routing';
import { BasicComponentsModule } from './basic-components/basic-components.module';

import { AppComponent } from './app.component';

import { ForgotPasswordComponent } from './frontpage/authentication/components/forgot-password/forgot-password.component';

import { PrintService } from './print/print-service';
import { ReactiveFormsModule } from '@angular/forms';
import { DecimalPipe } from '@angular/common';
import {ComponentsModule} from '@components/components.module';
import {NgOtpInputModule} from 'ng-otp-input';
import {ContactCreateComponent} from './frontpage/contact-create/contact-create.component';
import {AuthenticationComponent} from './frontpage/authentication/authentication.component';
import {LoginSignupComponent} from './frontpage/authentication/components/login-signup/login-signup.component';
import {ContactUsComponent} from './frontpage/contact-create/components/contact-us/contact-us.component';
import {CreateSchoolComponent} from './frontpage/contact-create/components/create-school/create-school.component';

@NgModule({
    declarations: [
        AppComponent,
        ForgotPasswordComponent,
        AuthenticationComponent,
        ForgotPasswordComponent,
        LoginSignupComponent,
        ContactUsComponent,
        CreateSchoolComponent,
        ContactCreateComponent,
    ],
    imports: [
        BasicComponentsModule,
        AppRoutingModule,
        HttpClientModule,
        BrowserModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
        ComponentsModule,
        NgOtpInputModule,
        // RecaptchaModule,  // this is the recaptcha main module
    ],
    exports: [],
    providers: [{ provide: HAMMER_GESTURE_CONFIG, useClass: GestureConfig }, PrintService, DecimalPipe],
    bootstrap: [AppComponent],
})
export class AppModule {}
