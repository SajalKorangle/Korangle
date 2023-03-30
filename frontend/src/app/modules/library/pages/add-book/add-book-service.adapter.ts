import { CommonFunctions } from '@modules/common/common-functions';
import { AddBookComponent } from './add-book.component';

export class AddBookServiceAdapter {
    vm: AddBookComponent;

    constructor() { }

    initializeAdapter(vm: AddBookComponent): void {
        this.vm = vm;
    }

    //initialize data
    initializeData(): void {
        this.vm.isLoading = true;

        let schoolId = this.vm.user.activeSchool.dbId;
        let sessionId = this.vm.user.activeSchool.currentSessionDbId;

        // We will use this to filter books params by the currently active school, because
        // each school will be using different book parameters
        let book_parameter_query_parameters = {
            filter: {
                parentSchool: this.vm.user.activeSchool.dbId
            }
        };

        Promise.all([
            this.vm.genericService.getObjectList({library_app: "Book"}, {}), // 0
            this.vm.genericService.getObjectList({library_app: "BookParameter"}, book_parameter_query_parameters) // 1
        ]).then(
            (value) => {
                this.vm.bookList = value[0];
                this.vm.bookParameterList = value[1].map((x) => ({ ...x, filterValues: JSON.parse(x.filterValues) }));

                this.vm.initializeVariable();

                if (this.vm.bookParameterList) {
                    for (let i = 0; i < this.vm.bookParameterList.length; i++) {
                        if (this.vm.bookParameterList[i].parameterType == "DOCUMENT") {
                            this.vm.showToolTip.push(false);
                            this.vm.height.push(120);
                        }
                    }
                }
                this.vm.isLoading = false;
                console.log({value});
                console.log(this.vm.bookList);
                console.log(this.vm.bookParameterList);
            },
            (error) => {
                this.vm.isLoading = false;
            }
        );
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
        if (this.vm.newBook.name == null || this.vm.newBook.name == ''){
            alert("Name should be populated")
            return;
        }

        if (this.vm.newBook.bookNumber == null){
            alert("Book number should be populated");
            return;
        }

        if (this.vm.newBook.dateOfPurchase == '') {
            this.vm.newBook.dateOfPurchase = null;
        }

        if (this.vm.newBook.author == ''){
            this.vm.newBook.author = null;
        }
        if (this.vm.newBook.publisher == ''){
            this.vm.newBook.publisher = null;
        }
        if (this.vm.newBook.edition == ''){
            this.vm.newBook.edition = null;
        }
        if (this.vm.newBook.coverType == ''){
            this.vm.newBook.coverType = null;
        }
        if (this.vm.newBook.bookType == ''){
            this.vm.newBook.bookType = null;
        }
        if (this.vm.newBook.location == ''){
            this.vm.newBook.location = null;
        }

        this.vm.isLoading = true;

        const book_form_data = new FormData();

        const data = {...this.vm.newBook}

        Object.keys(data).forEach((key) => {
            if (key === 'frontImage') {
                if (this.vm.frontImage) {
                    book_form_data.append(key, this.dataURLtoFile(this.vm.frontImage, 'frontImage.jpeg'));
                }
            } else if (key === 'backImage'){
                if (this.vm.backImage){
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
        try{
            console.log({book_form_data})
            const value = await this.vm.genericService.createObject({ library_app: "Book" }, book_form_data);
            console.log({value});
            alert('Book added succesfully');

            this.vm.initializeVariable();

            await CommonFunctions.createRecord(parentEmployee, moduleName, taskName, moduleList, actionString);

            this.vm.isLoading = false;
        }
        catch{
            this.vm.isLoading = false;
        }



        // this.vm.currentBookParameterValueList = this.vm.currentBookParameterValueList.filter((x) => {
        //     return x.value !== this.vm.nullValue;
        // });
        // this.vm.currentBookParameterValueList.forEach((x) => {
        //     x.parentBook = value.id;
        // });

        // let form_data_list = [];
        // this.vm.bookParameterList.forEach((parameter) => {
        //     let temp_obj = this.vm.currentBookParameterValueList.find((x) => x.parentBookParameter === parameter.id);
        //     if (temp_obj) {
        //         const data = { ...temp_obj };
        //         const form_data = new FormData();
        //         Object.keys(data).forEach((key) => {
        //             if (data[key]) {
        //                 if (key == 'document_name' || key == 'document_size') {
        //                 } else if (key == 'document_value') {
        //                     form_data.append(key, this.dataURLtoFile(data[key], data['document_name']));
        //                     form_data.append('document_size', data['document_size']);
        //                 } else {
        //                     form_data.append(key, data[key]);
        //                 }
        //             }
        //         });
        //         form_data_list.push(form_data);
        //     }
    }

}


