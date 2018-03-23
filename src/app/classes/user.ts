
import { Concession } from './concession';
import { Constants } from './constants';

class SubSection {
    path: string;
    title: string;
}

class Section {
    path: string;
    title: string;
    icon: string;
    class: string;
    showSubsection: boolean; // true when subsection is expanded and vice-versa
    subsection: SubSection[] = [];
}

/* For Future Usage

class School {

    name: string;
    printName: string;
    logo: string;
    primaryThemeColor = 'red';
    secondaryThemeColor = 'danger';
    complexFeeStructure = false;

}

*/

export class User {

    username: string;
    email: string;
    isAuthenticated = false;
    jwt = '';

    schoolPrintName: string; // School Profile
    schoolLogo: string; // School Profile
    color = 'red'; // School Profile
    btn_color = 'danger'; // School Profile
    complexFee = false; // School Profile
    schoolDbId = 0;
    schoolDiseCode = 0;
    schoolAddress = '';

    // imgSrc = '/assets/img/angular2-logo-red.png';

    appSection = 'students';

    ROUTES: Section[] = [
        { path: 'students', title: 'Students',  icon: 'account_circle', class: '', showSubsection: false,
            subsection: [
                {
                    path: 'student_profile',
                    title: 'Update Profile',
                },
                {
                    path: 'student_list',
                    title: 'View All',
                }
            ] },
        { path: 'fees', title: 'Fees',  icon: 'receipt', class: '', showSubsection: false,
            subsection: [
                {
                    path: 'new_fees',
                    title: 'Submit Fee',
                },
                {
                    path: 'fees_list',
                    title: 'Previous Record',
                }
            ] },
        { path: 'expenses', title: 'Expenses', icon: 'dashboard', class: '', showSubsection: false,
            subsection: [
                {
                    path: 'new_expense',
                    title: 'Submit Expense',
                },
                {
                    path: 'expense_list',
                    title: 'View Record',
                }
            ] },
        { path: 'concession', title: 'Concession', icon: 'dashboard', class: '', showSubsection: false,
            subsection: [
                {
                    path: 'new_concession',
                    title: 'Give Concession',
                },
                {
                    path: 'concession_list',
                    title: 'Previous Discounts',
                }
            ] },
        { path: 'marksheet', title: 'Marksheet', icon: 'dashboard', class: '', showSubsection: false,
            subsection: [
                {
                    path: 'update_marks',
                    title: 'Update Marks',
                },
                {
                    path: 'print_marksheet',
                    title: 'Print Marksheet',
                }
            ] },
        { path: 'new_student', title: 'New Student', icon: 'person', class: '', showSubsection: false, subsection: [] },
    ];

    checkAuthentication(): boolean {
        this.jwt = localStorage.getItem('schoolJWT');
        if (this.jwt === null || this.jwt.length === 0) {
            this.isAuthenticated = false;
            return false;
        } else {
            this.isAuthenticated = true;
            return true;
        }
    }

    initializeSchoolData(data: any): void {
        this.schoolPrintName = data.schoolData.printName;
        this.color = data.schoolData.primaryThemeColor;
        this.btn_color = data.schoolData.secondaryThemeColor;
        this.schoolLogo = Constants.DJANGO_SERVER + data.schoolData.logo;
        this.complexFee = data.schoolData.complexFeeStructure;
        this.schoolDbId = data.schoolData.dbId;
        this.schoolDiseCode = data.schoolData.schoolDiseCode;
        this.schoolAddress = data.schoolData.schoolAddress;
    }

    initializeUserData(data: any): void {
        this.username = data.username;
        this.email = data.email;
        this.initializeSchoolData(data);
        if (this.username !== 'eklavya') {
            alert('removing marksheet');
            this.removeMarksheet();
        }
        this.appSection = 'student_profile';
    }

    addPromoteStudent(): void {
        this.ROUTES.forEach(
            section => {
                if (section.path === 'students') {
                    const tempSubSection = new SubSection();
                    tempSubSection.path = 'promote_students';
                    tempSubSection.title = 'Promote';
                    section.subsection.push(tempSubSection);
                }
            }
        );
    }

    addMarksheet(): void {
        let marksheetCheck = false;
        this.ROUTES.forEach(
            section => {
                if (section.path === 'marksheet') {
                    marksheetCheck = true;
                    return;
                }
            }
        );
        if (marksheetCheck) { return; } else {
            const tempSection = new Section();
            tempSection.path = 'marksheet';
            tempSection.title = 'Marksheet';
            tempSection.icon = 'layers';
            tempSection.class = '';
            tempSection.showSubsection = false;
            tempSection.subsection = [];
            this.ROUTES.push(tempSection);
        }
    }

    removeMarksheet(): void {
        let count = -1;
        let index = 0;
        this.ROUTES.forEach(
            section => {
                if (section.path === 'marksheet') {
                    count = index;
                    return;
                }
                ++index;
            }
        );
        if (count === -1) { return; } else {
            this.ROUTES.splice( count, 1);
        }
    }

}

/*
    demo, user1234
    brightstar, 123brightstar
    brighthindi, hindi123
    eklavya, ashta123
    anupreet, itisjp123
    sunrise, akodia123
    madhav, lakhan123
    talent, innovative123
    vidhyamandir, smriti123
    champion, 123champ
*/
