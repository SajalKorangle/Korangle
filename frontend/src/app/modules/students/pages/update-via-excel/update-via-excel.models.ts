
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
