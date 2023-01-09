interface IPageRecordNode {
    id: string
    type: string
}
interface IPageRecord {
    name: string
    id: string
    type: string
    fields: IPageRecordNode[]
    subLists: {
        [key: string]: IPageRecordNode[]
    }
}
interface ImportRecordAnswer {
    option: boolean,
    url: string,
    path: string
}