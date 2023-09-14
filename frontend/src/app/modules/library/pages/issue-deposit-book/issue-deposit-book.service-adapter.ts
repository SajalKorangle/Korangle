import { error } from "console";
import { IssueDepositBookComponent } from "./issue-deposit-book.component";

export class IssueDepositBookServiceAdapter {
    vm: IssueDepositBookComponent;
    constructor() { }

    initializeAdapter(vm: IssueDepositBookComponent): void {
        this.vm = vm;
        this.vm.isLoading = true;
        const bookListQuery = {
            filter: {
                parentSchool_id: this.vm.user.activeSchool.dbId
            },
            annotate: {
                isIssued: {
                    function: "Count",
                    field: "book_issue_record",
                    filter: {
                        book_issue_record__depositTime: null
                    }
                }
            },
            fields_list: ["isIssued", "__all__"]
        };

        const schoolSettingsQuery = {
            filter: {
                parentSchool_id: this.vm.user.activeSchool.dbId
            }
        };

        Promise.all([
            this.vm.genericService.getObjectList({ library_app: "Book" }, bookListQuery),
            this.vm.genericService.getObject({ library_app: 'SchoolLibrarySettings' }, schoolSettingsQuery)
        ]).then(async (values) => {
            this.vm.booksList = values[0];

            if (!values[1]) {
                values[1] = await this.vm.genericService.createObject({ library_app: 'SchoolLibrarySettings' }, {
                    parentSchool: this.vm.user.activeSchool.dbId
                });
            }

            this.vm.issueLimits.student = values[1].maxStudentIssueCount;
            this.vm.issueLimits.employee = values[1].maxEmployeeIssueCount;

            this.vm.isLoading = false;
        });
    }

    getIssuedBooksList() {
        this.vm.isIssuedBooksLoading = true;
        let query = {
            filter: {
                depositTime: null
            },
            fields_list: ["parentBook__bookNumber", "parentBook__name", "parentBook__author", "issueTime"]
        };

        if (this.vm.issueTo === 'student') {
            query['filter']['parentStudent_id'] = this.vm.selectedStudent.id;
        } else {
            query['filter']['parentEmployee_id'] = this.vm.selectedEmployee.id;
        }

        this.vm.genericService.getObjectList({ library_app: "BookIssueRecord" }, query).then((issuedBooks) => {
            this.vm.issuedBooksList = issuedBooks;
            this.vm.isIssuedBooksLoading = false;
        }).catch((error) => {
            this.vm.isIssuedBooksLoading = false;
        });
    }

    depositBook(record) {
        this.vm.isIssuedBooksLoading = true;
        const data = {
            id: record.id,
            depositTime: new Date()
        };
        this.vm.genericService.updateObject({ library_app: "BookIssueRecord" }, data).then((response) => {

            // for successful call mark the book as not issued in frontend
            if (response) {
                this.getIssuedBooksList();
                this.vm.booksList = this.vm.booksList.map((book) => {
                    if (book.bookNumber === record.parentBook__bookNumber) {
                        book.isIssued = 0;
                    }
                    return book;
                });
                alert("Book deposited successfully");
            } else this.vm.isIssuedBooksLoading = false;
        });
    }

    issueBook(book) {
        this.vm.isIssuedBooksLoading = true;

        const data = {
            parentBook: book.id,
            issueTime: new Date()
        };

        if (this.vm.issueTo === 'student') {
            data['parentStudent'] = this.vm.selectedStudent.id;
        } else {
            data['parentEmployee'] = this.vm.selectedEmployee.id;
        }

        this.vm.genericService.createObject({ library_app: "BookIssueRecord" }, data).then((response) => {

            // for successful call mark the book as issued in frontend
            if (response) {
                this.getIssuedBooksList();
                this.vm.booksList = this.vm.booksList.map((obj) => {
                    if (obj.bookNumber === book.bookNumber) {
                        obj.isIssued = 1;
                    }
                    return obj;
                });
                alert("Book issued successfully");
            } else this.vm.isIssuedBooksLoading = false;
        });
    }
}