import { CommonFunctions } from '@modules/common/common-functions';
import { AddBookComponent } from './add-book.component';

export class AddBookServiceAdapter {
    vm: AddBookComponent;

    constructor() { }

    initializeAdapter(vm: AddBookComponent): void {
        this.vm = vm;
    }

    dataURLtoFile(dataurl, filename) {
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

    async createNewBook() {
        if (this.vm.newBook.name == null || this.vm.newBook.name == '') {
            alert("Name should be populated");
            return;
        }
        if (this.vm.newBook.bookNumber == null) {
            alert("Book number should be populated");
            return;
        }

        // Nullify empty fields, because undefined fields do not get carried over to form data, and cause adding books to the database to fail
        Object.keys(this.vm.newBook).forEach(key => {
            if (this.vm.newBook[key] === undefined || this.vm.newBook[key] == '') {
                this.vm.newBook[key] = null;
            }
        });

        this.vm.isLoading = true;

        const book_form_data = new FormData();

        const data = {...this.vm.newBook};

        Object.keys(data).forEach((key) => {
            if (key === 'frontImage') {
                if (this.vm.frontImage) {
                    book_form_data.append(key, this.dataURLtoFile(this.vm.frontImage, 'frontImage.jpeg'));
                }
            } else if (key === 'backImage') {
                if (this.vm.backImage) {
                    book_form_data.append(key, this.dataURLtoFile(this.vm.backImage, 'backImage.jpeg'));
                }
            }
            else {
                if (data[key] !== null) {
                    book_form_data.append(key, data[key]);
                }
            }
        });


        let parentEmployee = this.vm.user.activeSchool.employeeId;
        let moduleName = this.vm.user.section.title;
        let taskName = this.vm.user.section.subTitle;
        let moduleList = this.vm.user.activeSchool.moduleList;
        let actionString = " added " + this.vm.newBook.name;

        this.vm.isLoading = true;
        try {
            const value = await this.vm.genericService.createObject({ library_app: "Book" }, book_form_data);
            alert('Book added succesfully');

            this.vm.initializeVariable();

            await CommonFunctions.createRecord(parentEmployee, moduleName, taskName, moduleList, actionString);

            this.vm.isLoading = false;
        }
        catch {
            this.vm.isLoading = false;
        }

    }

}


