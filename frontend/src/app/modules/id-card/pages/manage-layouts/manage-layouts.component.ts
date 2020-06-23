import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { IdCardService } from './../../../../services/modules/id-card/id-card.service';
import { StudentService } from './../../../../services/modules/student/student.service';
import { ClassService } from './../../../../services/modules/class/class.service';

import { ManageLayoutsServiceAdapter } from './manage-layouts.service.adapter';
import {DataStorage} from "../../../../classes/data-storage";

import {FIELDS} from './../../class/constants'
import DefaultIdCard from './../../class/id-card'

@Component({
    selector: 'manage-layouts',
    templateUrl: './manage-layouts.component.html',
    styleUrls: ['./manage-layouts.component.css'],
    providers: [IdCardService, StudentService, ClassService],
})

export class ManageLayoutsComponent implements OnInit {

    user;
    idCardLayoutList: any[] = [];

    currentLayout: any;

    serviceAdapter: ManageLayoutsServiceAdapter;

    isLoading = false;

    backgroundImage: any;

    currentField: any;

    studentSection: any;

    data: any = {
        user: null,
        studentList: [],
        studentSectionList: [],
        classList: [],
        divisionList: [],
    };


    constructor(
        public idCardService: IdCardService,
        public studentService: StudentService,
        public classService: ClassService,

        private cdRef: ChangeDetectorRef,
    ) {}

    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();
        this.data.user = this.user
        this.initializeLayout()
        this.serviceAdapter = new ManageLayoutsServiceAdapter();
        this.serviceAdapter.initializeAdapter(this);
        this.serviceAdapter.initializeData();
    }

    detectChanges(){
        this.cdRef.detectChanges();
    }

    initializeLayout = () => {
        this.currentLayout = {
            parentSchool: this.user.activeSchool.dbId,
            name: '',
            background: null,
            content: []
        }
    }

    readURL = event => {
        if (event.target.files && event.target.files[0]) {
            let image = event.target.files[0];
            if (image.type !== 'image/jpeg' && image.type !== 'image/png') {
                alert("Image type should be either jpg, jpeg, or png");
                return;
            }
            this.currentLayout.background = image
            // const reader = new FileReader();
            // reader.onload = e => this.currentLayout.background = reader.result;    
            // reader.readAsDataURL(image);
        }
    }

    removeBg = () => {
        this.currentLayout.background = null
        delete this.currentLayout.background;
        console.log(this.currentLayout.background)
    }

    getField = key => FIELDS.find(field => field.key===key)
    getName = key =>this.getField(key).name
    getFieldValue = key => {
        const value = this.getField(key).get(this.data, this.data.studentList[0].id)
        return value?value:'Text'
    }

    addField = event => {
        if(event.value.type==="text"){
            this.currentLayout.content.push({
                key: event.value.key,
                x: 0,
                y: 0,
                fontSize: 3,
                bold: false,
                italic: false,
                underline: false
            })
        }else if(event.value.type==="image"){
            this.currentLayout.content.push({
                key: event.value.key,
                width: 10,
                height: 10
            })
        }        
        this.currentField = this.currentLayout.content[this.currentLayout.content.length-1]
    }

    deleteField = field => {
        this.currentLayout.content = this.currentLayout.content.filter(x => x!==field)
        this.currentField = null
    }

    getRemainingFields = () => {
        return FIELDS.filter(field => !this.currentLayout.content.find(x => x.key===field.key))
    }

    onDragEnded = (event, i) => {
        let parent = event.source.element.nativeElement.parentElement.getBoundingClientRect()
        let element = event.source.element.nativeElement.getBoundingClientRect()
        if(this.getField(this.currentLayout.content[i].key).type==="text"){
            this.currentLayout.content[i].x = (element.left - parent.left) * 85.60 /parent.width
            this.currentLayout.content[i].y = (element.top - parent.top) * 53.98 /parent.height
        }else if(this.getField(this.currentLayout.content[i].key).type==="image"){
            this.currentLayout.content[i].x = (element.left - parent.left) * 85.60 /parent.width
            this.currentLayout.content[i].y = (element.top - parent.top) * 53.98 /parent.height
        }
        
        this.currentLayout.updated =  true
        console.log(event.source.element.nativeElement.getBoundingClientRect(), this.currentLayout.content[i].x, this.currentLayout.content[i].y)
    }

    isValidLayoutName = () => {
        const similarLayouts = this.idCardLayoutList.filter(x => x.name===this.currentLayout.name).length
        return !((this.currentLayout.id&&similarLayouts>=2) || (!this.currentLayout.id&&similarLayouts==1))
    }

    download = async () => {
        console.log(DefaultIdCard)
        let card = new DefaultIdCard(false, this.currentLayout, this.data)
        await card.generate()
        card.download()
    }


}