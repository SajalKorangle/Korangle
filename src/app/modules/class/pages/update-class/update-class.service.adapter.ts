
import {UpdateClassComponent} from './update-class.component';

export class UpdateClassServiceAdapter {

    vm: UpdateClassComponent;

    constructor() {}

    // Data
    classList: any;
    sectionList: any;
    studentSectionList: any;

    initializeAdapter(vm: UpdateClassComponent): void {
        this.vm = vm;
    }

    copyObject(object: any): any {
        let tempObject = {};
        Object.keys(object).forEach(key => {
            tempObject[key] = object[key];
        });
        return tempObject;
    }

    initializeData(): void {

        let request_student_section_data = {
            'parentStudent__parentTransferCertificate': 'null__korangle',
            'parentStudent__parentSchool': this.vm.user.activeSchool.dbId,
            'parentSession': this.vm.user.activeSchool.currentSessionDbId,
        };

        this.vm.isInitialLoading = true;

        Promise.all([
            this.vm.classService.getObjectList(this.vm.classService.classs, {}),
            this.vm.classService.getObjectList(this.vm.classService.division, {}),
            this.vm.studentService.getObjectList(this.vm.studentService.student_section, request_student_section_data),
        ]).then(value => {

            this.classList = value[0];
            this.sectionList = value[1];
            this.studentSectionList = value[2];

            this.populateClassSectionList();

            this.vm.isInitialLoading = false;

        }, error => {
            this.vm.isInitialLoading = false;
        })

        /*this.vm.isLoading = true;

        let report_card_mapping_data = {
            'parentSchool': this.vm.user.activeSchool.dbId,
            'parentSession': this.vm.user.activeSchool.currentSessionDbId,
        };

        let student_section_data = {
            'parentStudent__parentTransferCertificate': 'null__korangle',
            'parentStudent__parentSchool': this.vm.user.activeSchool.dbId,
            'parentSession': this.vm.user.activeSchool.currentSessionDbId,
        };

        Promise.all([
            this.vm.reportCardCbseService.getObjectList(this.vm.reportCardCbseService.report_card_mapping, report_card_mapping_data),
            this.vm.studentService.getObjectList(this.vm.studentService.student_section, student_section_data),
            this.vm.classService.getObjectList(this.vm.classService.classs, ''),
            this.vm.classService.getObjectList(this.vm.classService.division, ''),
        ]).then(value => {

            if (value[0].length > 0 || value[1].length > 0) {

                this.vm.reportCardMappingList = value[0];
                this.vm.studentSectionList = value[1];

                let student_data = {
                    'id__in': this.vm.studentSectionList.map(a => a.parentStudent),
                };

                Promise.all([
                    this.vm.studentService.getObjectList(this.vm.studentService.student, student_data),
                ]).then(value2 => {

                    let examination_data = this.getExaminationIdList();

                    Promise.all([
                        this.vm.reportCardCbseService.getObjectList(this.vm.reportCardCbseService.term, ''),
                        this.vm.reportCardCbseService.getObjectList(this.vm.reportCardCbseService.extra_field, ''),
                        this.vm.examinationService.getObjectList(this.vm.examinationService.examination, examination_data),
                        this.vm.subjectService.getObjectList(this.vm.subjectService.subject, {}),
                    ]).then(value3 => {

                        this.vm.termList = value3[0];
                        this.vm.extraFieldList = value3[1];
                        this.vm.examinationList = value3[2];
                        this.vm.subjectList = value3[3];

                    });

                    this.vm.studentSectionList.forEach(studentSection => {
                        studentSection['student'] = value2[0].find(student => {
                            return student.id == studentSection.parentStudent;
                        });
                        studentSection['selected'] = false;
                    });

                    this.vm.isLoading = false;
                }, error => {
                    this.vm.isLoading = false;
                });

                this.vm.classSectionList = [];
                value[2].filter(classs => {
                    value[3].filter(section => {
                        if (this.vm.studentSectionList.find(studentSection => {
                                return studentSection.parentClass == classs.id
                                    && studentSection.parentDivision == section.id;
                            }) != undefined) {
                            this.vm.classSectionList.push({
                                'class': classs,
                                'section': section,
                                'selected': false,
                            });
                        }
                    });
                });

            } else {
                this.vm.isLoading = false;
            }

        }, error => {
            this.vm.isLoading = false;
        });*/

    }

    populateClassSectionList(): void {

        this.classList.forEach(classs => {
            this.sectionList.forEach(section => {
                if(this.studentSectionList.find(studentSection => {
                        return studentSection.parentClass == classs.id
                            && studentSection.parentDivision == section.id;
                    }) != undefined) {
                    this.vm.classSectionList.push({
                        'class': classs,
                        'section': section,
                    });
                }
            });
        });

        if (this.vm.classSectionList.length > 0) {
            this.vm.selectedClassSection = this.vm.classSectionList[0];
        }

    }

    getClassTeacherSignature(): void {

        let request_class_teacher_signature_data = {
            'parentClass': this.vm.selectedClassSection.class.id,
            'parentDivision': this.vm.selectedClassSection.section.id,
            'parentSchool': this.vm.user.activeSchool.dbId,
        };

        this.vm.isLoading = true;

        this.vm.classTeacherSignature = null;

        Promise.all([
            this.vm.classService.getObjectList(this.vm.classService.class_teacher_signature, request_class_teacher_signature_data),
        ]).then(value => {

            if (value[0].length > 0) {
                this.vm.classTeacherSignature = value[0][0];
            }

            this.vm.isLoading = false;

            this.vm.showSignature = true;

        }, error => {
            this.vm.isLoading = false;
        });

    }

    resizeImage(file:File, ratio: any): Promise<Blob> {
        return new Promise((resolve, reject) => {
            let image = new Image();
            image.src = URL.createObjectURL(file);
            image.onload = () => {
                let width = image.width;
                let height = image.height;

                let maxWidth = image.width/ratio;
                let maxHeight = image.height/ratio;

                let newWidth;
                let newHeight;

                if (width > height) {
                    newHeight = height * (maxWidth / width);
                    newWidth = maxWidth;
                } else {
                    newWidth = width * (maxHeight / height);
                    newHeight = maxHeight;
                }

                let canvas = document.createElement('canvas');
                canvas.width = newWidth;
                canvas.height = newHeight;

                let context = canvas.getContext('2d');

                context.drawImage(image, 0, 0, newWidth, newHeight);

                canvas.toBlob(resolve, file.type);
            };
            image.onerror = reject;
        });
    }

    cropImage(file: File, aspectRatio: any): Promise<Blob> {
        return new Promise((resolve, reject) => {
            let image = new Image();
            image.src = URL.createObjectURL(file);
            image.onload = () => {

                let dx = 0;
                let dy = 0;
                let dw = image.width;
                let dh = image.height;

                let sx = 0;
                let sy = 0;
                let sw = dw;
                let sh = dh;

                if (sw > (aspectRatio[1]*sh/aspectRatio[0])) {
                    sx = (sw - (aspectRatio[1]*sh/aspectRatio[0]))/2;
                    sw = (aspectRatio[1]*sh/aspectRatio[0]);
                    dw = sw;
                } else if (sh > (aspectRatio[0]*sw/aspectRatio[1])) {
                    sy = (sh - (aspectRatio[0]*sw/aspectRatio[1]))/2;
                    sh = (aspectRatio[0]*sw/aspectRatio[1]);
                    dh = sh;
                }

                let canvas = document.createElement('canvas');
                canvas.width = dw;
                canvas.height = dh;

                let context = canvas.getContext('2d');

                context.drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh);

                canvas.toBlob(resolve, file.type);
            };
            image.onerror = reject;
        });
    }

    async onSignatureImageSelect(evt: any) {

        let image = evt.target.files[0];

        if (image.type !== 'image/jpeg' && image.type !== 'image/png') {
            alert("Image type should be either jpg, jpeg, or png");
            return;
        }

        image = await this.cropImage(image, [1,2]);

        while (image.size > 128000) {
            image = await this.resizeImage(image, 1.5);
        }

        this.vm.isLoading = true;

        let service: any;

        if (!this.vm.classTeacherSignature) {

            // let signature_data = new FormData();
            // signature_data.append('parentClass', this.vm.selectedClassSection.class.id);
            // signature_data.append('parentDivision', this.vm.selectedClassSection.section.id);
            // signature_data.append('parentSchool', this.vm.user.activeSchool.dbId);
            // signature_data.append('signatureImage', image);
            let signature_data = {
                parentClass: this.vm.selectedClassSection.class.id,
                parentDivision: this.vm.selectedClassSection.section.id,
                parentSchool: this.vm.user.activeSchool.dbId,
                signatureImage: image,
            };

            service = this.vm.classService.createObject(this.vm.classService.class_teacher_signature, signature_data) ;

        } else {

            // let signature_data = new FormData();
            // signature_data.append('id', this.vm.classTeacherSignature.id);
            // signature_data.append('signatureImage', image);

            let signature_data = {
                id: this.vm.classTeacherSignature.id,
                signatureImage: image,
            };

            service = this.vm.classService.partiallyUpdateObject(this.vm.classService.class_teacher_signature, signature_data);

        }

        service.then(value => {

            this.vm.classTeacherSignature = value;
            this.vm.isLoading = false;
            this.vm.showSignature = true;
        }, error => {
            this.vm.isLoading = false;
        });

        /*this.schoolOldService.uploadPrincipalSignatureImage(image, data, this.user.jwt).then( response => {
            this.isLoading = false;
            alert('Principal\'s signature uploaded Successfully');
            if (response.status === 'success') {
                this.user.activeSchool.principalSignatureImage = response.url;
            }
        }, error => {
            this.isLoading = false;
        });*/

    }

}
