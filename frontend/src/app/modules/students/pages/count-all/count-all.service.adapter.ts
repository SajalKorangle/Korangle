import { CountAllComponent } from './count-all.component';
import { CommonFunctions } from '@classes/common-functions';

import { Query } from '@services/generic/query';

export class CountAllServiceAdapter {
    vm: CountAllComponent;

    constructor() { }

    initializeAdapter(vm: CountAllComponent): void {
        this.vm = vm;
    }

    /* Initialize Data */
    initializeData(): void {
        this.vm.isLoading = true;

        const student_full_profile_request_filter = {
            parentSchool: this.vm.user.activeSchool.dbId,
        };

        const student_section_filter = {
            parentStudent__parentSchool: this.vm.user.activeSchool.dbId,
            parentSession: this.vm.user.activeSchool.currentSessionDbId,
        };

        const student_parameter_filter = {
            parentSchool: this.vm.user.activeSchool.dbId,
        };

        const student_parameter_value_filter = {
            parentStudent__parentSchool: this.vm.user.activeSchool.dbId,
        };

        const tc_filter = {
            parentSession: this.vm.user.activeSchool.currentSessionDbId,
            parentStudent__parentSchool: this.vm.user.activeSchool.dbId,
            status__in: ['Generated', 'Issued'],
        };

        const tc_fields = ['parentStudent'];

        const count_all_table_filter = {
            parentSchool: this.vm.user.activeSchool.dbId,
        };

        Promise.all([
            new Query().getObjectList({class_app: 'Class'}),    // 0
            new Query().getObjectList({class_app: 'Division'}),    // 1
            new Query().filter(student_parameter_filter).getObjectList({student_app: 'StudentParameter'}),    // 2
            new Query().filter(student_parameter_value_filter).getObjectList({student_app: 'StudentParameterValue'}),    // 3
            new Query().filter(tc_filter).setFields(...tc_fields).getObjectList({tc_app: 'TransferCertificateNew'}),    // 4
            new Query().filter(count_all_table_filter).getObjectList({student_app: 'CountAllTable'}),    // 5
            new Query().filter(student_full_profile_request_filter).getObjectList({student_app: 'Student'}),    // 6
            new Query().filter(student_section_filter).getObjectList({student_app: 'StudentSection'}),    // 7
        ]).then(
            (value) => {

                /* Initialize Class-Section List */
                value[0].forEach((classs) => {
                    classs.sectionList = [];
                    value[1].forEach((section) => {
                        classs.sectionList.push(CommonFunctions.getInstance().copyObject(section));
                    });
                });
                this.vm.initializeClassSectionList(value[0]);

                /* Initialize Student Parameter Value List */
                this.vm.studentParameterList = value[2].map((x) => ({
                    ...x,
                    filterValues: JSON.parse(x.filterValues).map((x2) => ({ name: x2, show: false })),
                    showNone: false,
                    filterFilterValues: '',
                }));
                this.vm.studentParameterValueList = value[3];

                /* Initialize TC List */
                value[4].forEach((element) => {
                    delete element.id;
                });
                this.vm.backendData.tcList = value[4];

                /* Initialize Student Full Profile List */
                let studentFullProfileList = [];
                for (let i = 0; i < value[7].length; i++) {
                    for (let j = 0; j < value[6].length; j++) {
                        if (value[7][i].parentStudent === value[6][j].id) {

                            let student_data = {};
                            let student_object = value[6][j];
                            let student_section_object = value[7][i];

                            if (student_object.profileImage) {
                                student_data['profileImage'] = student_object.profileImage;
                            } else {
                                student_data['profileImage'] = this.vm.NULL_CONSTANT;
                            }

                            student_data['name'] = student_object.name;
                            student_data['dbId'] = student_object.id;
                            student_data['fathersName'] = student_object.fathersName;
                            student_data['mobileNumber'] = student_object.mobileNumber;
                            student_data['secondMobileNumber'] = student_object.secondMobileNumber;
                            student_data['dateOfBirth'] = student_object.dateOfBirth;
                            student_data['remark'] = student_object.remark;
                            student_data['rollNumber'] = student_section_object.rollNumber;
                            student_data['scholarNumber'] = student_object.scholarNumber;
                            student_data['motherName'] = student_object.motherName;
                            student_data['gender'] = student_object.gender;
                            student_data['caste'] = student_object.caste;
                            student_data['category'] = student_object.newCategoryField;
                            student_data['religion'] = student_object.newReligionField;
                            student_data['fatherOccupation'] = student_object.fatherOccupation;
                            student_data['address'] = student_object.address;
                            student_data['familySSMID'] = student_object.familySSMID;
                            student_data['childSSMID'] = student_object.childSSMID;
                            student_data['bankName'] = student_object.bankName;
                            student_data['bankIfscCode'] = student_object.bankIfscCode;
                            student_data['bankAccountNum'] = student_object.bankAccountNum;
                            student_data['aadharNum'] = student_object.aadharNum;
                            student_data['bloodGroup'] = student_object.bloodGroup;
                            student_data['fatherAnnualIncome'] = student_object.fatherAnnualIncome;
                            student_data['rte'] = student_object.rte;
                            student_data['parentTransferCertificate'] = student_object.parentTransferCertificate;
                            student_data['dateOfAdmission'] = student_object.dateOfAdmission;

                            if (student_object.currentBusStop) {
                                student_data['busStopDbId'] = student_object.currentBusStop;
                            } else {
                                student_data['busStopDbId'] = this.vm.NULL_CONSTANT;
                            }

                            if (student_object.admissionSession) {
                                student_data['admissionSessionDbId'] = student_object.admissionSession;
                            } else {
                                student_data['admissionSessionDbId'] = this.vm.NULL_CONSTANT;
                            }

                            if (student_object.parentAdmissionClass) {
                                student_data['parentAdmissionClass'] = student_object.parentAdmissionClass;
                            }

                            student_data['sectionDbId'] = student_section_object.parentDivision;
                            student_data['sectionName'] = value[1].find(section => section.id == student_section_object.parentDivision).name;
                            student_data['className'] = value[0].find(classs => classs.id == student_section_object.parentClass).name;
                            student_data['classDbId'] = student_section_object.parentClass;
                            studentFullProfileList.push(student_data);
                            break;
                        }
                    }
                }
                this.vm.initializeStudentFullProfileList(studentFullProfileList);

                /* Initialize Table List */
                value[5].sort((a, b) => a.id - b.id);
                this.vm.initializeTableList(value[5]);

                this.vm.isLoading = false;
            },
            (error) => {
                this.vm.isLoading = false;
            }
        );
    }  // Ends: initializeData()

    /* Update Table List */
    async updateTableList() {
        await new Query().updateObjectList({student_app: 'CountAllTable'}, this.vm.tableList);
    }  // Ends: updateTableList()

    /* Save Table */
    async saveTable(operation = "", table = null, idx = null) {
        this.vm.isLoading = true;
        let tableDataObject = {};
        tableDataObject["formatName"] = this.vm.tableFormatTitle.toString().trim();
        tableDataObject["parentSchool"] = this.vm.user.activeSchool.dbId;

        /* Get Rows */
        let rows = {};
        this.vm.rowFilterList$.getValue().forEach((rowFilter, index) => {
            let name = "row" + index;
            rows[name] = rowFilter;
        });
        tableDataObject["rows"] = rows;

        /* Get Columns */
        let cols = {};
        this.vm.columnFilterList$.getValue().forEach((colFilter, index) => {
            let name = "col" + index;
            cols[name] = colFilter;
        });
        tableDataObject["cols"] = cols;

        /* Create An Object */
        const response = await new Query().createObject({student_app: 'CountAllTable'}, tableDataObject);
        this.vm.htmlRenderer.tableOpenClicked(response, this.vm.tableList.length);
        this.vm.tableList.push(response);

        if (operation == "initializeTableDetails") {
            this.vm.initializeTableDetails();
        }

        if (operation == "openTable") {
            this.vm.htmlRenderer.tableOpenClicked(table, idx);
        }

        this.vm.isTableUpdated = false;
        this.vm.isLoading = false;
        alert("Table saved successfully.");
    }  // Ends: saveTable()

    /* Update Table */
    async updatetable(operation = "", table = null, idx = null) {

        this.vm.isLoading = true;

        const count_all_table_filter = {
            parentSchool: this.vm.user.activeSchool.dbId,
            id: this.vm.tableActiveId,
        };

        const response = await new Query().filter(count_all_table_filter).getObjectList({student_app: 'CountAllTable'});

        if (response.length > 0) {
            let tableDataObject = {};
            tableDataObject["id"] = this.vm.tableActiveId;

            if (this.vm.tableFormatTitle.toString().trim()) {
                tableDataObject["formatName"] = this.vm.tableFormatTitle.toString().trim();
            } else {
                tableDataObject["formatName"] = this.vm.oldTableFormatTitle.toString().trim();
            }
            tableDataObject["parentSchool"] = this.vm.user.activeSchool.dbId;

            /* Get Rows */
            let rows = {};
            this.vm.rowFilterList$.getValue().forEach((rowFilter, index) => {
                let name = "row" + index;
                rows[name] = rowFilter;
            });
            tableDataObject["rows"] = rows;

            /* Get Columns */
            let cols = {};
            this.vm.columnFilterList$.getValue().forEach((colFilter, index) => {
                let name = "col" + index;
                cols[name] = colFilter;
            });
            tableDataObject["cols"] = cols;

            /* Update An Object */
            const response = await new Query().updateObject({student_app: 'CountAllTable'}, tableDataObject);
            this.vm.tableList[this.vm.tableActiveIdx] = response;
            this.vm.htmlRenderer.tableOpenClicked(response, this.vm.tableActiveIdx);

            if (operation == "createNew") {
                this.vm.initializeTableDetails();
            }

            if (table) {
                if (response["id"] != table["id"]) {
                    this.vm.htmlRenderer.tableOpenClicked(table, idx);
                }
            }

            this.vm.isTableUpdated = false;
            this.vm.isLoading = false;
            alert("Table updated successfully.");
        } else {
            this.vm.initializeTableDetails();
            let response = await new Query().filter({parentSchool: this.vm.user.activeSchool.dbId}).getObjectList({student_app: 'CountAllTable'});
            this.vm.initializeTableList(response);
            this.vm.isLoading = false;
            alert("Table doesn't exist.");
        }
    }  // Ends: updatetable()

    /* Delete Table */
    async deleteTable() {
        this.vm.isLoading = true;

        let tableData = {
            id: this.vm.tableActiveId,
        };

        new Query().filter(tableData).deleteObjectList({student_app: 'CountAllTable'});

        this.vm.tableList.splice(this.vm.tableActiveIdx, 1);
        this.vm.initializeTableDetails();
        this.vm.isLoading = false;
    }  // Ends: deleteTable()

    /* Restore Old Table */
    async restoreOldtable(tableActiveId, tableActiveIdx, table = null, idx = null) {

        const count_all_table_filter = {
            parentSchool: this.vm.user.activeSchool.dbId,
            id: tableActiveId,
        };

        const response = await new Query().filter(count_all_table_filter).getObjectList({student_app: 'CountAllTable'});

        if (response.length == 0) {
            let response = await new Query().filter({parentSchool: this.vm.user.activeSchool.dbId}).getObjectList({student_app: 'CountAllTable'});
            this.vm.initializeTableList(response);

            if (table.id != tableActiveId) {
                this.vm.htmlRenderer.tableOpenClicked(table, idx);
            } else {
                this.vm.initializeTableDetails();
            }
            return;
        }

        Promise.all([
            new Query().filter({id: tableActiveId}).getObject({student_app: 'CountAllTable'}),   // 0
        ]).then(
            (value) => {
                this.vm.tableList[tableActiveIdx] = value[0];

                if (table && table.id != tableActiveId) {
                    this.vm.htmlRenderer.tableOpenClicked(table, idx);
                } else if (table) {
                    this.vm.htmlRenderer.tableOpenClicked(this.vm.tableList[tableActiveIdx], tableActiveIdx);
                } else {
                    this.vm.initializeTableDetails();
                }
            }
        );
    }  // Ends: restoreOldtable()
}
