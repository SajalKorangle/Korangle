
export class CacheStorage {

    static cacheStorage: CacheStorage;

    classList: any;
    sectionList: any;

    constructor() {}

    static getInstance(): CacheStorage {
        if (!CacheStorage.cacheStorage) {
            CacheStorage.cacheStorage = new CacheStorage();
        }
        return CacheStorage.cacheStorage;
    }

}