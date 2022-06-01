export function getAge(currentDate, birthDate) {
    let age = null;

    let current_date = new Date(currentDate).getDate();
    let current_month = new Date(currentDate).getMonth() + 1;
    let current_year = new Date(currentDate).getFullYear();

    let birth_date = new Date(birthDate).getDate();
    let birth_month = new Date(birthDate).getMonth() + 1;
    let birth_year = new Date(birthDate).getFullYear();

    let month = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    if (birth_date > current_date) {
        current_date = current_date + month[birth_month - 1];
        current_month = current_month - 1;
    }

    if (birth_month > current_month) {
        current_year = current_year - 1;
        current_month = current_month + 12;
    }

    var calculated_date = current_date - birth_date;
    var calculated_month = current_month - birth_month;
    var calculated_year = current_year - birth_year;

    age = calculated_year + (calculated_month / 12) + (calculated_date / 365);
    return age;
}
