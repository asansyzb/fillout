export type QuestionType =
  | 'ShortAnswer'
  | 'LongAnswer'
  | 'MultipleChoice'
  | 'EmailInput'
  | 'TextInput'
  | 'DateInput'
  | 'NumberInput';

export interface Question {
  id: string;
  name: string;
  type: QuestionType;
  value: string;
}

export type CalculationType = 'number' | 'text';

export interface Calculation {
  id: string;
  name: string;
  type: CalculationType;
  value: string;
}

export interface UrlParameter {
  id: string;
  name: string;
  value: string;
}

export interface Quiz {
  score: number;
  maxScore: number;
}

export interface ApiResponse {
  responses: {
    questions: Question[];
    calculations: Calculation[];
    urlParameters: UrlParameter[];
    quiz?: Quiz;
    submissionId: string;
    submissionTime: string;
  }[];
  totalResponses: number;
  pageCount: number;
}
