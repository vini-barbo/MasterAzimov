export interface Root {
  PubmedArticleSet: PubmedArticleSet
}

export interface PubmedArticleSet {
  PubmedArticle: PubmedArticle[]
}

export interface PubmedArticle {
  MedlineCitation: MedlineCitation
  PubmedData: PubmedData
}

export interface MedlineCitation {
  PMID: number
  DateCompleted: DateCompleted
  DateRevised: DateRevised
  Article: Article
  MedlineJournalInfo: MedlineJournalInfo
  CitationSubset: string
  MeshHeadingList: MeshHeadingList
  CoiStatement: string
}

export interface DateCompleted {
  Year: number
  Month: number
  Day: number
}

export interface DateRevised {
  Year: number
  Month: number
  Day: number
}

export interface Article {
  Journal: Journal
  ArticleTitle: string
  Pagination: Pagination
  ELocationID: [number, string]
  Abstract: Abstract
  AuthorList: AuthorList
  Language: string
  GrantList: GrantList
  PublicationTypeList: PublicationTypeList
  ArticleDate: ArticleDate
}

export interface Journal {
  ISSN: string
  JournalIssue: JournalIssue
  Title: string
  ISOAbbreviation: string
}

export interface JournalIssue {
  Volume: number
  Issue: number
  PubDate: PubDate
}

export interface PubDate {
  Year: number
  Month: string
  Day: number
}

export interface Pagination {
  StartPage: number
  MedlinePgn: number
}

export interface Abstract {
  AbstractText: string
  CopyrightInformation: string
}

export interface AuthorList {
  Author: Author[]
}

export interface Author {
  LastName: string
  ForeName: string
  Initials: string
  AffiliationInfo: any
}

export interface GrantList {
  Grant: Grant[]
}

export interface Grant {
  GrantID: string
  Acronym?: string
  Agency: string
  Country: string
}

export interface PublicationTypeList {
  PublicationType: string
}

export interface ArticleDate {
  Year: number
  Month: number
  Day: number
}

export interface MedlineJournalInfo {
  Country: string
  MedlineTA: string
  NlmUniqueID: number
  ISSNLinking: string
}

export interface MeshHeadingList {
  MeshHeading: MeshHeading[]
}

export interface MeshHeading {
  DescriptorName: string
  QualifierName: any
}

export interface PubmedData {
  History: History
  PublicationStatus: string
  ArticleIdList: ArticleIdList
  ReferenceList: ReferenceList
}

export interface History {
  PubMedPubDate: PubMedPubDate[]
}

export interface PubMedPubDate {
  Year: number
  Month: number
  Day: number
  Hour?: number
  Minute?: number
}

export interface ArticleIdList {
  ArticleId: [number, string, string, string]
}

export interface ReferenceList {
  Reference: Reference[]
}

export interface Reference {
  Citation: string
  ArticleIdList?: ArticleIdList2
}

export interface ArticleIdList2 {
  ArticleId: any
}
