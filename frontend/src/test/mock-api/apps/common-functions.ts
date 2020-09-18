

export function getApiStructure(url: any): any {
    return {
        url: url,
        version_list: [],
    }
}


export function getVersionStructure(version: any, list: any): any {
    return {
        version: version,
        list: list,
    }
}


export function getModelStructure(baseModelObject: any, object: any): any {
    return {
        ...baseModelObject,
        ...object
    }
}
