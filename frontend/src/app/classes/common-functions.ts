
declare const $: any;

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
        mainPannel.scrollTop = 0;
    }

    copyObject(object: any): any {
        let tempObject = {};
        Object.keys(object).forEach(key => {
            tempObject[key] = object[key];
        });
        return tempObject;
    }

    isMobileMenu(): boolean {
        if ($(window).width() > 991) {
            return false;
        }
        return true;
    };

    static getArrayFromRange(start, end, step=undefined): any {

        let arr = [], len = 0;

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

}

