export interface historyType {
    history: string[];
}

export interface wikiType {
    title: string;
    extract: string;
    url: string;
}

export interface wikiFinalName {
    title: string[];
    extract: string[];
    url: string;
}

export interface similarType {
    [index: string]: string[];
}

export interface titleType {
    wiki: string[];
    title: string[];
    reg: RegExp;
    listNumber: number[];
    almostList: Map<string, string>;
    reveal: boolean;
    sent: string;
}

export interface textType {
    wiki: string[];
    list: string[];
    listNumber: number[];
    almostList: Map<string, string>;
    reveal: boolean;
    sent: string;
}

export interface restartType {
    title: string[];
    url: string;
    restart: any;
    reveal: boolean;
    update: any;
    lose: boolean;
    loading: boolean;
}