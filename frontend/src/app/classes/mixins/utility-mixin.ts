export default class UtilityMixin {

    snackBar: any;

    getObjetKeys(obj: { [key: string]: any; }): Array<string> {
        return Object.keys(obj);
    }

    selectText(text: string) {
        navigator.clipboard.writeText(text);
        if (this.snackBar) {
            this.snackBar.open("Copied To Clipboard", undefined, { duration: 2000 });
        }
    }

}