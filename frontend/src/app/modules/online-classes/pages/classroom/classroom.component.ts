import { Component, OnInit } from '@angular/core';

import { DataStorage } from "@classes/data-storage";

import { ClassroomServiceAdapter } from './classroom.service.adapter';
import { ClassroomHtmlRenderer } from './classroom.html.renderer';
import { ClassroomUserInput } from './classroom.user.input';
import { ClassroomBackendData } from './classroom.backend.data';

import { ZoomMtg } from '@zoomus/websdk';

@Component({
    selector: 'classroom',
    templateUrl: './classroom.component.html',
    styleUrls: ['./classroom.component.css'],
    providers: [],
})

export class ClassroomComponent implements OnInit {

    user: any;

    serviceAdapter: ClassroomServiceAdapter;
    htmlRenderer: ClassroomHtmlRenderer;
    userInput: ClassroomUserInput;
    backendData: ClassroomBackendData;

    isLoading: any;

    constructor() {
    }

    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();

        this.userInput = new ClassroomUserInput();
        this.userInput.initialize(this);

        this.backendData = new ClassroomBackendData();
        this.backendData.initialize(this);

        this.htmlRenderer = new ClassroomHtmlRenderer();
        this.htmlRenderer.initialize(this);

        this.serviceAdapter = new ClassroomServiceAdapter();
        this.serviceAdapter.initialize(this);

        ZoomMtg.preLoadWasm();
        ZoomMtg.prepareJssdk();
        ZoomMtg.init();
    }
}
