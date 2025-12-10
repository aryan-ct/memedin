export interface Employee {
  id: string;
  name: string;
  caption: string;
  imageUrl?: string;
  createdAt: string;
}

export interface MemeData {
  employees: Employee[];
}

export interface CameraSettings {
  selectedEmployeeId: string | null;
  isStreamActive: boolean;
}
