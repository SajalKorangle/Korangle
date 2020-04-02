import {Injectable} from '@angular/core';
import { Router } from '@angular/router';

@Injectable()
export class PrintService {
    private data: any;
    private isPrinting: boolean = false;

    constructor(private router: Router) { }

    public navigateToPrintRoute(routeName : string, data: any ) {
        console.log("step 4");
        if(!this.isPrinting) {
            this.isPrinting = true;
            this.data = data;
            const moduleName = window.location.pathname.split('/')[1];
            console.log("step 5");
            console.log("module name is",moduleName);
            this.router.navigate([{ outlets: { print: ['print', moduleName, routeName]}}]);
        }
        console.log('this.isPrinting is,',this.isPrinting);
    }

    public getData() {
        console.log("this.data is ",this.data);
        return this.data;
    }

    public print() {
        console.log('print called with this.isPrinting',this.isPrinting);
        if(this.isPrinting) {
            window.print();
            this.router.navigate([{ outlets: { print: null }}]);
            this.isPrinting = false;
            this.data = null
        }    
    }
}
