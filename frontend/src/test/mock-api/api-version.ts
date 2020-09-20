
export class ApiVersion {

    static apiVersion: ApiVersion;

    version = {};

    static getInstance(): ApiVersion {
        if (!ApiVersion.apiVersion) {
            ApiVersion.apiVersion = new ApiVersion();
        }
        return ApiVersion.apiVersion;
    }

    constructor() {}

    getVersion(): any {
        return this.version;
    }

    initializeAndSetVersion(api: any, versionNumber: any): any {
        this.version = {};
        this.setVersion(api, versionNumber);
    }

    setVersion(api: any, versionNumber: any): any {
        this.version = {
            ...this.version,
            ...api.version_list.find(item => {
                return item.version[api.url] === versionNumber;
            }).version
        };
    }

}
