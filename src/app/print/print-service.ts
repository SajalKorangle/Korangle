import {Injectable} from '@angular/core';
import { Router } from '@angular/router';

@Injectable()
export class PrintService {
    private data: any;
    private isPrinting: boolean = false;

    constructor(private router: Router) { }

    public navigateToPrintRoute(routeName : string, data: any ) {
        console.log(routeName);
        console.log(data);
        if(!this.isPrinting) {
            this.isPrinting = true;
            this.data = data;
            const moduleName = window.location.pathname.split('/')[1];
            console.log(moduleName,"module name");
            this.router.navigate([{ outlets: { print: ['print', moduleName, routeName]}}]);
        }      
    }

    public getData() {
        console.log(this.data);
        return this.data;
    }

    public print() {
        if(this.isPrinting) {
            window.print();
            this.router.navigate([{ outlets: { print: null }}]);
            this.isPrinting = false;
            this.data = null
        }    
    }
}
