
declare const $: any;

export class CommonFunctions {

    static instance: CommonFunctions;

    static getInstance(): CommonFunctions {
        if (!CommonFunctions.instance) {
            CommonFunctions.instance = new CommonFunctions();
        }
        return CommonFunctions.instance;
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

}

