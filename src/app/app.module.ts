import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { BrowserModule  } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ShowHidePasswordModule } from 'ngx-show-hide-password';

import { AppRoutingModule } from './app.routing';
import { ComponentsModule } from './components/components.module';

import { AppComponent } from './app.component';

import { LoginComponent } from './authentication/login.component';

import { PrintService } from './print/print-service';

@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
    ],
    imports: [
        ComponentsModule,
        AppRoutingModule,
        HttpModule,
        BrowserModule,
        ShowHidePasswordModule,
        BrowserAnimationsModule,
    ],
    exports: [
    ],
  providers: [ PrintService ],
  bootstrap: [AppComponent]
})
export class AppModule { }
