import { UpdateViaExcelComponent } from './update-via-excel.component';

export class UpdateViaExcelServiceAdapter{
    vm: UpdateViaExcelComponent;

    constructor() { }
    
    initializeAdapter (vm: UpdateViaExcelComponent): void {
        this.vm = vm
    }

    initializeData(): void {
        this.vm.isLoading = true;

        let student_section_data = {
            'parentStudent__parentTransferCertificate': 'null__korangle',
            'parentStudent__parentSchool': this.vm.user.activeSchool.dbId,
            'parentSession': this.vm.user.activeSchool.currentSessionDbId,
        };

        Promise.all([
            this.vm.studentService.getObjectList(this.vm.studentService.student_section, student_section_data),
            this.vm.classService.getObjectList(this.vm.classService.classs,{}),
            this.vm.classService.getObjectList(this.vm.classService.division,{}),
        ]).then(value => {
            console.log('update via excel adapter data: ', value);
            this.vm.classList = value[1];
            this.vm.divisionList = value[2];
            
            //structuring for student's class and division
            this.vm.structuringForStudents(value[1].map(el => el.id), value[2].map(el => el.id));

            let student_data = {
                'id__in': value[0].map(ss => ss.parentStudent),
                'fields__korangle': 'id,name,fathersName',
            };
            
            Promise.all([
                this.vm.studentService.getObjectList(this.vm.studentService.student, student_data)
            ]).then(value2 => { 
                console.log('student data: ', value2[0]);

                value[0].forEach(ss => {
                    ss['student'] = value2[0].find(student=> student.id === ss.parentStudent)
                });

                //Populate Students
                this.vm.populateStudents(value[0]);

                this.vm.isLoading = false;
            })
        }, error => {
                console.log(error);
                this.vm.isLoading = false;
        });

    }
}