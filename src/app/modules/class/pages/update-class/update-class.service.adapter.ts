
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
            this.vm.classOldService.getObjectList(this.vm.classOldService.classs, {}),
            this.vm.classOldService.getObjectList(this.vm.classOldService.division, {}),
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
            this.vm.classOldService.getObjectList(this.vm.classOldService.class_teacher_signature, request_class_teacher_signature_data),
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

            let signature_data = new FormData();
            signature_data.append('parentClass', new Blob([this.vm.selectedClassSection.class.id], {
                type: 'application/json'
            }));
            signature_data.append('parentDivision', new Blob([this.vm.selectedClassSection.section.id], {
                type: 'application/json'
            }));
            signature_data.append('parentSchool', new Blob([this.vm.user.activeSchool.dbId], {
                type: 'application/json'
            }));
            signature_data.append('signatureImage', image);

            service = this.vm.classOldService.createObject(this.vm.classOldService.class_teacher_signature, signature_data) ;

        } else {

            let signature_data = new FormData();
            signature_data.append('id', new Blob([this.vm.classTeacherSignature.id], {
                type: 'application/json'
            }));
            signature_data.append('signatureImage', image);

            service = this.vm.classOldService.partiallyUpdateObject(this.vm.classOldService.class_teacher_signature, signature_data);

        }

        service.then(value => {

            this.vm.classTeacherSignature = value;
            this.vm.isLoading = false;
            this.vm.showSignature = true;
        }, error => {
            this.vm.isLoading = false;
        });

    }

}
