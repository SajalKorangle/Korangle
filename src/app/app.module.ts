import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { BrowserModule  } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app.routing';
import {BasicComponentsModule} from "./basic-components/basic-components.module";

import { AppComponent } from './app.component';

import { LoginComponent } from './authentication/login.component';

import { PrintService } from './print/print-service';

@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
    ],
    imports: [
        BasicComponentsModule,
        AppRoutingModule,
        HttpModule,
        BrowserModule,
        BrowserAnimationsModule,
    ],
    exports: [
    ],
  providers: [ PrintService ],
  bootstrap: [AppComponent]
})
export class AppModule { }
