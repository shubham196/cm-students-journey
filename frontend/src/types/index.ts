export interface Student {
  id: string;
  email: string;
  mobile: string;
  full_name: string;
  created_at?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  student: Student | null;
  token: string | null;
  loading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  mobile: string;
  password: string;
  full_name: string;
}

export interface PersonalDetails {
  student_id?: string;
  full_name: string;
  dob: string;
  gender: string;
  father_name: string;
  mother_name: string;
  blood_group?: string;
  nationality: string;
}

export interface AddressDetails {
  student_id?: string;
  permanent_address: string;
  permanent_city: string;
  permanent_state: string;
  permanent_pincode: string;
  current_address: string;
  current_city: string;
  current_state: string;
  current_pincode: string;
}

export interface AcademicDetails {
  student_id?: string;
  tenth_board: string;
  tenth_year: string;
  tenth_percentage: number;
  twelfth_board: string;
  twelfth_year: string;
  twelfth_percentage: number;
  entrance_exam?: string;
  entrance_score?: number;
}

export interface Document {
  student_id: string;
  document_type: string;
  document_url: string;
  status: string;
  uploaded_at: string;
}

export interface AdmissionStep {
  step_name: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  updated_at: string;
}

export interface AdmissionJourney {
  student_id: string;
  steps: AdmissionStep[];
}

export interface DashboardStats {
  progress: number;
  completed_steps: number;
  total_steps: number;
  announcements: Announcement[];
}

export interface Announcement {
  id: string;
  title: string;
  message: string;
  date: string;
}

export interface AdminStudent extends Student {
  progress: number;
  status: string;
  documents_count: number;
  last_activity: string;
}

export type SortDirection = 'asc' | 'desc';

export interface Column<T> {
  key: keyof T | string;
  header: string;
  sortable?: boolean;
  render?: (value: any, row: T) => React.ReactNode;
}
