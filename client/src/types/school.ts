export interface School {
  id: number;
  name: string;
  address: string;
  phone: string;
  email: string;
  isVisited: boolean;
  hasQuota: boolean;
  comments: string;
  lat?: number;
  lng?: number;
}

export interface SchoolWithCoords extends School {
  lat?: number;
  lng?: number;
}
