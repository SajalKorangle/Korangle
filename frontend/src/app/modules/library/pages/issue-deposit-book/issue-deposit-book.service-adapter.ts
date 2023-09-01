import { IssueDepositBookComponent } from "./issue-deposit-book.component";

export class IssueDepositBookServiceAdapter {
    vm: IssueDepositBookComponent;
    constructor() { }
    
    initializeAdapter(vm: IssueDepositBookComponent): void {
        this.vm = vm;
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
        })
    }

    depositBook(recordId) {
        this.vm.isIssuedBooksLoading = true;
        const data = {
            id: recordId,
            depositTime: new Date()
        };
        this.vm.genericService.updateObject({ library_app: "BookIssueRecord" }, data).then((response) => {
            this.vm.isIssuedBooksLoading = false;
            this.getIssuedBooksList();
        });
    }

    issueBook(bookNumber) {
        this.vm.isIssuedBooksLoading = true;
        const bookQuery = {
            filter: {
                bookNumber: bookNumber,
                parentSchool_id: this.vm.user.activeSchool.dbId
            },
        };
        this.vm.genericService.getObject({ library_app: "Book" }, bookQuery).then((book) => {
            if (book) {
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
                    this.vm.isIssuedBooksLoading = false;
                    this.getIssuedBooksList();
                });
            } else {
                this.vm.isIssuedBooksLoading = false;
            }
        }
        );
    }
}