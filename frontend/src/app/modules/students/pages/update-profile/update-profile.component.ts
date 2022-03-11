import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';

import { UpdateProfileServiceAdapter } from './update-profile.service.adapter';
import { UpdateProfileHtmlRenderer } from './update-profile.html.renderer';

import { StudentService } from '../../../../services/modules/student/student.service';
import { SchoolService } from '../../../../services/modules/school/school.service';
import { DataStorage } from '../../../../classes/data-storage';
import { CommonFunctions } from '../../../../classes/common-functions';

import { MatDialog } from '@angular/material';
import { MultipleFileDialogComponent } from '../../../../components/multiple-file-dialog/multiple-file-dialog.component';
import { ViewImageModalComponent } from '@components/view-image-modal/view-image-modal.component';

declare const $: any;

@Component({
    selector: 'update-profile',
    templateUrl: './update-profile.component.html',
    styleUrls: ['./update-profile.component.css'],
    providers: [SchoolService, StudentService],
})
export class UpdateProfileComponent implements OnInit {
    user;

    NULL_CONSTANT = null;

    selectedStudent: any;

    currentStudent: any;

    busStopList = [];

    isStudentListLoading = false;
    isLoading = false;

    selectedStudentSection: any;
    currentStudentSection: any;

    classList: any;
    sectionList: any;
    sessionList: any = [];

    studentList: any;
    studentSectionList: any;
    studentParameterList: any[] = [];
    studentParameterValueList: any[] = [];
    currentStudentParameterValueList: any[] = [];

    deleteList: any[] = [];
    profileImage = null;

    htmlRenderer: UpdateProfileHtmlRenderer;
    serviceAdapter: UpdateProfileServiceAdapter;

    commonFunctions: CommonFunctions;

    constructor(public studentService: StudentService, public schoolService: SchoolService, public dialog: MatDialog) { }

    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();
        this.commonFunctions = CommonFunctions.getInstance();
        this.serviceAdapter = new UpdateProfileServiceAdapter();
        this.serviceAdapter.initializeAdapter(this);
        this.serviceAdapter.initializeData();
        this.deleteList = [];
        this.profileImage = this.NULL_CONSTANT;

        this.htmlRenderer = new UpdateProfileHtmlRenderer();
        this.htmlRenderer.initializeRenderer(this);
    }

    handleDetailsFromParentStudentFilter(value): void {
        this.classList = value['classList'];
        this.sectionList = value['sectionList'];
    }

    handleStudentListSelection(value): void {
        this.selectedStudent = value[0][0];
        this.selectedStudentSection = value[1][0];
        this.serviceAdapter.getStudentProfile(this.selectedStudent.id);
    }

    updateParameterValue = (parameter, value) => {
        let item = this.currentStudentParameterValueList.find((x) => x.parentStudentParameter === parameter.id);
        if (!item) {
            item = { parentStudent: this.currentStudent.id, parentStudentParameter: parameter.id, value: value };
            this.currentStudentParameterValueList.push(item);
        } else {
            item.value = value;
        }
    }

    getBusStopName(busStopDbId: any) {
        let stopName = 'None';
        if (busStopDbId !== null) {
            this.busStopList.forEach((busStop) => {
                if (busStop.id == busStopDbId) {
                    stopName = busStop.stopName;
                    console.log(stopName);
                    return;
                }
            });
        }
        return stopName;
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

        if (image.type !== 'image/jpeg' && image.type !== 'image/png' && image.type !== 'image/jpg') {
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
            this.selectedStudent.profileImage = reader.result;
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

    getParameterDocumentValue(parameter) {
        try {
            let document_value = this.currentStudentParameterValueList.find((x) => x.parentStudentParameter === parameter.id)
                .document_value;
            if (document_value) {
                return document_value;
            } else {
                return null;
            }
        } catch {
            return null;
        }
    }

    deleteDocument(parameter) {
        if (confirm('Are you sure want to delete this document?')) {
            let item = this.currentStudentParameterValueList.find((x) => x.parentStudentParameter === parameter.id);
            if (item) {
                if (item.id) {
                    this.deleteList.push(item);
                }
                this.currentStudentParameterValueList = this.currentStudentParameterValueList.filter(
                    (para) => para.parentStudentParameter !== item.parentStudentParameter
                );
            }
        }
    }

    resetDocument(parameter) {
        if (confirm('Are you sure want to reset this document?')) {
            let item = this.currentStudentParameterValueList.find((x) => x.parentStudentParameter === parameter.id);
            let old_item = this.studentParameterValueList.find((x) => x.parentStudentParameter === parameter.id);
            if (item) {
                if (old_item) {
                    item.id = old_item.id;
                    item.document_value = old_item.document_value;
                    item.document_size = old_item.document_size;
                    item.document_name = old_item.document_name;
                    this.deleteList = this.deleteList.filter((x) => x.id !== old_item.id);
                } else {
                    this.currentStudentParameterValueList = this.currentStudentParameterValueList.filter(
                        (para) => para.parentStudentParameter !== item.parentStudentParameter
                    );
                }
            } else if (old_item) {
                item = {
                    id: old_item.id,
                    parentStudentParameter: parameter.id,
                    document_value: old_item.document_value,
                    document_name: old_item.document_name,
                    document_size: old_item.document_size,
                };
                this.currentStudentParameterValueList.push(item);
                this.deleteList = this.deleteList.filter((x) => x.id !== old_item.id);
            }
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
            } else if (value.name.length > 100) {
                alert('File name should not exceed 100 characters');
                return false;
            } else {
                return true;
            }
        }
    }

    getDocumentName(parameter) {
        let item = this.currentStudentParameterValueList.find((x) => x.parentStudentParameter === parameter.id);
        if (item) {
            if (item.document_name) {
                return item.document_name;
            } else {
                let document_name = item.document_value.split('/');
                document_name = document_name[document_name.length - 1];
                return document_name.substring(document_name.indexOf('_') + 1, document_name.length);
            }
        }
    }

    updateDocuments = (parameter, value, element) => {
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
        let inDeletedList = this.deleteList.find((x) => x.parentStudentParameter === parameter.id);
        let document_value = file;
        let document_size = document_value.size;
        let document_name = document_value.name;
        const reader = new FileReader();
        reader.onload = (e) => {
            document_value = reader.result;
            if (!item && !inDeletedList) {
                item = {
                    parentStudentParameter: parameter.id,
                    document_value: document_value,
                    document_name: document_name,
                    document_size: document_size,
                };
                this.currentStudentParameterValueList.push(item);
            } else if (inDeletedList) {
                this.deleteList = this.deleteList.filter((x) => x.id !== inDeletedList.id);
                console.log(this.deleteList);
                let Item = {
                    id: inDeletedList.id,
                    parentStudentParameter: inDeletedList.parentStudentParameter,
                    document_value: document_value,
                    document_name: document_name,
                    document_size: document_size,
                };
                console.log(Item);
                this.currentStudentParameterValueList.push(Item);
            } else {
                item.document_value = document_value;
                item.document_name = document_name;
                item.document_size = document_size;
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
        if (this.htmlRenderer.getParameterDocumentType(parameter) != 'none') {
            let type = this.htmlRenderer.getParameterDocumentType(parameter);
            let file = this.getParameterDocumentValue(parameter);
            let dummyImageList = [];
            if (type == 'img') {
                let data = { imageUrl: file };
                dummyImageList.push(data);
            }
            const dialogRef = this.dialog.open(ViewImageModalComponent, {
                maxWidth: '100vw',
                maxHeight: '100vh',
                height: '100%',
                width: '100%',
                data: { imageList: dummyImageList, file: file, index: 0, type: 1, fileType: type, isMobile: this.htmlRenderer.isMobile() },
            });
            dialogRef.afterClosed().subscribe((result) => {
                console.log('The dialog was closed');
            });
        }
    }

    resizeContainer(element: any): void {
        let docText = element.parentElement;
        let docContainer = docText.parentElement.parentElement;
        if (docContainer && docText) {
            let textHeight = docText.clientHeight + 26;
            if (textHeight > 120) {
                docContainer.style.height = textHeight + 'px';
            } else {
                docContainer.style.height = '120px';
            }
        }
    }
}
