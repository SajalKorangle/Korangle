export class LayoutExamColumnHandler{
    id:number = 0;
    parentLayout:number = 0;
    parentExamination:number = 0;
    orderNumber:number = 0;
    name:String; 
    maximumMarksObtainedOne:number = 100;
    maximumMarksObtainedTwo:number = 100;
    columnType:any;
    constructor(layoutExamColumn) {
        for (let k in layoutExamColumn){
            this[k] = layoutExamColumn[k];
        }
    }
}

export class LayoutSubGradeHandler{
    id:number = 0;
    parentLayoutGrade:number = 0;
    parentSubGrade:number = 0;
    orderNumber:number = 0;
    constructor(layoutSubGrade={}) {
        for (let k in layoutSubGrade){
            this[k] = layoutSubGrade[k];
        }
    }
}

export class LayoutGradeHandler{
    id:number = 0;
    parentLayout:number = 0;
    parentGrade:number = 0;
    orderNumber:number = 0;

    layoutSubGradeHandlers: LayoutSubGradeHandler[]= [];
    constructor(layoutGrade={}) {
        for (let k in layoutGrade){
            this[k] = layoutGrade[k];
        }
    }
}

export class LayoutHandler{
    id:number = 0;
    name:String = '';
    reportCardHeading:String = '';
    parentSchool:number = 0;
    parentSession:number = 0;
    showLetterHeadImage:Boolean = false;

    attendanceStartDate: Date = null;
    attendanceEndDate: Date = null;
    decimalPlaces:number = 0;

    studentNameOrderNumber:number = 0;
    fatherNameOrderNumber:number = 0;
    motherNameOrderNumber:number = 0;
    rollNoOrderNumber:number = 0;
    scholarNoOrderNumber:number = 0;
    dateOfBirthOrderNumber:number = 0;
    dateOfBirthInWordsOrderNumber:number = 0;
    aadharNumberOrderNumber:number = 0;
    categoryOrderNumber:number = 0;
    familySSMIDOrderNumber:number = 0;
    childSSMIDOrderNumber:number = 0;
    classOrderNumber:number = 0;
    sectionOrderNumber:number = 0;
    casteOrderNumber:number = 0;
    classAndSectionOrderNumber:number = 0;
    addressOrderNumber:number = 0;

    overallMarksOrderNumber:number = 0;
    attendanceOrderNumber:number = 0;
    resultOrderNumber:number = 0;
    percentageOrderNumber:number = 0;
    promotedToClassOrderNumber:number = 0;
    
    remarksOrderNumber:number = 0;

    layoutExamColumnHandlers: LayoutExamColumnHandler[] = [];
    layoutGradeHandlers: LayoutGradeHandler[] = [];

    constructor(layout) {
        for (let k in layout){
            this[k] = layout[k];
        }
    }
}

export class StudentExaminationHandler{
    studentSubjectHandlers: StudentSubjectHandler[];
}

export class StudentSubjectHandler{
    subject:number;
    marks:number;
}

export class StudentSubGradeHandler{
    subGrade:number;
    marks: String = '';
}

export class StudentGradeHandler{
    studentSubGradeHandlers: StudentSubGradeHandler[];
}


export class StudentDataHandler{
    name: String = 'DEMO';
    fathersName: String = 'Test Father';
    motherName: String = 'TEST Mother';
    scholarNumber: String = '12';
    dateOfBirth: String = '12/12/1290';
    aadharNum:number = 3688812312313;
    category: String = 'General';
    familySSMID:number = 12120123123;
    childSSMID:number = 12311267;
    caste: String = 'Hind';
    address: String = 'Gayatri Colony, Panipat';



    dateOfBirthInWords: String = 'TSETTST';
    classAndSection: String = '12 A3';

    rollNumber: String = '12312';
    class:number = 12;
    section:number = 12;
    
    overallMarks:number = 500;
    attendance: String = '500/2302';
    result: String = 'Promoted to class IX';
    percentage:number = 99.7;
    promotedToClass: String = 'PROMOTED TO CLASS IX';
    remarks: String = 'Good boi';

    
    // To be
    // subjects: String[] = [];
    // examinations: StudentExaminationHandler[] = [];
    // grades: StudentGradeHandler[] = [];
}