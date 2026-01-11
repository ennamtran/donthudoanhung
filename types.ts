
export enum UserRole {
  UBND_LEADER = 'Lãnh đạo UBND xã',
  DEPT_LEADER = 'Lãnh đạo phòng',
  RECEIVING_OFFICER = 'Cán bộ tiếp nhận',
  PROCESSING_OFFICER = 'Cán bộ xử lý'
}

export interface User {
  id: string;
  name: string;
  username: string;
  password: string;
  role: UserRole;
  department?: string;
  avatar?: string;
  email?: string;
  phone?: string;
  isFirstLogin: boolean;
}

export interface ProgressLog {
  id: string;
  date: string;
  content: string;
  officer: string;
  statusAfter?: PetitionStatus;
}

export interface Directive {
  id: string;
  date: string;
  leaderName: string;
  content: string;
}

export interface LegalGround {
  title: string;
  uri: string;
  snippet?: string;
}

export interface EditLog {
  id: string;
  date: string;
  editorName: string;
  field: string;
  oldValue: string;
  newValue: string;
}

export interface Petitioner {
  name: string;
  address: string;
  phone: string;
  idCard: string;
}

export interface Attachment {
  id: string;
  name: string;
  type: string;
  data: string; // Base64 string
  date: string;
}

export enum PetitionType {
  COMPLAINT = 'Khiếu nại',
  DENUNCIATION = 'Tố cáo',
  REFLECT_PETITION = 'Kiến nghị, phản ánh'
}

export enum PetitionStatus {
  PENDING = 'Mới tiếp nhận',
  WAITING_APPROVAL = 'Trình lãnh đạo UBND',
  WAITING_ASSIGNMENT = 'Lãnh đạo phòng duyệt',
  PROCESSING = 'Đang thụ lý',
  WAITING_CLOSURE = 'Duyệt hoàn thành',
  RESOLVED = 'Đã hoàn thành',
  OVERDUE = 'Quá hạn'
}

export interface Petition {
  id: string;
  petitioner: Petitioner;
  content: string;
  summary?: string;
  type: PetitionType;
  department: string;
  cooperatingDepartments?: string[]; // Đơn vị phối hợp
  assignedOfficer: string;
  receivedDate: string;
  deadlineDate: string;
  status: PetitionStatus;
  progress: ProgressLog[];
  directives: Directive[];
  legalGrounds?: LegalGround[];
  attachments?: Attachment[];
  responseDraft?: string;
  coordinates?: { lat: number; lng: number };
  editHistory: EditLog[];
}

export type DashboardStats = {
  total: number;
  pending: number;
  waitingApproval: number;
  waitingAssignment: number;
  processing: number;
  waitingClosure: number;
  resolved: number;
  overdue: number;
  nearDeadline: number;
};
