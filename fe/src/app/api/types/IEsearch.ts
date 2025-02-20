export interface IEsearch {
  header: Header;
  esearchresult: Esearchresult;
}

export interface Header {
  type: string;
  version: string;
}

export interface Esearchresult {
  count: string;
  retmax: string;
  retstart: string;
  idlist: string[];
  translationset: Translationset[];
  querytranslation: string;
}

export interface Translationset {
  from: string;
  to: string;
}
