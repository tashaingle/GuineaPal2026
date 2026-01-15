export interface Comment {
    id: string;
    text: string;
    author: string;
    date: string;
}

export interface GuineaGramPost {
    id: string;
    petId: string;
    image: string;
    caption?: string;
    likes: number;
    comments: Comment[];
    date: string;
} 