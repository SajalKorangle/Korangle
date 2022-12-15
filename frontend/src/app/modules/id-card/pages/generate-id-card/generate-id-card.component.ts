import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';

import { IdCardService } from '../../../../services/modules/id-card/id-card.service';

import { GenerateIdCardServiceAdapter } from './generate-id-card.service.adapter';

import { DataStorage } from '../../../../classes/data-storage';
import DefaultIdCard from './../../class/id-card';
import { GenericService } from '@services/generic/generic-service';
import { PARAMETER_LIST } from '@modules/id-card/class/constants';

@Component({
    selector: 'generate-id-card',
    templateUrl: './generate-id-card.component.html',
    styleUrls: ['./generate-id-card.component.css'],
    providers: [
        IdCardService,
        GenericService,
    ],
})
export class GenerateIdCardComponent implements OnInit {
    user;
    isLoading = false;

    parameterList = Object.assign([], PARAMETER_LIST);

    @ViewChild('pdfTable', { static: false }) pdfTable: ElementRef;

    sessionList: any[] = [];
    classList: any[] = [];
    sectionList: any[] = [];
    studentList: any[] = [];
    studentSectionList: any[] = [];
    studentParameterList: any[] = [];
    studentParameterValueList: any[] = [];
    classSectionList: any[] = [];
    layoutList: any[] = [];

    filteredStudentSectionList: any[] = [];

    isIFrameLoading = false;
    iFrameWarning = '';

    selectedClassSection: any;
    selectedSection: any;
    selectedLayout: any;

    printMultiple: Boolean = false;

    serviceAdapter: GenerateIdCardServiceAdapter;

    constructor(
        public idCardService: IdCardService,
        public genericService: GenericService
    ) {}

    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();
        this.serviceAdapter = new GenerateIdCardServiceAdapter();
        this.serviceAdapter.initializeAdapter(this);
        this.serviceAdapter.initializeData();
    }

    populateClassSectionList = (classList, sectionList) => {
        this.classSectionList = [];
        classList.filter((classs) => {
            sectionList.filter((section) => {
                if (
                    this.studentSectionList.find((studentSection) => {
                        return studentSection.parentClass == classs.id && studentSection.parentDivision == section.id;
                    }) != undefined
                ) {
                    this.classSectionList.push({
                        class: classs,
                        section: section,
                        selected: false,
                    });
                }
            });
        });
    }

    getStudent = (id) => this.studentList.find((x) => x.id === id);
    getClass = (id) => this.classList.find((x) => x.id === id);
    getSection = (id) => this.sectionList.find((x) => x.id === id);

    getPrintData = () => {
        return {
            school: this.user.activeSchool,
            studentList: this.getSelectedStudentList(),
            studentSectionList: this.filteredStudentSectionList.filter((x) => x.selected),
            studentParameterList: this.studentParameterList,
            studentParameterValueList: this.studentParameterValueList,
            classList: this.classList,
            divisionList: this.sectionList,
            sessionList: this.sessionList,
        };
    }

    getSelectedStudentList = () => {
        let student_list = [];
        this.filteredStudentSectionList
            .filter((x) => x.selected)
            .forEach((x) => {
                student_list.push(this.getStudent(x.parentStudent));
            });
        return student_list;
    }

    printIdCards = async () => {
        if (this.getSelectedStudentList().length === 0) {
            this.iFrameWarning = 'Student needs to be selected';
            return;
        }
        if (!this.selectedLayout) {
            this.iFrameWarning = 'Layout needs to be selected';
            return;
        }
        this.iFrameWarning = '';
        this.isIFrameLoading = true;
        const card = new DefaultIdCard(
            this.printMultiple,
            { ...this.selectedLayout, content: JSON.parse(this.selectedLayout.content) },
            this.getPrintData(),
            this.parameterList
        );
        await card.generate();
        document.getElementById('iFrameDisplay').setAttribute('src', card.pdf.output('bloburi'));
        this.isIFrameLoading = false;
        // card.download()
    }

    selectAllClasses = () => {
        this.classSectionList.forEach((classSection) => {
            classSection.selected = true;
        });
        this.handleStudentDisplay();
    }

    unselectAllClasses = () => {
        this.classSectionList.forEach((classSection) => {
            classSection.selected = false;
        });
        this.handleStudentDisplay();
    }

    handleStudentDisplay = () => {
        this.filteredStudentSectionList = this.studentSectionList.filter((studentSection) => {
            return this.classSectionList.find((classSection) => {
                return (
                    classSection.class.id === studentSection.parentClass &&
                    classSection.section.id === studentSection.parentDivision &&
                    classSection.selected
                );
            });
        });
    }

    selectAllStudents = () => {
        this.filteredStudentSectionList.forEach((x) => {
            x.selected = true;
        });
    }

    clearAllStudents = () => {
        this.filteredStudentSectionList.forEach((x) => {
            x.selected = false;
        });
    }
}
