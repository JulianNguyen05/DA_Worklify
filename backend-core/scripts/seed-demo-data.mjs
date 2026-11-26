#!/usr/bin/env node
/**
 * Tạo dữ liệu demo cho Worklify qua API của backend-core (mật khẩu được mã hoá, dữ liệu đi qua
 * đúng logic nghiệp vụ như khi người dùng tự nhập).
 *
 * Tạo: danh mục kỹ năng, 3 công ty + 6 tin tuyển dụng đang mở, 8 ứng viên có hồ sơ đầy đủ + CV,
 * và các đơn ứng tuyển (cố ý có ứng viên hợp và không hợp để thử xếp hạng AI).
 * Mọi tài khoản demo có email đuôi @demo.worklify.test.
 *
 * Yêu cầu: backend-core đang chạy, MySQL chạy trong container `worklify-mysql`, Node 18+.
 * Chạy (trong thư mục backend-core):
 *   node scripts/seed-demo-data.mjs                     # backend ở http://localhost:8080
 *   node scripts/seed-demo-data.mjs http://localhost:8082
 * Biến môi trường tuỳ chọn: MYSQL_CONTAINER (mặc định worklify-mysql), MYSQL_DB (worklify_db),
 * MYSQL_ROOT_PASSWORD (root123).
 *
 * Xem scripts/README.md để biết mật khẩu chung và cách xoá dữ liệu demo.
 */
import { execFileSync } from 'node:child_process';

const API = `${(process.argv[2] || 'http://localhost:8080').replace(/\/$/, '')}/api/v1`;
const DEMO_PASSWORD = 'Demo@123456';
const DOMAIN = 'demo.worklify.test';
const MYSQL = {
  container: process.env.MYSQL_CONTAINER || 'worklify-mysql',
  db: process.env.MYSQL_DB || 'worklify_db',
  password: process.env.MYSQL_ROOT_PASSWORD || 'root123',
};

// ---------------------------------------------------------------------------
// Dữ liệu
// ---------------------------------------------------------------------------

const SKILLS = [
  'Java', 'Spring Boot', 'Hibernate', 'MySQL', 'PostgreSQL', 'Redis', 'Docker', 'Kubernetes', 'AWS', 'Linux',
  'Git', 'RESTful API', 'Microservices', 'JUnit', 'JavaScript', 'TypeScript', 'ReactJS', 'Redux', 'TailwindCSS',
  'HTML/CSS', 'Node.js', 'Express', 'MongoDB', 'Python', 'SQL', 'Pandas', 'Power BI', 'Excel', 'Thống kê',
  'CI/CD', 'Jenkins', 'Terraform', 'Nginx', 'MISA', 'Kế toán tổng hợp', 'Báo cáo thuế', 'Tư vấn bán hàng',
  'Đàm phán', 'CRM', 'Chăm sóc khách hàng', 'Agile', 'Scrum',
];

const COMPANIES = [
  {
    key: 'finnova', email: `hr.finnova@${DOMAIN}`, name: 'Công ty CP Công nghệ FinNova',
    website: 'https://finnova.example', description: 'Công ty fintech phát triển ví điện tử và nền tảng thanh toán cho doanh nghiệp vừa và nhỏ.',
    jobs: [
      {
        key: 'backend', title: 'Backend Developer (Java Spring Boot)', salaryRange: '20 - 30 triệu', location: 'Hồ Chí Minh', workType: 'FULL_TIME',
        description: '<p>Phát triển và vận hành các dịch vụ thanh toán: xây dựng REST API, xử lý giao dịch, tối ưu hiệu năng truy vấn cơ sở dữ liệu.</p><p>Làm việc theo Scrum cùng đội sản phẩm và QA.</p>',
        requirements: '<ul><li>Tối thiểu 2 năm kinh nghiệm Java, Spring Boot</li><li>Thành thạo MySQL hoặc PostgreSQL, hiểu về transaction</li><li>Có kinh nghiệm Docker, Git</li><li>Biết Redis, Microservices là lợi thế</li></ul>',
      },
      {
        key: 'frontend', title: 'Frontend Developer (ReactJS)', salaryRange: '15 - 25 triệu', location: 'Hồ Chí Minh', workType: 'FULL_TIME',
        description: '<p>Xây dựng giao diện ví điện tử và trang quản trị cho doanh nghiệp, phối hợp với backend để tích hợp API.</p>',
        requirements: '<ul><li>Tối thiểu 1 năm kinh nghiệm ReactJS, JavaScript/TypeScript</li><li>Thành thạo HTML/CSS, TailwindCSS</li><li>Biết Redux, làm việc với RESTful API</li></ul>',
      },
    ],
  },
  {
    key: 'dataviet', email: `talent.dataviet@${DOMAIN}`, name: 'Công ty TNHH Giải pháp Dữ liệu DataViet',
    website: 'https://dataviet.example', description: 'Cung cấp giải pháp phân tích dữ liệu và hạ tầng đám mây cho ngành bán lẻ.',
    jobs: [
      {
        key: 'data', title: 'Data Analyst', salaryRange: '15 - 22 triệu', location: 'Hà Nội', workType: 'FULL_TIME',
        description: '<p>Phân tích dữ liệu bán hàng, xây dựng dashboard báo cáo cho khách hàng bán lẻ, đề xuất cải thiện doanh thu.</p>',
        requirements: '<ul><li>Tối thiểu 1 năm kinh nghiệm SQL, Python (Pandas)</li><li>Thành thạo Power BI hoặc công cụ BI tương đương</li><li>Nắm vững thống kê cơ bản, Excel nâng cao</li></ul>',
      },
      {
        key: 'devops', title: 'DevOps Engineer', salaryRange: '25 - 35 triệu', location: 'Hà Nội', workType: 'FULL_TIME',
        description: '<p>Vận hành hạ tầng AWS, xây dựng pipeline CI/CD, giám sát và tối ưu chi phí hệ thống.</p>',
        requirements: '<ul><li>Tối thiểu 2 năm kinh nghiệm Docker, Kubernetes</li><li>Kinh nghiệm AWS, Linux, Nginx</li><li>Biết Terraform, Jenkins là lợi thế</li></ul>',
      },
    ],
  },
  {
    key: 'saomai', email: `tuyendung.saomai@${DOMAIN}`, name: 'Công ty TNHH Thương mại Sao Mai',
    website: 'https://saomai.example', description: 'Doanh nghiệp phân phối thiết bị văn phòng tại khu vực phía Nam.',
    jobs: [
      {
        key: 'accountant', title: 'Kế toán tổng hợp', salaryRange: '12 - 16 triệu', location: 'Hồ Chí Minh', workType: 'FULL_TIME',
        description: '<p>Hạch toán sổ sách, lập báo cáo tài chính và báo cáo thuế hằng tháng, quản lý công nợ.</p>',
        requirements: '<ul><li>Tối thiểu 2 năm kinh nghiệm kế toán tổng hợp</li><li>Thành thạo MISA, Excel</li><li>Nắm vững quy định về báo cáo thuế</li></ul>',
      },
      {
        key: 'sales', title: 'Nhân viên kinh doanh B2B', salaryRange: '10 - 20 triệu + hoa hồng', location: 'Hồ Chí Minh', workType: 'FULL_TIME',
        description: '<p>Tìm kiếm khách hàng doanh nghiệp, tư vấn giải pháp thiết bị văn phòng, chăm sóc khách hàng sau bán.</p>',
        requirements: '<ul><li>Tối thiểu 1 năm kinh nghiệm tư vấn bán hàng</li><li>Kỹ năng đàm phán, sử dụng CRM</li><li>Chủ động, chịu được áp lực doanh số</li></ul>',
      },
    ],
  },
];

const CANDIDATES = [
  {
    key: 'minh', email: `minh.nguyen@${DOMAIN}`, fullName: 'Nguyễn Văn Minh', headline: 'Backend Developer - Java Spring Boot',
    gender: 'Nam', dob: '1999-03-14', phone: '0901000001', address: 'TP. Thủ Đức, Hồ Chí Minh',
    summary: 'Backend Developer 3 năm kinh nghiệm xây dựng REST API bằng Java Spring Boot cho hệ thống thương mại điện tử. Có kinh nghiệm tối ưu truy vấn MySQL và triển khai bằng Docker.',
    skills: ['Java', 'Spring Boot', 'MySQL', 'Docker', 'Git', 'Redis', 'RESTful API'],
    experiences: [
      { companyName: 'Công ty Phần mềm TechWave', position: 'Backend Developer', startDate: '2022-08-01', description: '- Phát triển REST API quản lý đơn hàng và thanh toán bằng Java Spring Boot\n- Tối ưu truy vấn MySQL, giảm 40% thời gian phản hồi API báo cáo\n- Đóng gói dịch vụ bằng Docker, dùng Redis làm cache' },
      { companyName: 'Công ty Giải pháp Số ABC', position: 'Thực tập sinh Java', startDate: '2021-06-01', endDate: '2022-07-31', description: '- Viết API CRUD với Spring Boot, Hibernate\n- Viết unit test với JUnit' },
    ],
    projects: [{ projectName: 'Hệ thống đặt vé xe khách', role: 'Backend', techStack: 'Java, Spring Boot, MySQL', description: 'Xây dựng API đặt vé, giữ chỗ và thanh toán; xử lý tranh chấp ghế bằng khoá lạc quan.' }],
    education: { schoolName: 'Đại học Bách khoa TP.HCM', major: 'Khoa học Máy tính', degree: 'Kỹ sư', startDate: '2017-09-01', endDate: '2021-09-01' },
    applyTo: ['backend', 'devops', 'data'],
  },
  {
    key: 'lan', email: `lan.tran@${DOMAIN}`, fullName: 'Trần Thị Lan', headline: 'Fresher Java Developer',
    gender: 'Nữ', dob: '2002-11-02', phone: '0901000002', address: 'Quận 7, Hồ Chí Minh',
    summary: 'Sinh viên mới tốt nghiệp ngành Công nghệ Thông tin, có 6 tháng thực tập phát triển backend Java. Mong muốn phát triển lâu dài ở vị trí Backend Developer.',
    skills: ['Java', 'Spring Boot', 'MySQL', 'Git'],
    experiences: [
      { companyName: 'Công ty Phần mềm Sóng Việt', position: 'Thực tập sinh Backend', startDate: '2024-01-01', endDate: '2024-06-30', description: '- Viết API quản lý sản phẩm bằng Spring Boot\n- Thiết kế bảng MySQL cho module kho' },
    ],
    projects: [{ projectName: 'Website quản lý thư viện', role: 'Fullstack (đồ án tốt nghiệp)', techStack: 'Java, Spring Boot, MySQL', description: 'Quản lý mượn trả sách, nhắc hạn qua email, phân quyền thủ thư và bạn đọc.' }],
    education: { schoolName: 'Đại học Công nghệ Thông tin', major: 'Kỹ thuật Phần mềm', degree: 'Cử nhân', startDate: '2020-09-01', endDate: '2024-09-01' },
    applyTo: ['backend', 'frontend'],
  },
  {
    key: 'huy', email: `huy.le@${DOMAIN}`, fullName: 'Lê Quang Huy', headline: 'Frontend Developer - ReactJS',
    gender: 'Nam', dob: '2000-07-21', phone: '0901000003', address: 'Quận Bình Thạnh, Hồ Chí Minh',
    summary: 'Frontend Developer 2 năm kinh nghiệm ReactJS và TypeScript, chú trọng trải nghiệm người dùng và hiệu năng giao diện.',
    skills: ['ReactJS', 'TypeScript', 'JavaScript', 'TailwindCSS', 'Redux', 'HTML/CSS', 'Git'],
    experiences: [
      { companyName: 'Công ty Sáng tạo Số Pixel', position: 'Frontend Developer', startDate: '2023-02-01', description: '- Xây dựng trang quản trị bán hàng bằng ReactJS, TypeScript, Redux\n- Chuyển giao diện sang TailwindCSS, giảm 30% dung lượng CSS\n- Tích hợp RESTful API, xử lý phân trang và lọc dữ liệu' },
    ],
    projects: [{ projectName: 'Ứng dụng quản lý chi tiêu', role: 'Frontend', techStack: 'ReactJS, TypeScript, TailwindCSS', description: 'Biểu đồ thu chi theo tháng, hỗ trợ chế độ tối, chạy tốt trên di động.' }],
    education: { schoolName: 'Đại học Khoa học Tự nhiên TP.HCM', major: 'Công nghệ Thông tin', degree: 'Cử nhân', startDate: '2018-09-01', endDate: '2022-09-01' },
    applyTo: ['frontend', 'backend'],
  },
  {
    key: 'thao', email: `thao.pham@${DOMAIN}`, fullName: 'Phạm Thu Thảo', headline: 'Fullstack Developer - Node.js, ReactJS',
    gender: 'Nữ', dob: '1998-12-05', phone: '0901000004', address: 'Quận 3, Hồ Chí Minh',
    summary: 'Fullstack Developer 3 năm kinh nghiệm với Node.js, Express và ReactJS, từng xây dựng nhiều hệ thống quản lý cho doanh nghiệp vừa và nhỏ.',
    skills: ['Node.js', 'Express', 'ReactJS', 'JavaScript', 'MongoDB', 'MySQL', 'Docker', 'Git'],
    experiences: [
      { companyName: 'Công ty Phần mềm Mekong Soft', position: 'Fullstack Developer', startDate: '2021-09-01', description: '- Phát triển REST API bằng Node.js, Express, MongoDB\n- Xây dựng giao diện quản trị bằng ReactJS\n- Triển khai ứng dụng bằng Docker lên server Linux' },
    ],
    projects: [{ projectName: 'Hệ thống đặt lịch phòng khám', role: 'Fullstack', techStack: 'Node.js, ReactJS, MySQL', description: 'Đặt lịch khám trực tuyến, nhắc lịch qua SMS, quản lý hồ sơ bệnh nhân.' }],
    education: { schoolName: 'Đại học Cần Thơ', major: 'Hệ thống Thông tin', degree: 'Kỹ sư', startDate: '2016-09-01', endDate: '2021-06-01' },
    applyTo: ['backend', 'frontend'],
  },
  {
    key: 'nam', email: `nam.vo@${DOMAIN}`, fullName: 'Võ Hoàng Nam', headline: 'Data Analyst',
    gender: 'Nam', dob: '2000-04-18', phone: '0901000005', address: 'Quận Cầu Giấy, Hà Nội',
    summary: 'Data Analyst 2 năm kinh nghiệm phân tích dữ liệu bán lẻ bằng SQL, Python và Power BI, giúp đội kinh doanh ra quyết định dựa trên số liệu.',
    skills: ['SQL', 'Python', 'Pandas', 'Power BI', 'Excel', 'Thống kê'],
    experiences: [
      { companyName: 'Chuỗi Siêu thị Xanh', position: 'Data Analyst', startDate: '2023-01-01', description: '- Viết truy vấn SQL tổng hợp doanh thu theo cửa hàng và ngành hàng\n- Làm sạch dữ liệu bằng Python, Pandas\n- Xây dựng dashboard Power BI theo dõi tồn kho hằng ngày' },
    ],
    projects: [{ projectName: 'Phân tích giỏ hàng', role: 'Cá nhân', techStack: 'Python, Pandas, SQL', description: 'Tìm các nhóm sản phẩm hay được mua cùng nhau để gợi ý trưng bày.' }],
    education: { schoolName: 'Đại học Kinh tế Quốc dân', major: 'Toán Kinh tế', degree: 'Cử nhân', startDate: '2018-09-01', endDate: '2022-06-01' },
    applyTo: ['data'],
  },
  {
    key: 'tuan', email: `tuan.dang@${DOMAIN}`, fullName: 'Đặng Minh Tuấn', headline: 'DevOps Engineer',
    gender: 'Nam', dob: '1997-09-09', phone: '0901000006', address: 'Quận Đống Đa, Hà Nội',
    summary: 'DevOps Engineer 4 năm kinh nghiệm vận hành hạ tầng AWS và Kubernetes, xây dựng pipeline CI/CD tự động cho nhiều đội phát triển.',
    skills: ['Docker', 'Kubernetes', 'AWS', 'Linux', 'Terraform', 'Jenkins', 'CI/CD', 'Nginx'],
    experiences: [
      { companyName: 'Công ty Dịch vụ Đám mây CloudX', position: 'DevOps Engineer', startDate: '2021-03-01', description: '- Vận hành cụm Kubernetes trên AWS cho hơn 30 dịch vụ\n- Viết Terraform quản lý hạ tầng, dựng pipeline CI/CD bằng Jenkins\n- Cấu hình Nginx, giám sát hệ thống và xử lý sự cố' },
    ],
    projects: [{ projectName: 'Chuyển hạ tầng lên Kubernetes', role: 'DevOps', techStack: 'Docker, Kubernetes, AWS', description: 'Chuyển 12 dịch vụ từ máy ảo sang Kubernetes, giảm 25% chi phí hạ tầng.' }],
    education: { schoolName: 'Học viện Công nghệ Bưu chính Viễn thông', major: 'Mạng máy tính', degree: 'Kỹ sư', startDate: '2015-09-01', endDate: '2020-06-01' },
    applyTo: ['devops', 'backend'],
  },
  {
    key: 'mai', email: `mai.bui@${DOMAIN}`, fullName: 'Bùi Ngọc Mai', headline: 'Kế toán tổng hợp',
    gender: 'Nữ', dob: '1996-02-27', phone: '0901000007', address: 'Quận Tân Bình, Hồ Chí Minh',
    summary: 'Kế toán tổng hợp 5 năm kinh nghiệm, thành thạo MISA và Excel, nắm vững quy trình lập báo cáo tài chính và báo cáo thuế.',
    skills: ['Kế toán tổng hợp', 'Báo cáo thuế', 'MISA', 'Excel'],
    experiences: [
      { companyName: 'Công ty CP Xây dựng Hưng Thịnh', position: 'Kế toán tổng hợp', startDate: '2020-05-01', description: '- Hạch toán sổ sách, lập báo cáo tài chính quý và năm\n- Lập và nộp báo cáo thuế GTGT, TNDN hằng tháng\n- Quản lý công nợ phải thu, phải trả' },
    ],
    projects: [],
    education: { schoolName: 'Đại học Kinh tế TP.HCM', major: 'Kế toán', degree: 'Cử nhân', startDate: '2014-09-01', endDate: '2018-06-01' },
    applyTo: ['accountant', 'data', 'backend'],
  },
  {
    key: 'khoa', email: `khoa.ho@${DOMAIN}`, fullName: 'Hồ Đăng Khoa', headline: 'Nhân viên kinh doanh',
    gender: 'Nam', dob: '1998-06-30', phone: '0901000008', address: 'Quận 10, Hồ Chí Minh',
    summary: 'Nhân viên kinh doanh 3 năm kinh nghiệm bán hàng B2B, giỏi đàm phán và chăm sóc khách hàng doanh nghiệp.',
    skills: ['Tư vấn bán hàng', 'Đàm phán', 'CRM', 'Chăm sóc khách hàng'],
    experiences: [
      { companyName: 'Công ty TNHH Thiết bị Văn phòng Á Châu', position: 'Nhân viên kinh doanh', startDate: '2021-07-01', description: '- Tìm kiếm và tư vấn khách hàng doanh nghiệp về máy in, máy photocopy\n- Đàm phán hợp đồng, đạt 120% chỉ tiêu doanh số năm 2023\n- Quản lý khách hàng trên CRM, chăm sóc sau bán' },
    ],
    projects: [],
    education: { schoolName: 'Đại học Tài chính - Marketing', major: 'Quản trị Kinh doanh', degree: 'Cử nhân', startDate: '2016-09-01', endDate: '2020-06-01' },
    applyTo: ['sales', 'accountant'],
  },
];

// ---------------------------------------------------------------------------
// Tiện ích
// ---------------------------------------------------------------------------

async function call(method, path, body, token) {
  const res = await fetch(API + path, {
    method,
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const text = await res.text();
  let json;
  try { json = JSON.parse(text); } catch { json = { message: text }; }
  if (!res.ok) throw new Error(`${method} ${path} -> ${res.status}: ${json.message || text}`.slice(0, 400));
  return json.data;
}

function sql(statement) {
  return execFileSync('docker', ['exec', '-i', MYSQL.container, 'mysql', '-uroot', `-p${MYSQL.password}`,
    '--default-character-set=utf8mb4', '-N', MYSQL.db], { input: statement, encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] });
}

const esc = (s) => s.replace(/\\/g, '\\\\').replace(/'/g, "''");

async function registerAndLogin(email, role, fullName, companyName) {
  await call('POST', '/auth/register', { email, password: DEMO_PASSWORD, role, fullName, companyName });
  const auth = await call('POST', '/auth/login', { email, password: DEMO_PASSWORD });
  return { token: auth.accessToken, userId: auth.userId };
}

/** CV theo đúng cấu trúc JSON của trình tạo CV (template "simple"). */
function buildCvJson(c) {
  return JSON.stringify({
    data: {
      avatar: { url: '' },
      personalInfo: { fullName: c.fullName, jobTitle: c.headline },
      contactInfo: [
        { label: 'Ngày sinh', value: c.dob.split('-').reverse().join('/') },
        { label: 'Giới tính', value: c.gender },
        { label: 'Số điện thoại', value: c.phone },
        { label: 'Email', value: c.email },
        { label: 'Địa chỉ', value: c.address },
      ],
      sectionTitles: { objective: 'MỤC TIÊU NGHỀ NGHIỆP' },
      objective: [{ description: c.summary }],
      education: [{
        school: c.education.schoolName, major: c.education.major, gpa: '',
        duration: `${c.education.startDate.slice(0, 4)} - ${c.education.endDate.slice(0, 4)}`, description: c.education.degree,
      }],
      experience: c.experiences.map((e) => ({
        company: e.companyName, role: e.position, description: e.description,
        duration: `${e.startDate.slice(5, 7)}/${e.startDate.slice(0, 4)} - ${e.endDate ? `${e.endDate.slice(5, 7)}/${e.endDate.slice(0, 4)}` : 'Hiện tại'}`,
      })),
      projects: c.projects.map((p) => ({ name: p.projectName, role: p.role, duration: '', description: p.description })),
      skills: c.skills.map((s) => ({ name: s, description: '' })),
      activities: [], certifications: [], awards: [], references: [], hobbies: [],
    },
    layout: {
      activeRows: [
        { id: 'row-1', ratio: '30-70', leftItems: ['avatar'], rightItems: ['personalInfo', 'contactInfo'] },
        { id: 'row-2', ratio: '10-0', leftItems: ['objective', 'experience', 'projects', 'skills', 'education'], rightItems: [] },
      ],
      unusedItems: ['activities', 'certifications', 'awards', 'references', 'hobbies', 'customSection'],
    },
    settings: { font: 'Roboto', fontSize: 'medium', template: 'simple', avatarSize: 120, accentColor: '#06B6D4', avatarShape: 'square', primaryColor: '#2563EB' },
  });
}

// ---------------------------------------------------------------------------
// Chạy
// ---------------------------------------------------------------------------

async function main() {
  console.log(`API: ${API} | DB: ${MYSQL.container}/${MYSQL.db}`);

  // Đã có dữ liệu demo thì dừng, tránh tạo trùng
  const existing = sql(`SELECT COUNT(*) FROM users WHERE email LIKE '%@${DOMAIN}';`).trim();
  if (existing !== '0') {
    console.log(`Đã có ${existing} tài khoản @${DOMAIN} — bỏ qua. Xoá dữ liệu demo cũ trước nếu muốn tạo lại (xem scripts/README.md).`);
    return;
  }

  // 1. Danh mục kỹ năng (ứng viên chỉ chọn được kỹ năng đã có trong danh mục)
  sql(`INSERT IGNORE INTO reference_values (type, name) VALUES ${SKILLS.map((s) => `('SKILL','${esc(s)}')`).join(',')};`);
  console.log(`✓ Danh mục kỹ năng: ${SKILLS.length} kỹ năng`);

  // 2. Công ty + tin tuyển dụng
  const jobIds = {};
  const companyIds = [];
  for (const co of COMPANIES) {
    const { token, userId } = await registerAndLogin(co.email, 'EMPLOYER', co.name, co.name);
    const profile = await call('GET', `/employers/${userId}/profile`, undefined, token);
    await call('PUT', `/employers/${userId}/profile`, { companyName: co.name, website: co.website, description: co.description }, token);
    companyIds.push(profile.id);
    for (const job of co.jobs) {
      const created = await call('POST', `/jobs/employers/${profile.id}`, {
        title: job.title, description: job.description, requirements: job.requirements, salaryRange: job.salaryRange,
        location: job.location, workType: job.workType, expiresAt: '2027-06-30T23:59:00',
      }, token);
      jobIds[job.key] = created.id;
    }
    console.log(`✓ ${co.name}: ${co.jobs.length} tin`);
  }

  // Duyệt công ty và mở tin (thay cho bước admin duyệt trên giao diện)
  sql(`UPDATE company_profiles SET verification_status='APPROVED' WHERE id IN (${companyIds.join(',')});
       UPDATE job_postings SET status='ACTIVE' WHERE company_id IN (${companyIds.join(',')});`);
  console.log('✓ Đã duyệt công ty và mở các tin tuyển dụng');

  // 3. Ứng viên + hồ sơ + CV + đơn ứng tuyển
  let applications = 0;
  for (const c of CANDIDATES) {
    const { token, userId } = await registerAndLogin(c.email, 'CANDIDATE', c.fullName);
    await call('POST', `/candidates/${userId}/profile`, {
      fullName: c.fullName, headline: c.headline, phone: c.phone, emailContact: c.email, gender: c.gender,
      dob: c.dob, address: c.address, summary: c.summary,
    }, token);
    for (const [i, e] of c.experiences.entries()) {
      await call('POST', `/candidates/${userId}/experiences`, { ...e, isCurrent: !e.endDate, displayOrder: i }, token);
    }
    for (const [i, p] of c.projects.entries()) {
      await call('POST', `/candidates/${userId}/projects`, { ...p, displayOrder: i }, token);
    }
    await call('POST', `/candidates/${userId}/educations`, { ...c.education, displayOrder: 0 }, token);
    for (const skill of c.skills) {
      await call('POST', `/candidates/${userId}/skills`, { skillName: skill, level: 'INTERMEDIATE' }, token);
    }
    const cv = await call('POST', `/candidates/${userId}/cvs/generated`, { rawText: buildCvJson(c) }, token);
    for (const jobKey of c.applyTo) {
      await call('POST', `/applications/candidates/${userId}`, {
        jobId: jobIds[jobKey], cvId: cv.id, coverLetter: `Kính gửi nhà tuyển dụng, tôi là ${c.fullName}, mong muốn ứng tuyển vị trí này.`,
      }, token);
      applications++;
    }
    console.log(`✓ ${c.fullName}: hồ sơ, ${c.skills.length} kỹ năng, CV, ứng tuyển ${c.applyTo.length} tin`);
  }

  console.log(`\nXong: ${COMPANIES.length} công ty, ${Object.keys(jobIds).length} tin, ${CANDIDATES.length} ứng viên, ${applications} đơn ứng tuyển.`);
}

main().catch((err) => {
  console.error('\nLỗi:', err.message);
  process.exit(1);
});
