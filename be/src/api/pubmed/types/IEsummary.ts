export interface IEsummary {
    header: {
        type: string;
        version: string;
    };
    result: Result;
};

export interface IEsummaryResultItem {
    uid: string;
    pubdate: string;
    epubdate: string;
    source: string;
    authors: Author[];
    lastauthor: string;
    title: string;
    sorttitle: string;
    volume: string;
    issue: string;
    pages: string;
    lang: string[];
    nlmuniqueid: string;
    issn: string;
    essn: string;
    pubtype: string[];
    recordstatus: string;
    pubstatus: string;
    articleids: ArticleId[];
    history: HistoryEntry[];
    references: unknown[];
    attributes: string[];
    pmcrefcount: number;
    fulljournalname: string;
    elocationid: string;
    doctype: string;
    srccontriblist: string[];
    booktitle: string;
    medium: string;
    edition: string;
    publisherlocation: string;
    publishername: string;
    srcdate: string;
    reportnumber: string;
    availablefromurl: string;
    locationlabel: string;
    doccontriblist: string[];
    docdate: string;
    bookname: string;
    chapter: string;
    sortpubdate: string;
    sortfirstauthor: string;
    vernaculartitle: string;
};

type Author = {
    name: string;
    authtype: string;
    clusterid: string;
};

type ArticleId = {
    idtype: string;
    idtypen: number;
    value: string;
};

type HistoryEntry = {
    pubstatus: string;
    date: string;
};

type Result = {
    uids: string[];
    [uid: string]: string[] | IEsummaryResultItem;
};

