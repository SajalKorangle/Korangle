import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {LoginComponent} from '@app/authentication/login.component';
import {ComponentsModule} from '@components/components.module';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AuthenticationService} from '@services/authentication.service';

describe('LoginComponent', () => {

    let component: LoginComponent;
    let fixture: ComponentFixture<LoginComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ LoginComponent ],
            imports: [ ComponentsModule, HttpClientTestingModule, RouterTestingModule, BrowserAnimationsModule ],
            providers: [ AuthenticationService ],
        }).compileComponents();
        fixture = TestBed.createComponent(LoginComponent);
        component = fixture.componentInstance;
    }));

    it('toggleVisibilityMode turns visibility mode from true to false', async () => {
        component.visibilityMode = true;
        component.toggleVisibilityMode();
        expect(component.visibilityMode).toBe(false);
    });

});
