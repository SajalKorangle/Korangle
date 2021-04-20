import { Component, EventEmitter, Output } from '@angular/core';

@Component({
    selector: 'app-authentication',
    templateUrl: './authentication.component.html',
})
export class AuthenticationComponent {
    @Output() showFrontPageProgressBar = new EventEmitter();

    chosenComponent = 'login';

    componentList = ['login', 'forgot-password', 'signup'];

    constructor() {}

    handleEvent(value) {
        this.showFrontPageProgressBar.emit(value);
    }

    changePage(value) {
        this.chosenComponent = value;
    }
}
