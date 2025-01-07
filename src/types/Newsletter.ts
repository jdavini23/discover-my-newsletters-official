export interface Newsletter {
  id: string;
  title: string;
  description: string;
  author: string;
  category: string;
  tags: string[];
  subscribers: number;
  rating?: number;
  imageUrl?: string;
}
