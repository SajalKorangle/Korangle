

export class CustomXlsx {

    static instance: CustomXlsx;

    static getInstance(): CustomXlsx {
        if (!CustomXlsx.instance) {
            CustomXlsx.instance = new CustomXlsx();
        }
        return CustomXlsx.instance;
    }

    downloadFile(data: any, fileName: any): void {
        /* generate worksheet */
        const ws: WorkSheet = utils.aoa_to_sheet(template);

        /* generate workbook and add the worksheet */
        const wb: WorkBook = utils.book_new();
        utils.book_append_sheet(wb, ws, 'Sheet1');

        /* save to file */
        writeFile(wb, 'korangle_students.csv');
    }

}