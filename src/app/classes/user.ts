
class SubSection {
    path: string;
    title: string;
}

class Section {
    path: string;
    title: string;
    icon: string;
    class: string;
    showSubsection: boolean;
    subsection: SubSection[] = [];
}

export class User {

    username: string;
    schoolPrintName: string;
    email: string;
    isAuthenticated = false;
    jwt = '';
    complexFee = false;

    color = 'red';
    btn_color = 'danger';
    // imgSrc = '/assets/img/angular2-logo-red.png';
    imgSrc: string;

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
        { path: 'expenses', title: 'Expenses', icon: 'dashboard', class: '', showSubsection: false, subsection: [] },
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
        { path: 'new_student', title: 'New Student', icon: 'person', class: '', showSubsection: false, subsection: [] },
        { path: 'marksheet', title: 'Marksheet', icon: 'layers', class: '', showSubsection: false, subsection: [] },
        /*{ path: 'test_subsection', title: 'Section With Sub', icon: 'dashboard', class: '', showSubsection: false,
            subsection: [
                {
                    path: 'subsection_one',
                    title: 'Subsection One'
                },
                {
                    path: 'subsection_two',
                    title: 'Subsection Two',
                },
            ]
        },*/
        /*{ path: 'user-profile', title: 'User Profile',  icon:'person', class: '' },
        { path: 'table-list', title: 'Table List',  icon:'content_paste', class: '' },
        { path: 'typography', title: 'Typography',  icon:'library_books', class: '' },
        { path: 'icons', title: 'Icons',  icon:'bubble_chart', class: '' },
        { path: 'maps', title: 'Maps',  icon:'location_on', class: '' },
        { path: 'notifications', title: 'Notifications',  icon:'notifications', class: '' },
        { path: 'upgrade', title: 'Upgrade to PRO',  icon:'unarchive', class: 'active-pro' },
        { path: 'fees-receipts', title: 'Fees Receipts',  icon:'content_paste', class: '' },
        { path: 'student-list', title: 'Student List',  icon:'content_paste', class: '' }, */
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

    initializeUser(data: any): void {
        this.username = data.username;
        this.email = data.email;
        if (this.username === 'anupreet') {
            this.color = 'indigo';
            this.btn_color = 'primary';
            this.imgSrc = '/assets/img/anupreet_logo.png';
            this.schoolPrintName = 'ANUPREET PVT ITI';
            this.complexFee = true;
            this.removeMarksheet();
        } else if (this.username === 'brightstarsalsalai') {
            this.color = 'green';
            this.btn_color = 'warning';
            this.imgSrc = '/assets/img/bright_logo.jpg';
            this.schoolPrintName = 'BRIGHTSTAR HIGHER SECONDARY SCHOOL';
            this.complexFee = false;
            this.removeMarksheet();
        } else if (this.username === 'brighthindi') {
            this.color = 'indigo';
            this.btn_color = 'primary';
            this.schoolPrintName = 'BRIGHTSTAR HIGHER SECONDARY SCHOOL';
            this.imgSrc = '/assets/img/bright_logo.jpg';
            this.complexFee = false;
            this.removeMarksheet();
        } else if (this.username === 'brightstar') {
            this.color = 'red';
            this.btn_color = 'danger';
            this.schoolPrintName = 'BRIGHTSTAR HIGHER SECONDARY SCHOOL';
            this.imgSrc = '/assets/img/bright_logo.jpg';
            this.complexFee = false;
            this.removeMarksheet();
        } else if (this.username === 'eklavya') {
            this.color = 'indigo';
            this.btn_color = 'primary';
            this.imgSrc = '/assets/img/eklavya_logo.png';
            this.schoolPrintName = 'Eklavya School';
            this.complexFee = false;
            this.addMarksheet();
        }
        this.appSection = 'student_profile';
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
        let index = 0;
        this.ROUTES.forEach(
            section => {
                if (section.path === 'marksheet') {
                    return;
                }
                ++index;
            }
        );
        if (this.ROUTES.length === index) { return; } else {
            this.ROUTES.splice( index, 1);
        }
    }

}