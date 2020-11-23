import { Component, OnInit } from '@angular/core';


@Component({
    selector: 'settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.css'],
    
})
  

export class SettingsComponent{
    
    sentTypeList = [
        'SMS',
        'NOTIFICATION',
        'NOTIF./SMS',
    ];

    selectedSentType = 'SMS';
    



}