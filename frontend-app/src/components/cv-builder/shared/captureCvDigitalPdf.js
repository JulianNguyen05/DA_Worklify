import { jsPDF } from 'jspdf';
import { ROBOTO_REGULAR_BASE64, ROBOTO_BOLD_BASE64 } from './fonts/robotoFontBase64';

const MARGIN = 40;
const LINE_HEIGHT = 16;

function newPdf() {
  const pdf = new jsPDF({ unit: 'pt', format: 'a4' });
  // Nhúng font Unicode — bắt buộc phải làm bước này TRƯỚC khi gọi pdf.text() với
  // chữ có dấu tiếng Việt, nếu không jsPDF fallback về Helvetica (WinAnsiEncoding)
  // và ra chữ sai như đã gặp.
  pdf.addFileToVFS('Roboto-Regular.ttf', ROBOTO_REGULAR_BASE64);
  pdf.addFont('Roboto-Regular.ttf', 'Roboto', 'normal');
  pdf.addFileToVFS('Roboto-Bold.ttf', ROBOTO_BOLD_BASE64);
  pdf.addFont('Roboto-Bold.ttf', 'Roboto', 'bold');
  pdf.setFont('Roboto', 'normal');
  return pdf;
}

function ensureSpace(pdf, y, pageHeight) {
  if (y > pageHeight - MARGIN) {
    pdf.addPage();
    return MARGIN;
  }
  return y;
}

function writeParagraph(pdf, text, y, pageHeight, opts = {}) {
  const { fontSize = 11, bold = false, maxWidth = 515 } = opts;
  pdf.setFont('Roboto', bold ? 'bold' : 'normal');
  pdf.setFontSize(fontSize);
  const lines = pdf.splitTextToSize(text || '', maxWidth);
  lines.forEach((line) => {
    y = ensureSpace(pdf, y, pageHeight);
    pdf.text(line, MARGIN, y);
    y += LINE_HEIGHT;
  });
  return y;
}

function writeSectionTitle(pdf, title, y, pageHeight) {
  y = ensureSpace(pdf, y + 6, pageHeight);
  return writeParagraph(pdf, title.toUpperCase(), y, pageHeight, { fontSize: 13, bold: true });
}

/** objective lưu dạng mảng [{description}] (paragraph list) hoặc string fallback (xem cvTemplateCore.js dòng 466-468) */
function extractObjectiveText(objective) {
  if (Array.isArray(objective)) {
    return objective.map((p) => p?.description || '').filter(Boolean).join('\n');
  }
  return objective || '';
}

/**
 * Sinh PDF "số" (text thật) từ cvData — dùng để convert ngược PDF -> CV Live
 * Builder sau này. Chỉ trích nội dung, KHÔNG quan tâm bố cục/màu sắc/template
 * đang chọn, nên chạy được với dữ liệu từ cả 3 template (Simple/Harvard/
 * Professional) vì cả 3 dùng chung 1 raw schema (xem defaultData trong mỗi
 * template — chỉ khác nhãn contactInfo).
 */
export function buildCvDigitalPdf(cvData) {
  const pdf = newPdf();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const data = cvData?.data || {};
  let y = MARGIN;

  const personalInfo = data.personalInfo || {};
  y = writeParagraph(pdf, personalInfo.fullName || '', y, pageHeight, { fontSize: 18, bold: true });
  if (personalInfo.jobTitle) y = writeParagraph(pdf, personalInfo.jobTitle, y, pageHeight, { bold: true });

  // contactInfo là mảng {label, value} — nhãn khác nhau tuỳ template (Simple/Harvard/
  // Professional), nên duyệt động thay vì đoán tên field cụ thể.
  const contactItems = Array.isArray(data.contactInfo) ? data.contactInfo : [];
  const contactLine = contactItems
    .filter((c) => c?.value)
    .map((c) => `${c.label}: ${c.value}`)
    .join('   |   ');
  if (contactLine) y = writeParagraph(pdf, contactLine, y, pageHeight);

  const objectiveText = extractObjectiveText(data.objective);
  if (objectiveText) {
    y = writeSectionTitle(pdf, 'Mục tiêu nghề nghiệp', y, pageHeight);
    y = writeParagraph(pdf, objectiveText, y, pageHeight);
  }

  const listSection = (key, title, formatItem) => {
    const items = data[key];
    if (!Array.isArray(items) || items.length === 0) return;
    y = writeSectionTitle(pdf, title, y, pageHeight);
    items.forEach((item) => {
      const { heading, body } = formatItem(item);
      if (heading) y = writeParagraph(pdf, heading, y, pageHeight, { bold: true });
      if (body) y = writeParagraph(pdf, body, y, pageHeight);
      y += 4;
    });
  };

  listSection('education', 'Học vấn', (e) => ({
    heading: [e.school, e.major].filter(Boolean).join(' - '),
    body: [e.duration, e.gpa ? `GPA: ${e.gpa}` : '', e.description].filter(Boolean).join('\n'),
  }));

  listSection('experience', 'Kinh nghiệm làm việc', (e) => ({
    heading: [e.role, e.company].filter(Boolean).join(' tại '),
    body: [e.duration, e.description].filter(Boolean).join('\n'),
  }));

  listSection('activities', 'Hoạt động', (a) => ({
    heading: [a.role, a.organization].filter(Boolean).join(' - '),
    body: [a.duration, a.description].filter(Boolean).join('\n'),
  }));

  listSection('projects', 'Dự án', (p) => ({
    heading: [p.name, p.role].filter(Boolean).join(' - '),
    body: [p.duration, p.description].filter(Boolean).join('\n'),
  }));

  listSection('certifications', 'Chứng chỉ', (c) => ({
    heading: c.name,
    body: [c.issuer, c.date].filter(Boolean).join(' - '),
  }));

  listSection('awards', 'Giải thưởng', (a) => ({
    heading: a.title,
    body: [a.issuer, a.date].filter(Boolean).join(' - '),
  }));

  listSection('references', 'Người tham chiếu', (r) => ({
    heading: r.name,
    body: [r.position, r.company].filter(Boolean).join(' - '),
  }));

  if (Array.isArray(data.skills) && data.skills.length) {
    y = writeSectionTitle(pdf, 'Kỹ năng', y, pageHeight);
    const skillLine = data.skills
      .map((s) => (s.description ? `${s.name} (${s.description})` : s.name))
      .filter(Boolean)
      .join(', ');
    y = writeParagraph(pdf, skillLine, y, pageHeight);
  }

  if (Array.isArray(data.hobbies) && data.hobbies.length) {
    y = writeSectionTitle(pdf, 'Sở thích', y, pageHeight);
    y = writeParagraph(pdf, data.hobbies.map((h) => h.name).filter(Boolean).join(', '), y, pageHeight);
  }

  return pdf;
}

export function captureCvDigitalPdfAsFile(cvData, fileName) {
  const pdf = buildCvDigitalPdf(cvData);
  return new File([pdf.output('blob')], fileName, { type: 'application/pdf' });
}