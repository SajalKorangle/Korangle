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
            },
            fields_list: ["name", "author", "id"]
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

    async getBook(id: number) {
        const query = {
            filter: {
                id: id
            },
        };
        let fetchedBook = await this.vm.genericService.getObject({ library_app: "Book" }, query);
        return fetchedBook;
    }

    async getBookWithBookNumber(bookNumber: number) {
        const query = {
            filter: {
                parentSchool_id: this.vm.user.activeSchool.dbId,
                bookNumber: bookNumber
            },
        };

        let fetchedBook = await this.vm.genericService.getObject({ library_app: "Book" }, query);
        return fetchedBook;
    }

    async updateBook() {
        const fetchedBook = await this.getBookWithBookNumber(this.vm.updatedBook.bookNumber);

        if (fetchedBook && fetchedBook.id !== this.vm.selectedBook.id) {
            alert("Another book with the same Book No. already exists. Please choose a different Book No.");
            return;
        }

        this.vm.isLoading = true;

        const book_form_data = new FormData();
        const data = {...this.vm.updatedBook};

        let tasks = []

        Object.keys(data).forEach((key) => {
            if (key === 'frontImage') {
                if (this.vm.frontImage) {
                    const image = this.dataURLtoFile(this.vm.frontImage, 'frontImage.jpg');
                    if (image) book_form_data.append(key, image);
                } else {
                    tasks.push(this.vm.libraryService.createObject(this.vm.libraryService.bookRemoveImage, {id: this.vm.selectedBook.id, imageType: 'frontImage'}))
                }
            } else if (key === 'backImage') {
                if (this.vm.backImage || this.vm.backImage === '') {
                    const image = this.dataURLtoFile(this.vm.backImage, 'backImage.jpg');
                    if (image) book_form_data.append(key, image);
                } else {
                    tasks.push(this.vm.libraryService.createObject(this.vm.libraryService.bookRemoveImage, {id: this.vm.selectedBook.id, imageType: 'backImage'}))
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
        let actionString = " updated book details of" + this.vm.selectedBook.name;

        tasks.push(this.vm.genericService.updateObject({ library_app: "Book" }, book_form_data));
        tasks.push(CommonFunctions.createRecord(parentEmployee, moduleName, taskName, moduleList, actionString));

        try {
            await Promise.all(tasks);
            this.vm.isLoading = false;
            await this.initializeData();
            this.vm.updatedBook = null;
            this.vm.frontImage = null;
            this.vm.backImage = null;
            this.vm.searchBookFormControl.setValue('');
            alert('Book updated succesfully');
        }
        catch {
            this.vm.isLoading = false;
        }

    }

}