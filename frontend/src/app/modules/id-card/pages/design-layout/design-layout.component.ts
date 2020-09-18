import { Component, OnInit } from '@angular/core';
import { IdCardService } from '@services/modules/id-card/id-card.service';
import { StudentService } from '@services/modules/student/student.service';
import { ClassService } from '@services/modules/class/class.service';

import { DesignLayoutServiceAdapter } from './design-layout.service.adapter';
import {DataStorage} from '../../../../classes/data-storage';

import {PARAMETER_LIST, DATA_TYPES, FIELDS, UserHandleStructure} from '@modules/id-card/class/constants';
import DefaultIdCard from '@modules/id-card/class/id-card';
import { FONT_FAMILY_LIST } from '@modules/id-card/class/font';

@Component({
    selector: 'app-design-layout',
    templateUrl: './design-layout.component.html',
    styleUrls: ['./design-layout.component.css'],
    providers: [IdCardService, StudentService, ClassService],
})

/*
For having backend user structure for text and image

Pro: if a new parameter is added we can give a default value to it very easily.
     In current approach we have to maintain as hard code in id-card.ts file.
Pro: Structure will be tightly coupled and less worry about previous version of the content.
Pro: Constant Images can be added on top of background images. In content approach the image data will be
     stored in database which can increase the database a lot once we expand this approach to other types of documents.

Con: Handling will be more difficult while updating, creating and deleting layouts
Con: If there is a radical change in handling custom designs, we might have to take down the whole structure,
     but we might have to do it anyway.
Con: As the data Type starts increasing like line, rectangle, circle, we might have to keep on adding
     the tables for each data type in backend. New data doesn't affect the content approach.
Con: Handling of tables for each data type for updation, deletion, creation.
Con: number variable like 'x' & 'y' can not hold a text value. Things will be tightly constrained.
Con: Decimal Field returns string from backend, so every field needs to be handled explicitly in id-card.ts file.
Con: 15.4 is showing as 15.400 which feels odd from aesthetic point of view.
 */

export class DesignLayoutComponent implements OnInit {

    user;

    fields = FIELDS;
    dataTypes = DATA_TYPES;
    parameterList = PARAMETER_LIST;
    fontFamilyList = FONT_FAMILY_LIST;

    idCardLayoutList: any[] = [];

    currentLayout: any;

    currentField: any;
    currentUserHandle: any;

    serviceAdapter: DesignLayoutServiceAdapter;

    ADD_LAYOUT_STRING = '<Add New Layout>';

    isLoading = false;

    backgroundImage: any;

    printMultiple = false;

    updatePDFTimerId: any;

    data: any = {
        school: null,
        studentList: [],
        studentSectionList: [],
        studentParameterList: [],
        studentParameterValueList: [],
        classList: [],
        divisionList: [],
    };


    constructor(
        public idCardService: IdCardService,
        public studentService: StudentService,
        public classService: ClassService,
    ) {}

    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();
        this.data.school = this.user.activeSchool;
        this.serviceAdapter = new DesignLayoutServiceAdapter();
        this.serviceAdapter.initializeAdapter(this);
        this.serviceAdapter.initializeData();
        this.downloadFont();
    }

    downloadFont(): void {
        this.fontFamilyList.forEach(fontFamily => {
            const newStyle = document.createElement('style');
            newStyle.appendChild(document.createTextNode(
                '@font-face {' +
                'font-family: ' + fontFamily.displayName + ';' +
                'src: url("'
                    + 'https://korangleplus.s3.amazonaws.com/'
                    + this.encodeURIComponent('assets/fonts/' +
                        fontFamily.displayName +
                        '/' + fontFamily.displayName + '-' + this.getFontStyleList(fontFamily.displayName)[0] + '.ttf')
                + '");' +
                '}'
            ));
            document.head.appendChild(newStyle);
        });
    }

    populateCurrentLayoutWithEmptyDefaultData(): void {
        this.currentLayout = {
            id: -1,
            parentSchool: this.user.activeSchool.dbId,
            name: '',
            background: this.getDefaultBackground(),
            content: [],
        };
    }

    populateCurrentLayoutWithGivenValue(value: any): void {
        if (value === this.ADD_LAYOUT_STRING) {
            this.populateCurrentLayoutWithEmptyDefaultData();
        } else {
            this.currentLayout = { ...value, content: JSON.parse(value.content) };
        }
        if (this.currentLayout.content.length > 0) {
            this.currentField = this.fields[this.getSelectedFieldKeyListInCurrentLayout()[0]];
            this.pickAndSetCurrentUserHandle();
            setTimeout(() => {
                this.updatePDF();
            }, 1);
        } else {
            this.currentField = null;
            this.currentUserHandle = null;
        }
    }

    doesCurrentLayoutHasUniqueName(): boolean {
        return this.idCardLayoutList.filter(idCardLayout => {
            return this.currentLayout.id !== idCardLayout.id
                && idCardLayout.name === this.currentLayout.name;
        }).length === 0;
    };

    resetCurrentLayout(): void {
        const layout = this.idCardLayoutList.find(item => {
            return item.id === this.currentLayout.id;
        });
        this.populateCurrentLayoutWithGivenValue(layout === undefined ? this.ADD_LAYOUT_STRING : layout);
    }

    getFieldKeyList(): any {
        return Object.keys(FIELDS);
    }

    getFilteredParameterList(field: any): any {
        return this.parameterList.filter(item => {
            return item.field.fieldStructureKey === field.fieldStructureKey;
        });
    }

    getFilteredCurrentUserHandleListByCurrentField(): any {
        return this.currentLayout.content.filter(userHandle => {
            return this.getParameter(userHandle.key).field.fieldStructureKey === this.currentField.fieldStructureKey;
        })
    }

    resetBackground(): void {
        this.currentLayout.background = this.getDefaultBackground();
    }

    getDefaultBackground(): any {
        const imageElement = <HTMLImageElement>document.getElementById('defaultBackground');
        const canvas = document.createElement('canvas');
        canvas.width = imageElement.width;
        canvas.height = imageElement.height;
        const context = canvas.getContext('2d');
        context.drawImage(imageElement, 0, 0);
        return canvas.toDataURL();
    }

    readURL(event): void {
        if (event.target.files && event.target.files[0]) {
            const image = event.target.files[0];
            if (image.type !== 'image/jpeg' && image.type !== 'image/png') {
                alert('Image type should be either jpg, jpeg, or png');
                return;
            }
            const reader = new FileReader();
            reader.onload = e => {
                this.currentLayout.background = reader.result;
                this.updatePDF();
            };
            reader.readAsDataURL(image);
        }
    }

    getParameter(key: any): any {
        return this.parameterList.find(parameter => parameter.key === key);
    }

    addToCurrentUserHandleList(parameter: any): void {
        this.currentLayout.content.push(
            UserHandleStructure.getStructure(
                parameter.key,
                parameter.dataType
            )
        );
        this.currentField = parameter.field;
        this.currentUserHandle = this.currentLayout.content[this.currentLayout.content.length - 1];
    }

    getSelectedFieldKeyListInCurrentLayout(): any {
        return Object.keys(this.fields).filter(fieldKey => {
            return this.currentLayout.content.filter(userHandleStructure => {
                return this.getParameter(userHandleStructure.key).field.fieldStructureKey === this.fields[fieldKey].fieldStructureKey;
            }).length > 0;
        });
    }

    pickAndSetCurrentUserHandle(): any {
        this.currentUserHandle = this.currentLayout.content.find(userHandleStructure => {
            return this.getParameter(userHandleStructure.key).field.fieldStructureKey === this.currentField.fieldStructureKey;
        });
    }

    deleteFromCurrentUserHandleList(userHandle: any): void {

        this.currentLayout.content = this.currentLayout.content.filter(x => x !== userHandle);

        this.currentField = null;
        this.currentUserHandle = null;

        if (this.currentLayout.content.length > 0) {
            this.updatePDF();
        }
    }

    encodeURIComponent(url: any): any {
        return encodeURIComponent(url);
    }

    getFontStyleList(fontFamilyDisplayName: any): any {
        return this.fontFamilyList.find(fontFamily => {
            return fontFamily.displayName === fontFamilyDisplayName;
        }).styleList;
    }

    debounceFunction(func, delay): void {
        clearTimeout(this.updatePDFTimerId);
        this.updatePDFTimerId = setTimeout(func, delay);
    }

    async updatePDF(delay = 2000) {

        this.debounceFunction(async () => {
            let card;
            if (!this.printMultiple) {
                const singleStudentData = {...this.data};
                singleStudentData.studentList = [singleStudentData.studentList[0]];
                card = new DefaultIdCard(this.printMultiple, this.currentLayout, singleStudentData);
            } else {
                card = new DefaultIdCard(this.printMultiple, this.currentLayout, this.data);
            }
            await card.generate();
            document.getElementById('iFrameDisplay').setAttribute('src', card.pdf.output('bloburi'));
        }, delay);

    }

}
