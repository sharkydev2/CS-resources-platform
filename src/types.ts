// src/types/index.ts

export interface Resource {
  id: string;
  title: string;
  type: 'pdf' | 'doc';
}

export interface Subject {
  id: string;
  title: string;
  instructor?: string;
  description: string;
  rating: number; // 1 to 3
  cours: Resource[];
  tds: Resource[];
  tps: Resource[];
  additionalResources: Resource[];
}

export interface Semester {
  id: string;
  title: string;
  subjects: Subject[];
}