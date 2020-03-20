import { Component, Input } from '@angular/core';
// import {d} from "@angular/core/src/render3";

@Component({
    selector: 'app-loading-spinner',
    templateUrl: './loading-spinner.component.html',
    styleUrls: ['./loading-spinner.component.css'],
})
export class LoadingSpinnerComponent {

    @Input() user;

    @Input() timer = null;

    countDownTime: any;

    countDown: any;

    intervalFunction: any;

    ngOnInit(): void {

        if (this.timer) {

            this.countDownTime = new Date().getTime() + (this.timer * 1000);

            this.intervalFunction = setInterval(() => {

                this.countDown = Math.ceil((this.countDownTime - (new Date().getTime()))/1000);

            }, 1000);

        }
    }

    ngOnDestroy(): void {
        clearInterval(this.intervalFunction);
    }

}
