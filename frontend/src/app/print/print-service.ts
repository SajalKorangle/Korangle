import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable()
export class PrintService {
    private data: any;
    private isPrinting: boolean = false;

    isSinglePagePrinting = false;

    constructor(private router: Router) {}

    public navigateToPrintRoute(routeName: string, data: any) {
        if (!this.isPrinting) {
            this.isPrinting = true;
            this.data = data;
            const moduleName = window.location.pathname.split('/')[2];
            this.router.navigate([{ outlets: { print: ['print', moduleName, routeName] } }]);
        }
    }

    public getData() {
        this.data.value["printSingleReceipt"] = this.isSinglePagePrinting;
        return this.data;
    }

    public print() {
        if (this.isPrinting) {
            window.print();
            this.router.navigate([{ outlets: { print: null } }]);
            this.isPrinting = false;
            this.data = null;
        }
    }
}
