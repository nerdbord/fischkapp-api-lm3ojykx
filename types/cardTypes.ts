export interface UpdateCardPayload {
  front: string;
  back: string;
  tags: string[];
}

export interface CreateCardPayload {
  front: string;
  back: string;
  tags: string[];
  author: string;
}
