
export type ClassSection = {
    id: number,
    name: string,
    showSectionNameInDropdown: boolean,
    sectionList: {
        id: number,
        name: string,
        selected: boolean,
    }[],
};

export type ColumnHeadersDetail = {
    displayName: string, // Display (Frontend) Name of backendName
    isSelected: boolean, // Selected in the drop down filter or not.
};
