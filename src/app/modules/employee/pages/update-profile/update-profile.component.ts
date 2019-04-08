import { Component, Input, OnInit } from '@angular/core';

import { EmployeeService } from '../../employee.service';

import {FormControl} from '@angular/forms';
import {map} from 'rxjs/operators';

@Component({
  selector: 'update-profile',
  templateUrl: './update-profile.component.html',
  styleUrls: ['./update-profile.component.css'],
})

export class UpdateProfileComponent implements OnInit {

    @Input() user;

    employeeList: any;
    filteredEmployeeList: any;

    selectedEmployeeProfile: any;
    currentEmployeeProfile: any;

    selectedEmployeeSessionProfile: any;
    currentEmployeeSessionProfile: any;

    myControl = new FormControl();

    isLoading = false;

    constructor (private employeeService: EmployeeService) { }

    ngOnInit(): void {

        this.currentEmployeeProfile = {};
        this.currentEmployeeSessionProfile = {};

        const data = {
            parentSchool: this.user.activeSchool.dbId,
        };

        this.employeeService.getEmployeeMiniProfileList(data, this.user.jwt).then( employeeList => {
            this.employeeList = employeeList;
            this.filteredEmployeeList = this.myControl.valueChanges.pipe(
                map(value => typeof value === 'string' ? value: (value as any).name),
                map(value => this.filter(value))
            );
        });

    }

    filter(value: any): any {
        if (value === '') {
            return [];
        }
        return this.employeeList.filter( member => member.name.toLowerCase().indexOf(value.toLowerCase()) === 0 );
    }

    displayFn(member?: any) {
        if (member) {
            return member.name;
        } else {
            return '';
        }
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
        Promise.all([
            this.employeeService.getEmployeeProfile(data, this.user.jwt),
            this.employeeService.getEmployeeSessionDetail(session_data, this.user.jwt),
        ]).then(value => {
            this.isLoading = false;
            this.selectedEmployeeProfile = value[0];
            Object.keys(this.selectedEmployeeProfile).forEach(key => {
                this.currentEmployeeProfile[key] = this.selectedEmployeeProfile[key];
            });
            this.selectedEmployeeSessionProfile = value[1];
            Object.keys(this.selectedEmployeeSessionProfile).forEach(key => {
                this.currentEmployeeSessionProfile[key] = this.selectedEmployeeSessionProfile[key];
            });
        }, error => {
            this.isLoading = false;
        });

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

        if (this.currentEmployeeProfile.dateOfJoininig === undefined || this.currentEmployeeProfile.dateOfJoining === '') {
            this.currentEmployeeProfile.dateOfJoining = null;
        }

        if (this.currentEmployeeProfile.dateOfLeaving === undefined || this.currentEmployeeProfile.dateOfLeaving === '') {
            this.currentEmployeeProfile.dateOfLeaving = null;
        }

        if (this.currentEmployeeProfile.mobileNumber === undefined || this.currentEmployeeProfile.mobileNumber === '') {
            this.currentEmployeeProfile.mobileNumber = null;
            alert('Mobile number is required.');
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

        this.isLoading = true;
        Promise.all([
            this.employeeService.updateEmployeeProfile(this.currentEmployeeProfile, this.user.jwt),
            (this.currentEmployeeSessionProfile.id==null?
                this.employeeService.createEmployeeSessionDetail(this.currentEmployeeSessionProfile, this.user.jwt)
                    :this.employeeService.updateEmployeeSessionDetail(this.currentEmployeeSessionProfile, this.user.jwt)
            )
        ]).then(value => {
            this.isLoading = false;
            alert('Employee profile updated successfully');
            this.selectedEmployeeProfile = this.currentEmployeeProfile;
            this.selectedEmployeeSessionProfile = this.currentEmployeeSessionProfile;
        }, error => {
            this.isLoading = false;
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
        this.employeeService.uploadProfileImage(image, data, this.user.jwt).then( response => {
            this.isLoading = false;
            alert(response.message);
            if (response.status === 'success') {
                this.selectedEmployeeProfile.profileImage = response.url + '?random+\=' + Math.random();
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

}
