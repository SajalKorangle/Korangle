import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { GestureConfig } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app.routing';
import { BasicComponentsModule } from './basic-components/basic-components.module';

import { AppComponent } from './app.component';

import { ForgotPasswordComponent } from './frontpage/forgot-password/forgot-password.component';

import { PrintService } from './print/print-service';
import { ReactiveFormsModule } from '@angular/forms';
import { DecimalPipe } from '@angular/common';
import {ComponentsModule} from '@components/components.module';
import {LoginSignupComponent} from './frontpage/login-signup/login-signup.component';
import {ContactUsComponent} from './frontpage/contact-us/contact-us.component';
import {CreateSchoolComponent} from './frontpage/create-school/create-school.component';
import { PaymentResponseDialogComponent } from '@basic-components/payment-response-dialog/payment-response-dialog.component';
import {NgOtpInputModule} from 'ng-otp-input';
import {ContactUsCreateSchoolComponent} from './frontpage/components/contact-us-create-school/contact-us-create-school.component';
import {AuthenticationComponent} from './frontpage/components/authentication/authentication.component';
import {PageNotFoundComponent} from './frontpage/page-not-found/page-not-found.component';
import {DashBoardComponent} from '@modules/dash-board.component';
import {FrontpageAuthGuard} from './auth-guards/frontpage-auth-guard';
import {DashboardAuthGuard} from './auth-guards/dashboard-auth-guard';

@NgModule({
    declarations: [
        AppComponent,
        ForgotPasswordComponent,
        ForgotPasswordComponent,
        LoginSignupComponent,
        ContactUsComponent,
        CreateSchoolComponent,
        ContactUsCreateSchoolComponent,
        AuthenticationComponent,
        PageNotFoundComponent,
        DashBoardComponent
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
    entryComponents: [PaymentResponseDialogComponent],
    exports: [],
    providers: [{ provide: HAMMER_GESTURE_CONFIG, useClass: GestureConfig }, PrintService, DecimalPipe, DashboardAuthGuard, FrontpageAuthGuard],
    bootstrap: [AppComponent],
})
export class AppModule { }
