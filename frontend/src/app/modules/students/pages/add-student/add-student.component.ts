import { Component, Input, OnInit } from '@angular/core';

import { AddStudentServiceAdapter } from './add-student-service.adapter';

import { StudentService } from "../../../../services/modules/student/student.service";
import { Student } from "../../../../services/modules/student/models/student";
import { StudentSection } from "../../../../services/modules/student/models/student-section";
import { DataStorage } from "../../../../classes/data-storage";
import { BankService } from '../../../../services/bank.service';

import { MultipleFileDialogComponent } from '../../../../components/multiple-file-dialog/multiple-file-dialog.component';
import { ImagePdfPreviewDialogComponent } from '../../../../components/image-pdf-preview-dialog/image-pdf-preview-dialog.component';
import { MatDialog } from '@angular/material';
import { GenericService } from '@services/generic/generic-service';

declare const $: any;

@Component({
    selector: 'add-student',
    templateUrl: './add-student.component.html',
    styleUrls: ['./add-student.component.css'],
    providers: [
        StudentService,
        GenericService,
        BankService
    ],
})
export class AddStudentComponent implements OnInit {
    sessionList = [];
    nullValue = null;

    user: any;

    height = [];
    showToolTip = [];

    // From Service Adapter
    classList = [];
    sectionList = [];
    busStopList = [];
    testSecondList = []; // represents Class Test

    newStudent: Student;
    newStudentSection: StudentSection;

    profileImage;

    studentParameterList: any[] = [];
    currentStudentParameterValueList: any[] = [];

    serviceAdapter: AddStudentServiceAdapter;

    isLoading = false;

    constructor(
        public studentService: StudentService,
        public genericService: GenericService,
        public bankService: BankService,
        public dialog: MatDialog
    ) { }

    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();
        this.serviceAdapter = new AddStudentServiceAdapter();
        this.serviceAdapter.initializeAdapter(this);
        this.serviceAdapter.initializeData();
    }

    getTextHeight(textContent: string) {
        let text = document.createElement("p");
        let fileNameElement = document.getElementById('fileNameElement');
        fileNameElement.appendChild(text);

        text.innerHTML = textContent;
        text.style.font = "roboto";
        text.style.fontSize = 12 + "px";
        text.style.width = this.getWidth() + 'px';
        text.style.wordWrap = 'break-word';
        text.style.color = "#959393";
        text.style.fontWeight = "400";
        text.style.lineHeight = "18px";
        let height = Math.ceil(text.offsetHeight) + 100;
        fileNameElement.removeChild(text);
        return height;
    }

    checkToolTip(parameter) {
        let index = this.studentParameterList.indexOf(parameter);
        return this.showToolTip[index];
    }

    closeToolTip(parameter) {
        let index = this.studentParameterList.indexOf(parameter);
        this.showToolTip[index] = false;
        this.height[index] = 120;
    }

    toolTipClicked(parameter) {
        let index = this.studentParameterList.indexOf(parameter);
        if (this.showToolTip[index]) {
            this.showToolTip[index] = false;
            this.height[index] = 120;
        } else {
            this.showToolTip[index] = true;
            let fullName = this.getFullDocumentName(parameter);
            this.height[index] = this.getTextHeight(fullName);
        }
    }

    getHeight(parameter) {
        let index = this.studentParameterList.indexOf(parameter);
        return this.height[index];
    }

    getWidth() {
        let width = document.getElementById('documentElement').offsetWidth;
        width -= 145;
        return width;
    }

    initializeVariable(): void {
        this.newStudent = new Student();
        this.newStudent.parentSchool = this.user.activeSchool.dbId;

        this.newStudentSection = new StudentSection();
        this.newStudentSection.parentClass = this.classList[0].id;
        this.newStudentSection.parentDivision = this.sectionList[0].id;
        this.newStudentSection.parentSession = this.user.activeSchool.currentSessionDbId;

        this.currentStudentParameterValueList = [];
        this.profileImage = this.nullValue;
    }

    checkLength(value: any) {
        if (value && value.toString().length > 0) {
            return true;
        }
        return false;
    }

    checkRight(value: any, rightValue: number) {
        if (value && value.toString().length === rightValue) {
            return true;
        }
        return false;
    }

    policeNumberInput(event: any): boolean {
        let value = event.key;
        if (
            value !== '0' &&
            value !== '1' &&
            value !== '2' &&
            value !== '3' &&
            value !== '4' &&
            value !== '5' &&
            value !== '6' &&
            value !== '7' &&
            value !== '8' &&
            value !== '9'
        ) {
            return false;
        }
        return true;
    }

    getCurrentSessionName(): string {
        return this.sessionList.find((session) => {
            return session.id == this.user.activeSchool.currentSessionDbId;
        }).name;
    }

    getSection(sectionId: number): any {
        return this.sectionList.find((section) => {
            return this.newStudentSection.parentDivision == section.id;
        });
    }

    isMobile(): boolean {
        if (window.innerWidth > 991) {
            return false;
        }
        return true;
    }

    getParameterValue = (parameter) => {
        try {
            return this.currentStudentParameterValueList.find((x) => x.parentStudentParameter === parameter.id).value;
        } catch {
            return this.nullValue;
        }
    }

    updateParameterValue = (parameter, value) => {
        let item = this.currentStudentParameterValueList.find((x) => x.parentStudentParameter === parameter.id);
        if (!item) {
            item = { parentStudentParameter: parameter.id, value: value };
            this.currentStudentParameterValueList.push(item);
        } else {
            item.value = value;
        }
    }

    deleteDocument(parameter) {
        if (confirm('Are you sure want to delete this document?')) {
            let item = this.currentStudentParameterValueList.find((x) => x.parentStudentParameter === parameter.id);
            if (item) {
                this.currentStudentParameterValueList = this.currentStudentParameterValueList.filter(
                    (para) => para.parentStudentParameter !== item.parentStudentParameter
                );
            }
        }
    }

    getParameterDocumentType(parameter) {
        try {
            let document_value = this.currentStudentParameterValueList.find((x) => x.parentStudentParameter === parameter.id)
                .document_value;
            if (document_value) {
                let document_name = this.currentStudentParameterValueList.find((x) => x.parentStudentParameter === parameter.id)
                    .document_name;
                let urlList = document_name.split('.');
                let type = urlList[urlList.length - 1];
                if (type == 'pdf') {
                    return 'pdf';
                } else {
                    return 'img';
                }
            } else {
                return 'none';
            }
        } catch {
            return 'none';
        }
    }

    getParameterDocumentValue(parameter) {
        try {
            let document_value = this.currentStudentParameterValueList.find((x) => x.parentStudentParameter === parameter.id)
                .document_value;
            if (document_value) {
                return document_value;
            } else {
                return this.nullValue;
            }
        } catch {
            return this.nullValue;
        }
    }

    check_document(value): boolean {
        let type = value.type;
        if (type !== 'image/jpeg' && type !== 'image/jpg' && type !== 'image/png' && type != 'application/pdf') {
            alert('Uploaded File should be either in jpg,jpeg,png or in pdf format');
            return false;
        } else {
            if (value.size / 1000000.0 > 5) {
                alert('File size should not exceed 5MB');
                return false;
            } else {
                return true;
            }
        }
    }

    getShortenName(document_name) {
        let nameList = document_name.split(".");
        let name = "";
        for (let i = 0; i < nameList.length - 1; i++) {
            name += nameList[i];
        }

        if (name.length > 20) {
            name = name.substr(0, 20);
            name += "...";
        }
        name += ('.' + nameList[nameList.length - 1]);
        return name;
    }

    getFullDocumentName(parameter) {
        let item = this.currentStudentParameterValueList.find((x) => x.parentStudentParameter === parameter.id);
        if (item) {
            if (item.document_name) {
                return item.document_name;
            }
        }
    }

    getDocumentName(parameter) {
        let item = this.currentStudentParameterValueList.find(x => x.parentStudentParameter === parameter.id);
        if (item) {
            if (item.document_name) {
                let document_name = this.getShortenName(item.document_name);
                return document_name;
            }
        }
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

                if (sw > (aspectRatio[1] * sh) / aspectRatio[0]) {
                    sx = (sw - (aspectRatio[1] * sh) / aspectRatio[0]) / 2;
                    sw = (aspectRatio[1] * sh) / aspectRatio[0];
                    dw = sw;
                } else if (sh > (aspectRatio[0] * sw) / aspectRatio[1]) {
                    sy = (sh - (aspectRatio[0] * sw) / aspectRatio[1]) / 2;
                    sh = (aspectRatio[0] * sw) / aspectRatio[1];
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

    async onImageSelect(evt: any) {
        let image = evt.target.files[0];

        if (image.type !== 'image/jpeg' && image.type !== 'image/png') {
            alert('Image type should be either jpg, jpeg, or png');
            return;
        }

        image = await this.cropImage(image, [1, 1]);

        while (image.size > 512000) {
            image = await this.resizeImage(image);
        }

        if (image.size > 512000) {
            alert('Image size should be less than 512kb');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            this.profileImage = reader.result;
        };
        reader.readAsDataURL(image);
    }

    resizeImage(file: File): Promise<Blob> {
        return new Promise((resolve, reject) => {
            let image = new Image();
            image.src = URL.createObjectURL(file);
            image.onload = () => {
                let width = image.width;
                let height = image.height;

                let maxWidth = image.width / 2;
                let maxHeight = image.height / 2;

                // if (width <= maxWidth && height <= maxHeight) {
                //     resolve(file);
                // }

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

    updateDocuments = (parameter, value, element) => {
        console.log('yeah');
        const options = this.studentParameterList.filter((parameter) => parameter.parameterType == 'DOCUMENT');
        if (value.target.files.length > 1) {
            if (value.target.files.length <= options.length) {
                let files = [];
                for (let i = 0; i < value.target.files.length; i++) {
                    if (this.check_document(value.target.files[i])) {
                        files.push(value.target.files[i]);
                    }
                }
                if (files.length) {
                    let choiceList = [];
                    options.forEach((x) => choiceList.push({ name: x.name, id: x.id }));
                    console.log(choiceList);
                    let dialogRef = this.dialog.open(MultipleFileDialogComponent, {
                        width: '580px',
                        data: { files: files, options: options, choiceList: choiceList },
                    });
                    dialogRef.afterClosed().subscribe((result) => {
                        if (result) {
                            for (let i = 0; i < result.files.length; i++) {
                                let item = options.find((x) => x.id === result.list[i].id);
                                if (item) {
                                    this.updateDocumentValue(item, result.files[i]);
                                }
                            }
                        }
                    });
                }
            } else {
                console.log('Please select only ' + value.target.files.length + ' files');
            }
        } else {
            let check = this.check_document(value.target.files[0]);
            if (check == true) {
                this.updateDocumentValue(parameter, value.target.files[0]);
            }
        }
        element.value = '';
    }

    updateDocumentValue = (parameter, file) => {
        let item = this.currentStudentParameterValueList.find((x) => x.parentStudentParameter === parameter.id);
        let document_value = file;
        let document_size = document_value.size;
        let document_name = document_value.name;
        const reader = new FileReader();
        reader.onload = (e) => {
            document_value = reader.result;
            if (!item) {
                item = {
                    parentStudentParameter: parameter.id,
                    document_value: document_value,
                    document_name: document_name,
                    document_size: document_size,
                };
                this.currentStudentParameterValueList.push(item);
            } else {
                item.document_value = document_value;
                item.document_name = document_name;
            }
        };
        reader.readAsDataURL(document_value);
    }

    dragEnter(value) {
        $('.dropinput').css({ 'z-index': '6' });
        $(value.path[1]).css({ background: 'rgba(182, 224, 184, 0.1)', border: '1px dashed #7db580' });
    }

    onDrop(value) {
        $('.dropinput').css({ 'z-index': '-1' });
        $(value.path[1]).css({ background: '', border: '' });
    }

    dragLeave(value) {
        $(value.path[1]).css({ background: '', border: '' });
    }

    openFilePreviewDialog(parameter): void {
        let type = this.getParameterDocumentType(parameter);
        let file = this.getParameterDocumentValue(parameter);
        const dialogRef = this.dialog.open(ImagePdfPreviewDialogComponent, {
            width: '600px',
            data: { file: file, type: type },
        });
        dialogRef.afterClosed().subscribe((result) => {
            console.log('The dialog was closed');
        });
    }
}
