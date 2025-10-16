export interface Literal {
  id: string;
  content: string;
  order: number;
}

export interface Article {
  id: string;
  number: string;
  content: string;
  literals: Literal[];
  order: number;
}

export interface Title {
  id: string;
  name: string;
  articles: Article[];
  order: number;
}

export interface Section {
  id: string;
  name: string;
  type: "section" | "part" | "book" | "custom";
  children: (Chapter | Title | Article | Section)[];
  order: number;
}

export interface Chapter {
  id: string;
  name: string;
  titles: Title[];
  articles: Article[];
  sections: Section[];
  order: number;
}

export interface NormativeVersion {
  id: string;
  versionNumber: string;
  date: string;
  changes: string;
}

export interface Normative {
  id: string;
  name: string;
  description: string;
  chapters: Chapter[];
  articles: Article[]; // Articles without chapter
  versions: NormativeVersion[];
  currentVersion: string;
  createdAt: string;
  updatedAt: string;
}

export type DragItemType = "chapter" | "title" | "article" | "literal" | "section";

export type SectionType = "chapter" | "title" | "article" | "section" | "part" | "book" | "custom";

export interface DragItem {
  id: string;
  type: DragItemType;
  parentId?: string;
}
