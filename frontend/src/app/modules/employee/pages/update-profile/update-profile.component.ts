import { Component, Input, OnInit } from '@angular/core';

import { EmployeeOldService } from '../../../../services/modules/employee/employee-old.service';

import {FormControl} from '@angular/forms';
import {DataStorage} from "../../../../classes/data-storage";
import { ImagePdfPreviewDialogComponent } from 'app/components/image-pdf-preview-dialog/image-pdf-preview-dialog.component';
import { MatDialog } from '@angular/material';
import { UpdateProfileServiceAdapter } from './update-profile.service.adapter';
import { EmployeeService } from 'app/services/modules/employee/employee.service';
import { CommonFunctions } from 'app/classes/common-functions';
import { MultipleFileDialogComponent } from 'app/components/multiple-file-dialog/multiple-file-dialog.component';

@Component({
  selector: 'update-profile',
  templateUrl: './update-profile.component.html',
  styleUrls: ['./update-profile.component.css'],
  providers: [EmployeeService]
})

export class UpdateProfileComponent implements OnInit {

    user;

    employeeList: any;
    NULL_CONSTANT = null;
    selectedEmployeeProfile: any;
    currentEmployeeProfile: any;

    selectedEmployeeSessionProfile: any;
    currentEmployeeSessionProfile: any;

    myControl = new FormControl();

    isLoading = false;

    employeeSectionList: any;
    employeeParameterList: any[] = [];
    employeeParameterValueList: any[] = [];
    currentEmployeeParameterValueList: any[] = [];
    
    deleteList :any[]=[];
    profileImage=null;

    selectedEmployee: any;
    currentEmployee: any;

    commonFunctions: CommonFunctions;

    serviceAdapter: UpdateProfileServiceAdapter


    constructor (public employeeOldService: EmployeeOldService,
                public employeeService: EmployeeService,
                public dialog:MatDialog,) { }

    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();
        this.serviceAdapter = new UpdateProfileServiceAdapter()
        this.serviceAdapter.initializeAdapter(this)
        this.serviceAdapter.initializeData()

        this.currentEmployeeProfile = {};
        this.currentEmployeeSessionProfile = {};
    }

    getEmployeeList(employeeList: any) {
        this.employeeList = employeeList;
    }

    getEmployeeProfile(employee: any): void {

        const data = {
            id: employee.id,
        };

        const session_data = {
            sessionId: this.user.activeSchool.currentSessionDbId,
            parentEmployee: employee.id,
        };

        this.isLoading = true;
        let service_list = [];
        Promise.all([
            this.employeeOldService.getEmployeeProfile(data, this.user.jwt),
            this.employeeOldService.getEmployeeSessionDetail(session_data, this.user.jwt),
            this.employeeService.getObjectList(this.employeeService.employee_parameter_value, {
                parentEmployee: employee.id,
            })
        ]).then(value => {
            this.selectedEmployeeProfile = value[0];
            Object.keys(this.selectedEmployeeProfile).forEach(key => {
                this. currentEmployeeProfile[key] = this.selectedEmployeeProfile[key];

            });
            this.selectedEmployeeSessionProfile = value[1];
            Object.keys(this.selectedEmployeeSessionProfile).forEach(key => {
                this.currentEmployeeSessionProfile[key] = this.selectedEmployeeSessionProfile[key];
            });

           

           
                this.employeeParameterValueList = value[2];
                this.currentEmployeeParameterValueList = [];
                this.employeeParameterValueList.forEach(item=>{
                    if (item.document_value){
                        let document_name = item.document_value.split("/")
                        document_name = document_name[document_name.length-1]
                        item.document_name = document_name
                    }
                });

                this.employeeParameterValueList.forEach(item => {                 
                    let tempObject = {}
                    Object.keys(item).forEach(key => {
                        tempObject[key] = item[key];
                    });
                    this.currentEmployeeParameterValueList.push(tempObject)
                });
                this.isLoading = false;
            
        }, error => {
            this.isLoading = false;
        });

    }


    checkFieldChanged(selectedValue, currentValue): boolean {
        if(selectedValue!==null && currentValue!==null ){
            if (selectedValue !== currentValue){
                return true;
            }
            return false;
        }
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
        if (value !== '0' && value !== '1' && value !== '2' && value !== '3' &&
            value !== '4' && value !== '5' && value !== '6' && value !== '7' &&
            value !== '8' && value !== '9') {
            return false;
        }
        return true;
    }

    updateEmployeeProfile(): void {

        if (this.currentEmployeeProfile.name === undefined || this.currentEmployeeProfile.name === '') {
            alert('Name should be populated');
            return;
        }

        if (this.currentEmployeeProfile.fatherName === undefined || this.currentEmployeeProfile.fatherName === '') {
            alert('Father\'s Name should be populated');
            return;
        }

        if (this.currentEmployeeProfile.dateOfBirth === undefined || this.currentEmployeeProfile.dateOfBirth === '') {
            this.currentEmployeeProfile.dateOfBirth = null;
        }

        if (this.currentEmployeeProfile.dateOfJoining === undefined || this.currentEmployeeProfile.dateOfJoining === '') {
            this.currentEmployeeProfile.dateOfJoining = null;
        }

        if (this.currentEmployeeProfile.dateOfLeaving === undefined || this.currentEmployeeProfile.dateOfLeaving === '') {
            this.currentEmployeeProfile.dateOfLeaving = null;
        }

        if (this.currentEmployeeProfile.mobileNumber === undefined || this.currentEmployeeProfile.mobileNumber === '') {
            this.currentEmployeeProfile.mobileNumber = null;
            alert('Mobile number is required.');
            return;
        } else if (this.currentEmployeeProfile.mobileNumber.toString().length != 10) {
            alert('Mobile number should be 10 digits');
            return;
        } else {
            let selectedEmployee = null;
            this.employeeList.forEach(employee => {
                if (employee.mobileNumber === this.currentEmployeeProfile.mobileNumber
                    && employee.id !== this.currentEmployeeProfile.id) {
                    selectedEmployee = employee;
                }
            });
            if (selectedEmployee) {
                alert('Mobile Number already exists in '+selectedEmployee.name+'\'s profile');
                return;
            }
        }

        if (this.currentEmployeeProfile.aadharNumber != null
            && this.currentEmployeeProfile.aadharNumber.toString().length != 12) {
            alert("Aadhar No. should be 12 digits");
            return;
        }

        this.isLoading = true;
        Promise.all([
            this.employeeOldService.updateEmployeeProfile(this.currentEmployeeProfile, this.user.jwt),
            (this.currentEmployeeSessionProfile.id==null?
                this.employeeOldService.createEmployeeSessionDetail(this.currentEmployeeSessionProfile, this.user.jwt)
                    :this.employeeOldService.updateEmployeeSessionDetail(this.currentEmployeeSessionProfile, this.user.jwt)
            )
        ]).then(value => {
            this.isLoading = false;


        let generateList = [];
        let updateList = [];
        let service_list = [];
        this.currentEmployeeParameterValueList.forEach(x => {
            x.parentEmployee = this.currentEmployeeProfile.id;
        });
        this.employeeParameterList.forEach(parameter => {
            console.log('parameter')
            console.dir(parameter)
            if (this.checkCustomFieldChanged(parameter)) {
                let temp_obj = this.currentEmployeeParameterValueList.find(x => x.parentEmployeeParameter === parameter.id);
                if (temp_obj){
                    const data = { ...temp_obj}
                    const form_data = new FormData();
                    Object.keys(data).forEach(key => {
                        if (data[key]){
                            if (key =="document_name"|| key=="document_size"){}
                            else if (key=='document_value'){
                                form_data.append(key,this.dataURLtoFile(data[key],data['document_name']))
                                form_data.append('document_size',data['document_size'])
                            }
                            else {
                                form_data.append(key,data[key])   
                            }
                        }
                        else{
                            form_data.append(key,"")
                        } 
                    })
                    if (temp_obj.id) {
                        updateList.push(form_data)
                    } else if (!temp_obj.id) {
                        generateList.push(form_data)
                    }
                }
            }
        });
        
        if (generateList.length) {
            generateList.forEach(x => {
                service_list.push(this.employeeService.createObject(this.employeeService.employee_parameter_value,x))
            })
        }

        if (updateList.length) {
            updateList.forEach(x => {
                service_list.push(this.employeeService.updateObject(this.employeeService.employee_parameter_value,x))

            })
        }

        if(this.deleteList.length){
            this.deleteList.forEach(x =>{
                service_list.push(this.employeeService.deleteObject(this.employeeService.employee_parameter_value,{'id':x.id}))
            })
        }
            alert('Employee profile updated successfully');
            this.selectedEmployeeProfile = this.currentEmployeeProfile;
            this.selectedEmployeeSessionProfile = this.currentEmployeeSessionProfile;
        }, error => {
            this.isLoading = false;
        });

    }

    dataURLtoFile(dataurl, filename) {
    	try {
            const arr = dataurl.split(',');
            const mime = arr[0].match(/:(.*?);/)[1];
            const bstr = atob(arr[1]);
            let n = bstr.length;
            const u8arr = new Uint8Array(n);

            while (n--) {
                u8arr[n] = bstr.charCodeAt(n);
            }

            return new File([u8arr], filename, {type: mime});
        } catch (e) {
            return null;
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

    async onImageSelect(evt: any) {
        let image = evt.target.files[0];

        if (image.type !== 'image/jpeg' && image.type !== 'image/png') {
            alert("Image type should be either jpg, jpeg, or png");
            return;
        }

        image = await this.cropImage(image, [1,1]);

        while (image.size > 512000) {
            image = await this.resizeImage(image);
        }

        if (image.size > 512000) {
            alert('Image size should be less than 512kb');
            return;
        }

        let data = {
            id: this.selectedEmployeeProfile.id,
        };
        this.isLoading = true;
        this.employeeOldService.uploadProfileImage(image, data, this.user.jwt).then( response => {
            this.isLoading = false;
            alert(response.message);
            if (response.status === 'success') {
                this.selectedEmployeeProfile.profileImage = response.url;
                this.currentEmployeeProfile.profileImage = response.url;
            }
        }, error => {
            this.isLoading = false;
        });
    }

    resizeImage(file:File):Promise<Blob> {
        return new Promise((resolve, reject) => {
            let image = new Image();
            image.src = URL.createObjectURL(file);
            image.onload = () => {
                let width = image.width;
                let height = image.height;

                let maxWidth = image.width/2;
                let maxHeight = image.height/2;

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


    getParameterValue = (parameter) => {
        try {
            return this.currentEmployeeParameterValueList.find(x => x.parentEmployeeParameter === parameter.id).value
        } catch {
            return null;
        }
    }

    updateParameterValue = (parameter, value) => {
        let item = this.currentEmployeeParameterValueList.find(x => x.parentEmployeeParameter === parameter.id);
        if (!item) {
            item = {parentEmployee: this.currentEmployeeProfile.id, parentEmployeeParameter: parameter.id, value: value};
            this.currentEmployeeParameterValueList.push(item);
        } else {
            item.value = value;
        }
    }

    checkCustomFieldChanged = (parameter) => {
        const item = this.currentEmployeeParameterValueList.find(x => x.parentEmployeeParameter === parameter.id);
        const old_item = this.employeeParameterValueList.find(x => x.parentEmployeeParameter === parameter.id);
        if (!item && old_item){
            return true
        }
        if (old_item){
            if (old_item.value===null){
                return item && (!old_item || item.document_value != old_item.document_value);
            }
        }
        return item && (!old_item || item.value !== old_item.value || item.document_value != old_item.document_value);
    }



    
    
    isMobile():boolean{
        if (window.innerWidth > 991) {
            return false
        }
        return true
    };

    getParameterDocumentType(parameter){
    	try{
        	let document_value= this.currentEmployeeParameterValueList.find(x =>x.parentEmployeeParameter === parameter.id).document_value
        	if (document_value){
        		let document_name = this.currentEmployeeParameterValueList.find(x => x.parentEmployeeParameter === parameter.id).document_name
        		let urlList=[]
		        if (document_name){
		            urlList = document_name.split(".")
		        }
		        else{
		            urlList = document_value.split(".")
		        }
		        let type = urlList[urlList.length-1]
		        if (type=='pdf'){
		            return 'pdf'
		        }
		        else{
		            return 'img'
		        }
		    } else{
		    	return 'none'
		    }
	    }
	    catch{
        	return 'none'
        }
    }

    getParameterDocumentValue(parameter){
        try{
        	let document_value= this.currentEmployeeParameterValueList.find(x => x.parentEmployeeParameter === parameter.id).document_value
		    if (document_value){
		        return document_value
		    }
		    else{
		        return null
		    }
        }
        catch{
            return null
        }
    }
    
    deleteDocument(parameter) {
        if (confirm('Are you sure want to delete this document?')) {
            let item = this.currentEmployeeParameterValueList.find(x => x.parentEmployeeParameter === parameter.id)
            if (item) {
                if (item.id) {
                    this.deleteList.push(item)
                }
                this.currentEmployeeParameterValueList = this.currentEmployeeParameterValueList.filter(para => para.parentEmployeeParameter !== item.parentEmployeeParameter)
            }
        }
    }
    

    resetDocument(parameter) {
        if (confirm('Are you sure want to reset this document?')) {
            let item = this.currentEmployeeParameterValueList.find(x => x.parentEmployeeParameter === parameter.id)
            let old_item = this.employeeParameterValueList.find(x => x.parentEmployeeParameter === parameter.id)
            if (item) {
                if (old_item) {
                    item.id = old_item.id;
                    item.document_value = old_item.document_value
                    item.document_size = old_item.document_size
                    item.document_name = old_item.document_name
                    this.deleteList = this.deleteList.filter(x => x.id !== old_item.id)
                } else {
                    this.currentEmployeeParameterValueList = this.currentEmployeeParameterValueList.filter(para => para.parentEmployeeParameter !== item.parentEmployeeParameter)
                }
            } else if (old_item) {
                item = {
                    id:old_item.id,
                    parentEmployeeParameter: parameter.id,
                    document_value: old_item.document_value,
                    document_name: old_item.document_name,
                    document_size: old_item.document_size
                };
                this.currentEmployeeParameterValueList.push(item);
                this.deleteList = this.deleteList.filter(x => x.id !== old_item.id)
            }
        }
    }
    
    check_document(value): boolean {
    	let type = value.type
        if (type !== 'image/jpeg' && type !== 'image/jpg' && type !== 'image/png' && type!='application/pdf' ) {
            alert('Uploaded File should be either in jpg,jpeg,png or in pdf format')
            return false
        }
        else{
            if (value.size/1000000.0 > 5){
                alert ("File size should not exceed 5MB")
                return false
            }
            else{
            	return true
            }
        }
    }
    
    getDocumentName(parameter){
        let item = this.currentEmployeeParameterValueList.find(x => x.parentEmployeeParameter === parameter.id)
        if (item) {
            if (item.document_name){
                return item.document_name
            }
            else{
                let document_name = item.document_value.split("/")
                document_name = document_name[document_name.length-1]
                return document_name.substring(document_name.indexOf("_")+1,document_name.length);
            }
        }
    }
    
    updateDocuments = (parameter, value,element) => {
        const options = this.employeeParameterList.filter(parameter=>(parameter.parameterType=="DOCUMENT"))
        if (value.target.files.length>1){
            if (value.target.files.length<=options.length){
                let files=[]
                for (let i=0;i<value.target.files.length;i++){
                    if (this.check_document(value.target.files[i])){
                        files.push(value.target.files[i])
                    }
                };
                if (files.length){
                    let choiceList = [];
                    options.forEach(x=>(
                        choiceList.push({'name':x.name,'id':x.id})
                    ));
                    console.log(choiceList);
                    let dialogRef = this.dialog.open(MultipleFileDialogComponent,{
                    width:'580px',
                    data:{files:files,options:options,choiceList:choiceList}  
                    });
                    dialogRef.afterClosed().subscribe(result=>{
                        if (result){
                            for (let i=0;i<result.files.length;i++){
                                let item = options.find(x=>(x.id===result.list[i].id))
                                if (item){
                                    this.updateDocumentValue(item,result.files[i])
                                }
                            }
                        }
                    });
                }
            }
            else{
                console.log("Please select only "+value.target.files.length+" files");
            }
        }
        else{
            let check = this.check_document(value.target.files[0])
            if (check==true){
                this.updateDocumentValue(parameter,value.target.files[0])
            }
        }
        element.value='';
    }

    updateDocumentValue=(parameter,file)=>{
        let item = this.currentEmployeeParameterValueList.find(x => x.parentEmployeeParameter === parameter.id);
        let inDeletedList=this.deleteList.find(x=> x.parentEmployeeParameter === parameter.id);
        let document_value =file;
            let document_size = document_value.size;
            let document_name = document_value.name;
            const reader = new FileReader();
            reader.onload = e => {
                document_value = reader.result
                if (!item && !inDeletedList){
                item = {parentEmployeeParameter: parameter.id, document_value: document_value,document_name:document_name,document_size:document_size};
                this.currentEmployeeParameterValueList.push(item);
                } else if (inDeletedList) {
                    this.deleteList = this.deleteList.filter(x => x.id !== inDeletedList.id);
                    console.log(this.deleteList)
                    let Item = {
                        id:inDeletedList.id,
                        parentEmployeeParameter: inDeletedList.parentEmployeeParameter,
                        document_value: document_value,
                        document_name: document_name,
                        document_size: document_size
                    };
                    console.log(Item)
                    this.currentEmployeeParameterValueList.push(Item);
                }
                else{
                    item.document_value = document_value;
                    item.document_name = document_name;
                    item.document_size= document_size;
                }
            };
            reader.readAsDataURL(document_value);
    }
    
    dragEnter(value){
        $(".dropinput").css({"z-index":"6"})
        $(value.path[1]).css({"background":"rgba(182, 224, 184, 0.1)","border": "1px dashed #7db580"})
    }

    onDrop(value){
        $('.dropinput').css({"z-index":"-1"})
        $(value.path[1]).css({"background":"","border": ""})
    }

    dragLeave(value){
        $(value.path[1]).css({"background":"","border": ""})
    }
    
    openFilePreviewDialog(parameter): void {
        let type=this.getParameterDocumentType(parameter)
        let file = this.getParameterDocumentValue(parameter)
        const dialogRef = this.dialog.open(ImagePdfPreviewDialogComponent, {
            width: '600px',
            data: {'file': file, 'type': type}
        });
        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed');
        });
    }

}
