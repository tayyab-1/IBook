export interface IPerson {
  username: string,
  first_name: string,
  last_name: string
}

export interface ISection {
  id: number,
  name: string,
  data: string,
  level: number,
  document: number
}

export interface IWordData {
  word: string;
  definitions: {
    definition: string;
    partOfSpeech: string;
  }[];
}
