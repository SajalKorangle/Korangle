import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DataStorage } from '../../../../classes/data-storage';
import { FONT_FAMILY_LIST } from '@modules/report-card-3/class/font';

import { DesignReportCardServiceAdapter } from './design-report-card.service.adapter';

import { ReportCardService } from '@services/modules/report-card/report-card.service';
import { ClassService } from '@services/modules/class/class.service';
import { ExaminationService } from '@services/modules/examination/examination.service';
import { SubjectService } from '@services/modules/subject/subject.service';
import { SchoolService } from '@services/modules/school/school.service';
import { GenericService } from '@services/generic/generic-service';
import { AttendanceService } from '@services/modules/attendance/attendance.service';
import { GradeService } from '@services/modules/grade/grade.service';

import { DesignReportCardHtmlAdapter } from './design-report-card.html.adapter';
import { DesignReportCardCanvasAdapter } from './design-report-card.canvas.adapter';

import { Layer, DATA_SOUCE_TYPE } from './../../class/constants_3';

@Component({
    selector: 'app-design-report-card',
    templateUrl: './design-report-card.component.html',
    styleUrls: ['./design-report-card.component.css'],
    providers: [
        ReportCardService,
        ClassService,
        ExaminationService,
        SubjectService,
        SchoolService,
        GenericService,
        AttendanceService,
        GradeService,
        MatDialog,
    ],
})
export class DesignReportCardComponent implements OnInit, OnDestroy {
    user: any;
    canvas: any;

    currentLayout: { id?: any; parentSchool: string; name: string; thumbnail?: string; publiclyShared: boolean; content: any; };

    ADD_LAYOUT_STRING = '<Add New Layout>';

    // stores the layour list from backend, new layout or modified layout is added to this list only after saving to backend
    reportCardLayoutList: {
        id?: any;
        parentSchool: string;
        name: string;
        thumbnail?: string;
        publiclyShared: boolean;
        content: any;
    }[] = [];
    layoutSharingData: { [key: number]: any; } = {};
    publicLayoutList: { id?: any; parentSchool: string; name: string; thumbnail?: string; publiclyShared: boolean; content: any; }[] = [];
    sharedLayoutList: { id?: any; parentSchool: string; name: string; thumbnail?: string; publiclyShared: boolean; content: any; }[] = [];

    fontFamilyList = FONT_FAMILY_LIST;

    unuploadedFiles: { string: string; }[] = []; // Local urls of files to be uploaded, format [{file_uri : file_name},...]

    serviceAdapter: DesignReportCardServiceAdapter;
    htmlAdapter: DesignReportCardHtmlAdapter = new DesignReportCardHtmlAdapter();
    canvasAdapter: DesignReportCardCanvasAdapter;

    DATA: {
        studentId: number;
        currentSession: number;
        data: {
            school: any;
            studentList: any[];
            studentSectionList: any[];
            studentParameterList: any[];
            studentParameterValueList: any[];
            classList: any[];
            divisionList: any[];
            examinationList: any[];
            testList: any[];
            studentTestList: any[];
            subjectList: any[];
            attendanceList: any[];
            sessionList: any[];
            gradeList: any[];
            subGradeList: any[];
            studentSubGradeList: any[];
            studentExaminationRemarksList: any[];
            classSectionSignatureList: any[];
        };
    } = {
            studentId: null,
            currentSession: null,
            data: {
                school: null,
                studentList: [],
                studentSectionList: [],
                studentParameterList: [],
                studentParameterValueList: [],
                classList: [],
                divisionList: [],
                examinationList: [],
                testList: [],
                studentTestList: [],
                subjectList: [],
                attendanceList: [],
                sessionList: [],
                gradeList: [],
                subGradeList: [],
                studentSubGradeList: [],
                studentExaminationRemarksList: [],
                classSectionSignatureList: [],
            },
        };

    selectedStudent: any;

    constructor(
        public reportCardService: ReportCardService,
        public classService: ClassService,
        public examinationService: ExaminationService,
        public subjectService: SubjectService,
        public schoolService: SchoolService,
        public genericService: GenericService,
        public attendanceService: AttendanceService,
        public gradeService: GradeService,
        public dialog: MatDialog
    ) { }

    ngOnInit() {
        this.user = DataStorage.getInstance().getUser();
        this.DATA.data.school = this.user.activeSchool;

        this.serviceAdapter = new DesignReportCardServiceAdapter();
        this.serviceAdapter.initializeAdapter(this);
        this.serviceAdapter.initializeData();

        this.canvasAdapter = new DesignReportCardCanvasAdapter();
        this.canvasAdapter.initilizeAdapter(this);

        this.htmlAdapter.initializeAdapter(this);
        this.populateCurrentLayoutWithGivenValue(this.ADD_LAYOUT_STRING);

        this.downloadFont();
        // console.log('DATA: ', this.DATA);
    }

    ngOnDestroy() {
        this.canvasAdapter.destructor();
        let canavsWrapper = document.getElementById('mainCanvas');
        if (canavsWrapper) canavsWrapper.parentNode.removeChild(canavsWrapper);
    }

    handleStudentListSelection(value): void {
        this.selectedStudent = value[0][0];
        let temp = this.DATA.data.studentList.find((student) => student.id == this.selectedStudent.id);
        if (temp == undefined) {
            this.serviceAdapter.loadSelectedStudent();
        } else {
            this.DATA.studentId = this.selectedStudent.id;
            this.canvasAdapter.fullCanavsRefresh();
        }
    }

    getFontStyleList(fontFamilyDisplayName: any): any {
        return this.fontFamilyList.find((fontFamily) => {
            return fontFamily.displayName === fontFamilyDisplayName;
        }).styleList;
    }

    downloadFont(): void {
        this.fontFamilyList.forEach((fontFamily) => {
            const newStyle = document.createElement('style');
            fontFamily.styleList.forEach((style) => {
                let fontStyle = '',
                    fontWeight = '';
                switch (style) {
                    case 'Bold':
                        fontWeight = 'font-weight: bold;';
                        break;
                    case 'Italic':
                        fontStyle = 'font-style: italic;';
                        break;
                    case 'BoldItalic':
                        fontWeight = 'font-weight: bold;';
                        fontStyle = 'font-style: italic;';
                }
                newStyle.appendChild(
                    document.createTextNode(
                        '@font-face {' +
                        'font-family: ' +
                        fontFamily.displayName +
                        ';' +
                        'src: url("' +
                        'https://korangleplus.s3.amazonaws.com/' +
                        this.encodeURIComponent(
                            'assets/fonts/' + fontFamily.displayName + '/' + fontFamily.displayName + '-' + style + '.ttf'
                        ) +
                        '");' +
                        fontStyle +
                        fontWeight +
                        '}'
                    )
                );
                document.head.appendChild(newStyle);
            });
        });
    }

    encodeURIComponent(url: any): any {
        return encodeURIComponent(url);
    }

    newLayout(): void {
        // populating current layout to empty vaues and current activeSchool ID
        this.currentLayout = {
            parentSchool: this.user.activeSchool.dbId,
            name: '',
            thumbnail: null,
            publiclyShared: false,
            content: this.canvasAdapter.getEmptyLayout(),
        };
    }

    populateCurrentLayoutWithGivenValue(value: any, alreadyParsed: boolean = false, forceUpdate: boolean = false): void {
        if (
            !forceUpdate &&
            !this.isLayoutSaved() &&
            !window.confirm('Current Layout is not saved. To save cancel and save current layout.')
        ) {
            return;
        }
        if (!this.canvas) {
            let mainCanavs = document.getElementById('mainCanvas');
            if (mainCanavs) {
                this.canvas = mainCanavs;
                this.canvasAdapter.initilizeCanvas(this.canvas);
                this.htmlAdapter.canvasSetUp();
            } else {
                // if canvs is not already rendered subscribe to mutations while canvas is rendered
                let observer = new MutationObserver((mutations, me) => {
                    let canvas = document.getElementById('mainCanvas');
                    if (canvas) {
                        this.canvas = canvas;
                        this.canvasAdapter.initilizeCanvas(this.canvas);
                        this.htmlAdapter.canvasSetUp();
                        this.canvasAdapter.loadData(this.currentLayout.content[0]);
                        me.disconnect();
                    }
                });
                observer.observe(document, {
                    childList: true,
                    subtree: true,
                });
            }
        }

        if (value === this.ADD_LAYOUT_STRING) {
            this.newLayout();
        } else {
            if (alreadyParsed) {
                this.currentLayout = { ...value };
            } else {
                this.currentLayout = { ...value, content: JSON.parse(value.content) };
            }
        }
        if (this.canvas) this.canvasAdapter.loadData(this.currentLayout.content[0]);
    }

    doesCurrentLayoutHasUniqueName(): boolean {
        return (
            this.currentLayout.name.trim() != '' &&
            this.reportCardLayoutList.filter((reportCardLayout) => {
                return this.currentLayout.id !== reportCardLayout.id && reportCardLayout.name === this.currentLayout.name;
            }).length === 0
        );
    }

    imageUploadHandler(event: any): void {
        const uploadedImage = event.target.files[0];
        const local_file_uri = URL.createObjectURL(uploadedImage);
        this.canvasAdapter.newImageLayer({ uri: local_file_uri }); // Push new Image layer with the provided data
        this.unuploadedFiles[local_file_uri] = uploadedImage.name;
    }

    resetCurrentLayout(): void {
        const layout = this.reportCardLayoutList.find((item) => {
            return item.id === this.currentLayout.id;
        });
        this.populateCurrentLayoutWithGivenValue(layout === undefined ? this.ADD_LAYOUT_STRING : layout);
    }

    isLayoutSaved(): boolean {
        if (!this.currentLayout) return true;
        if (!this.currentLayout.name && this.canvasAdapter.layers.length == 0 && this.canvasAdapter.gradeRuleSetList.length == 0)
            return true;
        if (!this.currentLayout.id) return false;
        this.currentLayout.content[this.canvasAdapter.activePageIndex] = this.canvasAdapter.getDataToSave();
        let dbSavedLayout = this.reportCardLayoutList.find((layout) => layout.id == this.currentLayout.id);
        return JSON.stringify(this.currentLayout.content) == dbSavedLayout.content && this.currentLayout.name == dbSavedLayout.name;
    }

    async saveLayout() {
        if (!this.doesCurrentLayoutHasUniqueName()) {
            await window.alert('Layout Name Cannot Be Empty or repeated!');
            this.htmlAdapter.isSaving = false;
            return;
        }

        if (this.canvasAdapter.activePageIndex == 0) {
            this.canvasAdapter.storeThumbnail();
        }

        if (!this.currentLayout.id) {
            // if new layout, upload it
            await this.serviceAdapter.uploadCurrentLayout(); // blank layout, we will update it after all assets are uploaded
        }
        this.currentLayout.content[this.canvasAdapter.activePageIndex] = this.canvasAdapter.getDataToSave();

        for (const layoutPage of this.currentLayout.content) {
            const layers: Array<Layer> = layoutPage.layers;
            for (let i = 0; i < layers.length; i++) {
                if (layers[i].LAYER_TYPE == 'IMAGE' && layers[i].dataSourceType == DATA_SOUCE_TYPE[0]) {
                    if (this.unuploadedFiles[layers[i].uri]) {
                        let image = await fetch(layers[i].uri).then((response) => response.blob());
                        layers[i].uri = await this.serviceAdapter.uploadImageForCurrentLayout(image, this.unuploadedFiles[layers[i].uri]);
                    }
                }
            }
        }
        await this.serviceAdapter.uploadCurrentLayout(); // final update/upload of layout

        this.htmlAdapter.isSaving = false;
        this.canvasAdapter.isSaved = true;
        alert('Layout Saved Successfully');
    }
}
