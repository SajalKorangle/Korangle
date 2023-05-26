import { CommonFunctions } from '@modules/common/common-functions';
import { UpdateBookComponent } from "./update-book.component";

export class UpdateBookServiceAdapter {
    vm: UpdateBookComponent;

    constructor() {}

    initializeAdapter(vm: UpdateBookComponent): void {
        this.vm = vm;
    }

    async initializeData(): Promise<void> {
        this.vm.setBookListLoading(true);

        const query = {
            filter: {
                parentSchool_id: this.vm.user.activeSchool.dbId
            }
        };
        const fetchedBookList = await this.vm.genericService.getObjectList({library_app: "Book"}, query);

        this.vm.bookList = fetchedBookList;
        this.vm.setBookListLoading(false);
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

    async updateBook() {
        this.vm.isLoading = true;

        // Check if a different book already exists in this school with the same bookNumber
        const fetchedBook = await this.vm.genericService.getObject({ library_app: "Book" }, {
            filter: {
                bookNumber: this.vm.updatedBook.bookNumber,
                parentSchool_id: this.vm.user.activeSchool.dbId
            }
        })

        if (fetchedBook && fetchedBook.id !== this.vm.selectedBook.id) {
            alert("Another book with the same Book No. already exists. Please choose a different Book No.");
            return;
        }

        const book_form_data = new FormData();
        const data = {...this.vm.updatedBook};


        Object.keys(data).forEach((key) => {
            if (key === 'frontImage') {
                if (this.vm.frontImage) {
                    const image = this.dataURLtoFile(this.vm.frontImage, 'frontImage.jpg');
                    console.log({frontimg: image});
                    if (image) book_form_data.append(key, image);
                }
            } else if (key === 'backImage') {
                if (this.vm.backImage) {
                    const image = this.dataURLtoFile(this.vm.backImage, 'backImage.jpg');
                    console.log({backimg: image});
                    if (image) book_form_data.append(key, image);
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
        let actionString = " updated book details of" + this.vm.updatedBook.name;

        try {
            console.log({book_form_data});
            await this.vm.genericService.updateObject({library_app: "Book"}, book_form_data);
            alert('Book updated succesfully');

            await CommonFunctions.createRecord(parentEmployee, moduleName, taskName, moduleList, actionString);

            this.vm.isLoading = false;
        }
        catch {
            this.vm.isLoading = false;
        }

    }

}