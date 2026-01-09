export interface Level {
    id: number;
    name: string;
}

export interface StoryPage {
    text: string;
    question: string;
    answer: number;
    explanation: string;
}

export interface Question {
    n1: number;
    n2: number;
    op: string;
}

export type Translator = (key: string) => string;

export interface Language {
    code: string;
    name: string;
    label: string;
    icon: string;
    color: string;
}