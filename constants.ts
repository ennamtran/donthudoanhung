
import { PetitionType, PetitionStatus, Petition, User, UserRole } from './types';

// Mật khẩu mặc định cho toàn bộ cán bộ lần đầu đăng nhập
const DEFAULT_PWD = 'Ubnd@123';

export const USERS: User[] = [
  { id: 'u1', name: 'Đinh Quốc Toàn', username: 'dqtoan', password: DEFAULT_PWD, role: UserRole.UBND_LEADER, isFirstLogin: true },
  { id: 'u2', name: 'Lâm Trần Nam', username: 'ltnam', password: DEFAULT_PWD, role: UserRole.UBND_LEADER, isFirstLogin: true },
  { id: 'u3', name: 'Lê Thu Trang', username: 'lttrang', password: DEFAULT_PWD, role: UserRole.UBND_LEADER, isFirstLogin: true },
  { id: 'u4', name: 'Trần Ngọc Hoàn', username: 'tnhoan', password: DEFAULT_PWD, role: UserRole.RECEIVING_OFFICER, isFirstLogin: true },
  { id: 'u5', name: 'Nguyễn Trung Thành', username: 'ntthanh', password: DEFAULT_PWD, role: UserRole.RECEIVING_OFFICER, isFirstLogin: true },
  { id: 'u6', name: 'Trần Thị Thanh Hường', username: 'tthuong', password: DEFAULT_PWD, role: UserRole.DEPT_LEADER, department: 'Phòng Kinh tế', isFirstLogin: true },
  { id: 'u7', name: 'Đỗ Trung Hiếu', username: 'dthieu', password: DEFAULT_PWD, role: UserRole.PROCESSING_OFFICER, department: 'Phòng Kinh tế', isFirstLogin: true },
  { id: 'u8', name: 'Nguyễn Hùng Phong', username: 'nhphong', password: DEFAULT_PWD, role: UserRole.UBND_LEADER, department: 'Văn phòng HĐND&UBND', isFirstLogin: true },
  // Cán bộ BQL dự án ĐTXD xã
  { id: 'u9', name: 'Nguyễn Thanh Duy', username: 'ntduy', password: DEFAULT_PWD, role: UserRole.DEPT_LEADER, department: 'BQL dự án ĐTXD xã', isFirstLogin: true },
  { id: 'u10', name: 'Nguyễn Vân Trường', username: 'vntruong', password: DEFAULT_PWD, role: UserRole.PROCESSING_OFFICER, department: 'BQL dự án ĐTXD xã', isFirstLogin: true },
  // Cán bộ Trung tâm Dịch vụ sự nghiệp công
  { id: 'u11', name: 'Nguyễn Hồng Quân', username: 'nhquan', password: DEFAULT_PWD, role: UserRole.DEPT_LEADER, department: 'Trung tâm Dịch vụ sự nghiệp công', isFirstLogin: true },
  // Cán bộ Trung tâm phục vụ HCC
  { id: 'u12', name: 'Ngô Thị Thương', username: 'ntthuong_hcc', password: DEFAULT_PWD, role: UserRole.DEPT_LEADER, department: 'Trung tâm phục vụ HCC', isFirstLogin: true }
];

export const DEPARTMENTS_DATA: Record<string, string[]> = {
  'Phòng Kinh tế': [
    'Trần Thị Thanh Hường – Phó Trưởng phòng',
    'Đỗ Trung Hiếu – Chuyên viên',
    'Nguyễn Thanh Liêm – Chuyên viên',
    'Nguyễn Thị Mai Liên – Chuyên viên'
  ],
  'Phòng VHXH': [
    'Hoàng Thị Ánh Tuyết – Trưởng phòng',
    'Lê Hồng Nhung – Phó Trưởng phòng',
    'Bùi Thủy Linh – Chuyên viên'
  ],
  'Văn phòng HĐND&UBND': [
    'Nguyễn Hùng Phong – Chánh Văn phòng',
    'Trần Ngọc Hoàn – Phó Chánh VP',
    'Nguyễn Trung Thành – Chuyên viên'
  ],
  'BQL dự án ĐTXD xã': [
    'Nguyễn Thanh Duy – Giám đốc',
    'Nguyễn Vân Trường – Phó Giám đốc',
    'Nguyễn Thế Phong – Cán bộ'
  ],
  'Trung tâm Dịch vụ sự nghiệp công': [
    'Nguyễn Hồng Quân – Giám đốc',
    'Nguyễn Thị Tình – Cán bộ'
  ],
  'Trung tâm phục vụ HCC': [
    'Ngô Thị Thương – Phó Giám đốc',
    'Nguyễn Thị Lan – Chuyên viên',
    'Nguyễn Thanh Hoàng – Chuyên viên',
    'Nguyễn Quang Lưu – Chuyên viên',
    'Trần Thị Liên – Chuyên viên'
  ]
};

export const DEPARTMENTS = Object.keys(DEPARTMENTS_DATA);

export const MOCK_DATA: Petition[] = [
  {
    id: 'DT-2024-001',
    petitioner: {
      name: 'Nguyễn Văn Hùng',
      address: 'Xóm 1, Xã ABC',
      phone: '0901234567',
      idCard: '123456789'
    },
    content: 'Khiếu nại về việc tranh chấp ranh giới đất đai giữa hộ ông Hùng và hộ ông Hải tại Xóm 1.',
    type: PetitionType.COMPLAINT,
    department: 'Phòng Kinh tế',
    cooperatingDepartments: ['Văn phòng HĐND&UBND'],
    assignedOfficer: 'Trần Thị Thanh Hường – Phó Trưởng phòng',
    receivedDate: '2024-01-10',
    deadlineDate: '2024-03-16',
    status: PetitionStatus.PROCESSING,
    progress: [
      { id: '1', date: '10/01/2024, 09:30:00', content: 'Tiếp nhận đơn từ bộ phận Một cửa.', officer: 'Nguyễn Hùng Phong' },
      { id: '2', date: '12/01/2024, 14:20:00', content: 'Chuyển cán bộ chuyên môn xác minh hiện trường.', officer: 'Trần Thị Thanh Hường' }
    ],
    directives: [
      { id: 'd1', date: '11/01/2024, 08:00:00', leaderName: 'Đinh Quốc Toàn', content: 'Giao Phòng Kinh tế chủ trì phối hợp với địa chính xã kiểm tra ranh giới theo bản đồ 2010. Báo cáo kết quả trước ngày 20/1.' }
    ],
    legalGrounds: [],
    editHistory: []
  },
  {
    id: 'DT-2024-002',
    petitioner: {
      name: 'Lê Thị Mai',
      address: 'Thôn Trung, Xã ABC',
      phone: '0987654321',
      idCard: '987654321'
    },
    content: 'Phản ánh về việc ô nhiễm tiếng ồn từ cơ sở sản xuất gỗ cạnh nhà vào ban đêm, gây ảnh hưởng sức khỏe người già.',
    type: PetitionType.REFLECT_PETITION,
    department: 'Phòng VHXH',
    cooperatingDepartments: ['Trung tâm phục vụ HCC'],
    assignedOfficer: 'Hoàng Thị Ánh Tuyết – Trưởng phòng',
    receivedDate: '2025-05-01',
    deadlineDate: '2025-06-15',
    status: PetitionStatus.PENDING,
    progress: [],
    directives: [],
    legalGrounds: [],
    editHistory: []
  }
];
