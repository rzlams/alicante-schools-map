export interface House {
  id: number;
  address: string;
  lat: number;
  lng: number;
  price: number;
  warrantyMonths: number;
  requireInsurance: boolean;
  comments: string;
  agentId: number;
  isVisited: boolean;
  isNotAvailable: boolean;
  priority: "HIGH" | "LOW";
}

export interface Agent {
  id: number;
  name: string;
  agency: string;
  address: string;
  phone: string;
  email: string;
  web: string;
}

export interface HousesData {
  houses: House[];
  agents: Agent[];
}
