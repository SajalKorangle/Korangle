

import {Constants} from './constants';

export class School {

    dbId = 0;
    name: string; // School Name (for sidebar)
    printName: string;
    logo: string;
    primaryThemeColor = 'red';
    secondaryThemeColor = 'danger';
    diseCode = 0;
    address = '';
    currentSessionDbId: number;
    registrationNumber: string;

    role: string;

    moduleList = [];
    studentList = [];

    fromServerObject(schoolData: any) {
        this.dbId = schoolData.dbId;
        this.name = schoolData.name;
        this.printName = schoolData.printName;
        if (Constants.DJANGO_SERVER === 'http://localhost:8000') {
            this.logo = 'http://54.174.109.85:8000' + schoolData.logo;
        } else {
            this.logo = Constants.DJANGO_SERVER + schoolData.logo;
        }
        this.primaryThemeColor = schoolData.primaryThemeColor;
        this.secondaryThemeColor = schoolData.secondaryThemeColor;
        this.diseCode = schoolData.schoolDiseCode;
        this.address = schoolData.schoolAddress;
        this.currentSessionDbId = schoolData.currentSessionDbId;
        this.registrationNumber = schoolData.registrationNumber;

        this.role = schoolData.role;

        this.moduleList = schoolData.moduleList;
        this.moduleList.forEach(module => {
            module.showTaskList = false;
        });

        this.studentList = schoolData.studentList;
        /*this.studentList.forEach(student => {
            student.showStudentList = false;
        });*/
    }

}