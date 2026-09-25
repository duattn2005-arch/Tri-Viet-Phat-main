// Buying guides shown under the product grid on /san-pham and each category page, and prerendered for
// crawlers. They target the broad searches ("máy xét nghiệm", "máy xét nghiệm sinh hóa"…) with plain,
// general explanations; product facts come from the catalogue, never from this file.
import type { BrandFaq } from './brands';

export interface CategoryGuide {
  heading: string;
  intro: string[];
  /** Extra questions for this page, besides the generic price / catalogue ones */
  faq?: BrandFaq[];
}

/** One-line description per category, reused in the overview list on /san-pham. */
export const CATEGORY_BLURBS: Record<string, string> = {
  'may-xet-nghiem-sinh-hoa': 'đo các chỉ số hóa sinh trong máu như đường huyết, mỡ máu, men gan, chức năng thận.',
  'may-xet-nghiem-huyet-hoc': 'đếm và phân loại tế bào máu (hồng cầu, bạch cầu, tiểu cầu) cho xét nghiệm công thức máu.',
  'may-xet-nghiem-nuoc-tieu': 'đọc que thử nước tiểu 10–14 thông số, hỗ trợ sàng lọc bệnh thận, tiểu đường, nhiễm trùng tiết niệu.',
  'may-xet-nghiem-dien-giai': 'đo nồng độ ion Na⁺, K⁺, Cl⁻, Ca²⁺ trong máu bằng điện cực chọn lọc ion (ISE).',
  'may-xet-nghiem-mien-dich': 'định lượng hormone, dấu ấn ung thư, tim mạch… bằng kỹ thuật miễn dịch như hóa phát quang.',
  'may-phan-tich-dong-mau': 'đo các chỉ số đông cầm máu như PT (INR), APTT, Fibrinogen.',
  'may-xet-nghiem-hba1c': 'đo HbA1c – chỉ số phản ánh đường huyết trung bình 2–3 tháng, dùng theo dõi bệnh tiểu đường.',
  'hoa-chat-xet-nghiem': 'hóa chất, thuốc thử và dung dịch dùng cho máy huyết học, sinh hóa và các máy khác.',
  'thiet-bi-khac': 'máy ly tâm và thiết bị phụ trợ để chuẩn bị mẫu trong phòng xét nghiệm.',
};

export const CATEGORY_GUIDES: Record<string, CategoryGuide> = {
  all: {
    heading: 'Máy xét nghiệm là gì? Cách chọn máy phù hợp',
    intro: [
      'Máy xét nghiệm là thiết bị phân tích mẫu bệnh phẩm như máu, huyết thanh, nước tiểu để cho ra các chỉ số giúp bác sĩ chẩn đoán và theo dõi điều trị. Một phòng xét nghiệm thường cần nhiều loại máy, mỗi loại đảm nhận một nhóm xét nghiệm riêng.',
      'Khi chọn máy xét nghiệm, cần cân nhắc số mẫu cần chạy mỗi ngày (công suất test/giờ), danh mục xét nghiệm muốn triển khai, nguồn hóa chất ổn định lâu dài và dịch vụ lắp đặt, bảo trì tại chỗ.',
    ],
    faq: [
      {
        q: 'Phòng khám nên chọn máy xét nghiệm nào?',
        a: 'Tùy số mẫu mỗi ngày và danh mục xét nghiệm. Nhiều phòng khám bắt đầu với máy sinh hóa, máy huyết học và máy nước tiểu, sau đó bổ sung máy điện giải, HbA1c hoặc miễn dịch khi nhu cầu tăng. Kỹ sư Trí Việt Phát tư vấn cấu hình theo số mẫu thực tế của cơ sở.',
      },
      {
        q: 'Máy xét nghiệm tự động khác bán tự động thế nào?',
        a: 'Máy tự động tự hút mẫu, trộn thuốc thử, ủ và đo, phù hợp nơi có nhiều mẫu mỗi ngày. Máy bán tự động cần kỹ thuật viên thao tác một phần, chi phí đầu tư thấp hơn, phù hợp số mẫu ít.',
      },
    ],
  },
  'may-xet-nghiem-sinh-hoa': {
    heading: 'Máy xét nghiệm sinh hóa: chức năng và cách chọn',
    intro: [
      'Máy xét nghiệm sinh hóa đo các chỉ số hóa sinh trong máu như glucose, cholesterol, triglycerid, AST, ALT, ure, creatinin… phục vụ đánh giá chuyển hóa, chức năng gan, thận và tim mạch.',
      'Tiêu chí chọn máy gồm công suất (test/giờ), số vị trí mẫu và hóa chất, khả năng tích hợp module điện giải (ISE) và nguồn hóa chất đi kèm.',
    ],
  },
  'may-xet-nghiem-huyet-hoc': {
    heading: 'Máy xét nghiệm huyết học: chức năng và cách chọn',
    intro: [
      'Máy xét nghiệm huyết học đếm và phân loại các tế bào máu để cho kết quả công thức máu toàn phần: hồng cầu, bạch cầu, tiểu cầu, hemoglobin và các chỉ số liên quan.',
      'Máy phân loại bạch cầu 3 thành phần phù hợp phòng khám; máy 5 thành phần cho thông tin chi tiết hơn, thường dùng ở bệnh viện.',
    ],
  },
  'may-xet-nghiem-nuoc-tieu': {
    heading: 'Máy xét nghiệm nước tiểu: chức năng và cách chọn',
    intro: [
      'Máy xét nghiệm nước tiểu đọc tự động que thử 10–14 thông số như glucose, protein, bạch cầu, nitrit, hồng cầu, tỷ trọng, pH… giúp kết quả nhanh và đồng đều hơn đọc bằng mắt.',
      'Máy bán tự động phù hợp số mẫu vừa phải; máy tự động nạp mẫu liên tục phù hợp bệnh viện và trung tâm xét nghiệm.',
    ],
  },
  'may-xet-nghiem-dien-giai': {
    heading: 'Máy xét nghiệm điện giải: chức năng và cách chọn',
    intro: [
      'Máy xét nghiệm điện giải đo nồng độ các ion Na⁺, K⁺, Cl⁻, Ca²⁺ (và Li⁺, pH tùy model) bằng điện cực chọn lọc ion, dùng trong cấp cứu, hồi sức và theo dõi bệnh nhân thận, tim mạch.',
    ],
  },
  'may-xet-nghiem-mien-dich': {
    heading: 'Máy xét nghiệm miễn dịch: chức năng và cách chọn',
    intro: [
      'Máy xét nghiệm miễn dịch định lượng các chất có nồng độ rất thấp như hormone tuyến giáp, hormone sinh sản, dấu ấn ung thư, dấu ấn tim mạch… Công nghệ hóa phát quang cho độ nhạy cao và thời gian trả kết quả nhanh.',
    ],
  },
  'may-phan-tich-dong-mau': {
    heading: 'Máy phân tích đông máu: chức năng và cách chọn',
    intro: [
      'Máy phân tích đông máu đo thời gian và các yếu tố đông cầm máu như PT (INR), APTT, TT, Fibrinogen, dùng trước phẫu thuật và theo dõi bệnh nhân dùng thuốc chống đông.',
    ],
  },
  'may-xet-nghiem-hba1c': {
    heading: 'Máy xét nghiệm HbA1c: chức năng và cách chọn',
    intro: [
      'HbA1c phản ánh mức đường huyết trung bình trong 2–3 tháng, là chỉ số quan trọng để chẩn đoán và theo dõi bệnh tiểu đường. Máy xét nghiệm HbA1c tại chỗ cho kết quả nhanh ngay trong buổi khám.',
    ],
  },
  'hoa-chat-xet-nghiem': {
    heading: 'Hóa chất xét nghiệm: lưu ý khi chọn mua',
    intro: [
      'Hóa chất và thuốc thử cần tương thích với máy đang dùng, có nguồn cung ổn định và hạn sử dụng rõ ràng. Hóa chất chính hãng giúp kết quả ổn định và giảm lỗi, tắc nghẽn cho máy.',
    ],
  },
};

/** Price and catalogue questions for a category page, answered from the catalogue. */
export function categoryFaq(label: string, models: string[], hotline: string): BrandFaq[] {
  const subject = label.charAt(0).toLowerCase() + label.slice(1);
  return [
    {
      q: `Trí Việt Phát có những ${subject} nào?`,
      a: `${models.join(', ')}. Mỗi sản phẩm có trang riêng với thông số kỹ thuật chi tiết.`,
    },
    {
      q: `Giá ${subject} bao nhiêu?`,
      a: `Giá phụ thuộc model, cấu hình và hóa chất đi kèm. Vui lòng gọi hotline ${hotline} hoặc gửi yêu cầu báo giá trên website để nhận báo giá và chính sách chiết khấu.`,
    },
  ];
}
