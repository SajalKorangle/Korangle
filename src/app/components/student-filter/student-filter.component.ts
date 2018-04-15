import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';

import { StudentExtended } from './student';

import { StudentService } from '../../students/student.service';

import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs/Observable';
import { startWith } from 'rxjs/operators/startWith';
import {map} from 'rxjs/operators/map';

@Component({
    selector: 'app-student-filter',
    templateUrl: './student-filter.component.html',
    styleUrls: ['./student-filter.component.css'],
    providers: [ StudentService ],
})

export class StudentFilterComponent implements OnInit {

    @Input() user;

    @Output() onStudentSelected = new EventEmitter<StudentExtended>();

    selectedStudent: StudentExtended;

    myControl = new FormControl();

    studentList: StudentExtended[] = [];
    filteredStudentList: Observable<Array<StudentExtended>>;

    isLoading = false;

    constructor (private studentService: StudentService) { }

    ngOnInit(): void {
        this.selectedStudent = new StudentExtended();
        this.isLoading = true;
        const data = {
            sessionDbId: this.user.schoolCurrentSessionDbId,
        };
        this.studentService.getClassSectionStudentList(data, this.user.jwt).then(
            classSectionStudentList => {
                this.isLoading = false;
                classSectionStudentList.forEach( classs => {
                    classs.sectionList.forEach( section => {
                        section.studentList.forEach( student => {
                            const tempStudent = new StudentExtended();
                            tempStudent.copy(student);
                            tempStudent.currentClassName = classs.name;
                            if (classs.sectionList.length > 1) {
                                tempStudent.currentSectionName = section.name;
                            }
                            this.studentList.push(tempStudent);
                        });
                    });
                });
                this.filteredStudentList = this.myControl.valueChanges.pipe(
                    startWith<String | StudentExtended>(''),
                    map(value => typeof value === 'string' ? value: (value as StudentExtended).name),
                    map(name => this.filter(name.toString()))
                )
            }, error => {
                this.isLoading = false;
            }
        );
    }

    filter(name: string): any {
        if (name === '') {
            return [];
        }
        return this.studentList.filter( student => student.name.toLowerCase().indexOf(name.toLowerCase()) === 0 );
    }

    displayFn(student?: StudentExtended) {
        if (student) {
            return student.name + ', ' + student.currentClassName
                + ((student.currentSectionName && student.currentSectionName !== '')? ', ' + student.currentSectionName: '');
        } else {
            return '';
        }
    }

    getStudentFeeData(student?: StudentExtended): void {
        this.onStudentSelected.emit(student);
    }

}
