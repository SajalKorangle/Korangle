declare const $: any;
import { SESSION_CONSTANT, Session } from '@services/modules/school/models/session';

export class CommonFunctions {
    static instance: CommonFunctions;

    static getInstance(): CommonFunctions {
        if (!CommonFunctions.instance) {
            CommonFunctions.instance = new CommonFunctions();
        }
        return CommonFunctions.instance;
    }

    static scrollToTop(): void {
        const mainPannel = document.getElementById('main-pannel');
        if (mainPannel) {
           mainPannel.scrollTop = 0;       
        }
    }

    copyObject(object: any): any {
        let tempObject = {};
        Object.keys(object).forEach((key) => {
            tempObject[key] = object[key];
        });
        return tempObject;
    }

    isMobileMenu(): boolean {
        if ($(window).width() > 991) {
            return false;
        }
        return true;
    }

    static formatDate(dateStr: any, status: any): any {
        let d = new Date(dateStr);

        if (status === 'firstDate') {   // not used any where
            d = new Date(d.getFullYear(), d.getMonth(), 1);
        } else if (status === 'lastDate') { // not used any where
            d = new Date(d.getFullYear(), d.getMonth() + 1, 0);
        }

        // unwanted logic; can be simple done by d.toLocaleDateString().replaceAll("/", '-');
        let month = '' + (d.getMonth() + 1);
        let day = '' + d.getDate();
        let year = d.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return [year, month, day].join('-');
    }

    static formatTime(dateStr: any): any {
        // unwanted logic can be simply done with d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        let d = new Date(dateStr);
        let hours = '' + d.getHours();
        let minutes = '' + d.getMinutes();

        if (hours.length < 2) hours = '0' + hours;
        if (minutes.length < 2) minutes = '0' + minutes;

        return [hours, minutes].join(':');
    }

    static dataURLtoFile(dataurl, filename) {
        try {
            const arr = dataurl.split(',');
            const mime = arr[0].match(/:(.*?);/)[1];
            const bstr = atob(arr[1]);
            let n = bstr.length;
            const u8arr = new Uint8Array(n);

            while (n--) {
                u8arr[n] = bstr.charCodeAt(n);
            }

            return new File([u8arr], filename, { type: mime });
        } catch (e) {
            return null;
        }
    }

    static getArrayFromRange(start, end, step = undefined): any {
        let arr = [],
            len = 0;

        step = step === undefined ? 1 : step;

        if (arguments.length === 1) {
            len = start;
            start = 0;
            end = start;
        } else {
            start = start === undefined ? 1 : start;
            end = end === undefined ? 1 : end;
            len = end - start;
        }

        let i = 0;
        while (i < len) {
            arr.push(start + i * step);

            i += 1;
        }

        return arr;
    }

    getObjectKeys(obj: { [key: string]: any; }): Array<string> {
        return Object.keys(obj);
    }

    copyText(text: string, snackBar: any) {
        navigator.clipboard.writeText(text);
        snackBar && snackBar.open("Copied To Clipboard", undefined, { duration: 2000 });
    }

    deepCopy<T>(obj: T): T { // use with extra attention if your object contains arrow function as it is not being copied
        if (obj == null || typeof obj != 'object') {
            return obj;
        }
        else if (obj instanceof Date) {
            return new Date(obj) as unknown as T;
        }
        else if (Array.isArray(obj)) {
            return obj.map(el => this.deepCopy(el)) as unknown as T;
        }
        else {
            const clone = Object.create(obj as unknown as object);
            Object.assign(clone, obj);
            Object.keys(clone).forEach(key => {
                clone[key] = this.deepCopy(clone[key]);
            });
            return clone;
        }
    }
}
