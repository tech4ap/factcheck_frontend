export interface User {
  id: string;
  email: string;
  name: string;
}

export interface Message {
  id: string;
  title: string;
  content: string;
  status: 'pending' | 'verified' | 'disputed';
  createdAt: string;
  author: string;
}

export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadedAt: string;
  status: 'processing' | 'completed' | 'failed';
}