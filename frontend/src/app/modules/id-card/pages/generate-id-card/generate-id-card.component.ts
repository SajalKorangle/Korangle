import {Component, OnInit, ElementRef, ViewChild} from '@angular/core';

import { IdCardService } from '../../../../services/modules/id-card/id-card.service';
import { StudentService } from '../../../../services/modules/student/student.service';
import { ClassService } from '../../../../services/modules/class/class.service';

import { GenerateIdCardServiceAdapter } from './generate-id-card.service.adapter';

import {DataStorage} from "../../../../classes/data-storage";
import DefaultIdCard from './../../class/id-card'

@Component({
    selector: 'generate-id-card',
    templateUrl: './generate-id-card.component.html',
    styleUrls: ['./generate-id-card.component.css'],
    providers: [IdCardService, ClassService, StudentService],
})

export class GenerateIdCardComponent implements OnInit {

    user
    isLoading = false

    @ViewChild('pdfTable', {static: false}) pdfTable:ElementRef;


    classList: any[] = []
    sectionList: any[] = []
    studentList: any[] = []
    studentSectionList: any[] = []
    classSectionList: any[] = []
    layoutList: any[] = []

    filteredStudentSectionList: any[] = []

    selectedClassSection: any
    selectedSection: any
    selectedLayout: any

    printMultiple: Boolean = false

    serviceAdapter: GenerateIdCardServiceAdapter

    constructor(
        public idCardService: IdCardService,
        public classService: ClassService,
        public studentService: StudentService,
    ) { }

    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();
        this.serviceAdapter = new GenerateIdCardServiceAdapter();
        this.serviceAdapter.initializeAdapter(this);
        this.serviceAdapter.initializeData();
    }

    populateClassSectionList = (classList, sectionList) => {
        this.classSectionList = [];
        classList.filter(classs => {
            sectionList.filter(section => {
                if (this.studentSectionList.find(studentSection => {
                        return studentSection.parentClass == classs.id
                            && studentSection.parentDivision == section.id;
                    }) != undefined) {
                    this.classSectionList.push({
                        'class': classs,
                        'section': section,
                        'selected': false
                    });
                }
            });
        });
    }

    getStudent = id => this.studentList.find(x => x.id===id)
    getClass = id => this.classList.find(x => x.id===id)
    getSection = id => this.sectionList.find(x => x.id===id)

    getPrintData = () => {
        return {
            user: this.user,
            studentList: this.getSelectedStudentList(),
            studentSectionList: this.filteredStudentSectionList.filter(x => x.selected),
            classList: this.classList,
            divisionList: this.sectionList,
        }
    }

    getSelectedStudentList = () => {
        let student_list = []
        this.filteredStudentSectionList.filter(x => x.selected).forEach(x => {
            student_list.push(this.getStudent(x.parentStudent))
        })
        return student_list
    }

    printIdCards = async () => {
        if(!this.filteredStudentSectionList.find(x => x.selected)){
            return alert("Select a student first!")
        }
        let card = new DefaultIdCard(this.printMultiple, {...this.selectedLayout, content: JSON.parse(this.selectedLayout.content)}, this.getPrintData())
        await card.generate()
        card.download()
    }

    selectAllClasses = () => {
        this.classSectionList.forEach(classSection => {
            classSection.selected = true;
        })
        this.handleStudentDisplay()
    }

    unselectAllClasses = () => {
        this.classSectionList.forEach(classSection => {
            classSection.selected = false;
        })
        this.handleStudentDisplay()
    }

    handleStudentDisplay = () => {
        this.filteredStudentSectionList = this.studentSectionList.filter(studentSection => {
            return this.classSectionList.find(classSection => {
                return classSection.class.id===studentSection.parentClass && classSection.section.id===studentSection.parentDivision && classSection.selected
            })
        })
        console.log(this.filteredStudentSectionList)
    }

    selectAllStudents = () => {
        this.filteredStudentSectionList.forEach(x => {
            x.selected = true
        })
    }

    clearAllStudents = () => {
        this.filteredStudentSectionList.forEach(x => {
            x.selected = false
        })
    }

}