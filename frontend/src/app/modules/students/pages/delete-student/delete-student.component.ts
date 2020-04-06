import { Component, OnInit } from '@angular/core';
import { DataStorage } from '../../../../classes/data-storage';
import { FeeService } from '../../../../services/modules/fees/fee.service';
import { StudentService } from '../../../../services/modules/student/student.service';
import {DeleteStudentServiceAdapter} from "./delete-student.service.adapter";
import {SubjectService} from "../../../../services/modules/subject/subject.service";
import {ExaminationService} from "../../../../services/modules/examination/examination.service";


@Component({
  selector: 'app-delete-student',
  templateUrl: './delete-student.component.html',
  styleUrls: ['./delete-student.component.css'],
  providers: [FeeService, StudentService, SubjectService, ExaminationService ],
})

export class DeleteStudentComponent implements OnInit {

    user;

    bothFilters = false;

    selectedStudent: any;
    selectedStudentSectionList = [];
    selectedStudentFeeReceiptList = [];
    selectedStudentDiscountList = [];

    // Data from Parent Student Filter
    classList = [];
    sectionList = [];

    isLoading = false;

    isStudentListLoading = false;

    serviceAdapter: DeleteStudentServiceAdapter;

    constructor(public studentService: StudentService,
                public subjectService: SubjectService,
                public examinationOldService: ExaminationService,
                public feeService: FeeService) { }

    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();

        this.serviceAdapter = new DeleteStudentServiceAdapter();
        this.serviceAdapter.initializeAdapter(this);
        this.serviceAdapter.initializeData();

    }

    handleDetailsFromParentStudentFilter(details: any): void {
        this.classList = details.classList;
        this.sectionList = details.sectionList;
    }

    enableDeleteFromSession(): boolean {
        return !this.selectedStudent.deleted
            && this.selectedStudentSectionList.length > 1
            && this.selectedStudentSectionList[this.selectedStudentSectionList.length-1].parentSession == this.user.activeSchool.currentSessionDbId
            && this.selectedStudentFeeReceiptList.find(feeReceipt => {
                return feeReceipt.parentStudent == this.selectedStudent.id
                    && feeReceipt.parentSession == this.user.activeSchool.currentSessionDbId;
            }) == undefined
            && this.selectedStudentDiscountList.find(discount => {
                return discount.parentStudent == this.selectedStudent.id
                    && discount.parentSession == this.user.activeSchool.currentSessionDbId;
            }) == undefined;
    }

}
