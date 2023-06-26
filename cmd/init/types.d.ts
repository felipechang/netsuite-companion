interface IStorage {
    name: string
    email: string
    vendor: string
    prefix: string
    lang: string
}

interface InitAnswer extends IStorage {
    store: boolean
}