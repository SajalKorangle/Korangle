import {async, ComponentFixture, fakeAsync, flush, TestBed, tick} from '@angular/core/testing';

import { ViewNotificationComponent } from '@modules/notification/pages/view-notification/view-notification.component';
import {ComponentsModule} from '@components/components.module';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {DataStorage} from '@classes/data-storage';
import {USER_LIST} from 'test-data-source/classes/user';
import {SCHOOL_LIST} from 'test-data-source/classes/school';
import {RouterTestingModule} from '@angular/router/testing';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NotificationService} from '@services/modules/notification/notification.service';
import {NotificationMockService} from '@mock-services/apps/notification.mock.service';
import {ApiVersion} from '@mock-api/api-version';
import {NOTIFICATION_API} from '@mock-api/apps/notification/notification.api';

describe('ViewNotificationComponent', () => {
  let component: ViewNotificationComponent;
  let fixture: ComponentFixture<ViewNotificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewNotificationComponent ],
      imports: [ ComponentsModule, HttpClientTestingModule, RouterTestingModule, BrowserAnimationsModule ],
      providers: [ NotificationService ],
    }).overrideComponent(ViewNotificationComponent, {
      set: {
        providers: [
          {provide: NotificationService, useClass: NotificationMockService}
        ]
      }
    }).compileComponents();
    DataStorage.getInstance().setUser(USER_LIST[0]);
    DataStorage.getInstance().getUser().schoolList.push(SCHOOL_LIST[0]);
    DataStorage.getInstance().getUser().activeSchool = SCHOOL_LIST[0];
  }));

  beforeEach(async () => {
    fixture = TestBed.createComponent(ViewNotificationComponent);
    component = fixture.componentInstance;
  });

  it('component -> getNotificationTitle', fakeAsync(() => {
    ApiVersion.getInstance().initializeAndSetVersion(NOTIFICATION_API, 1);
    component.ngOnInit();
    flush();
    expect(component.getNotificationTitle(component.notificationList[0])).toBe(component.user.activeSchool.printName);
  }));

});
