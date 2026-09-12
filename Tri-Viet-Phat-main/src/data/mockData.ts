import { Product, Article, Partner, DocumentItem, JobOpening } from '../types';
import { REAL_PRODUCTS } from './thietbiyteProducts';

export const COMPANY_INFO = {
  name: 'Công ty TNHH Thương mại Dịch vụ Trí Việt Phát',
  shortName: 'Trí Việt Phát',
  subTitle: 'Công ty thiết bị y tế Trí Việt Phát',
  englishName: 'Tri Viet Phat Medical Equipment Co., Ltd',
  licenseNo: '0105558779',
  licensedBy: 'Sở Kế hoạch và Đầu tư Hà Nội',
  slogan: '“Sự tin tưởng của quý khách hàng là chìa khóa thành công của Công ty”',
  summary: 'Cung cấp giải pháp tổng thể cho phòng xét nghiệm y khoa: từ hệ thống phân tích tự động, máy xét nghiệm huyết học, sinh hóa, nước tiểu đến hóa chất chuẩn và dịch vụ hiệu chuẩn chuẩn mực quốc tế.',
  hotline: '0904.698.699',
  hotline2: '0392.123.688',
  email: 'infothietbiyte168@gmail.com',
  address: 'Số 5, nhà P16 TT Trương Định, phường Tương Mai, Quận Hoàng Mai, Thành phố Hà Nội, Việt Nam',
  vpgd: 'Số 5, nhà P16 TT Trương Định, phường Tương Mai, Quận Hoàng Mai, Thành phố Hà Nội, Việt Nam',
  website: 'www.thietbiytegroup.com',
  yearsOfExperience: '16+',
  genuineReagents: '100%',
  provincesCovered: '34',
  zaloUrl: 'https://zalo.me/0904698699',
  facebookUrl: 'https://www.facebook.com/thietbiytevip',
  logoUrl: '/tri-viet-phat1.jpg',
  heroImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB1NM5vdfpcge4IOvCHv0ZtXWueMsjA4dvK1lqrK_gw4m8LjeSfsqphPQGwQfoozRSlLtYdeIpBE1ICsbhIx0RwUUV1WzP7Ugr5ay1Y57Bg4TXrodqsdY0Ud-Wisbb9iT-VObiofZNG6msqtn-7Ti9lMKS8hRi8Th4a_Lk1GXod7BLVOnb_rPZ_f3N1wZs14LDhg5lAVTUQJ6vX20OcbmEdhgd7iNTiY8DIDN_8yrUTVHmL2Vt39Wh53A',
  aboutImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDF63WwJj_P_XstrFS-qvb_72lkEQsYYWJBVs8Nfedx2CZFhSWHTaCF2xSnevdwwl9Msji72ah9_fV1mfynBJ8tDTHgHVuxWqOlds-4u6xvi7HboTEkB8nB34AP8MRDCd8rjVMblvABIKwdlxLkjsK1O3cHdqcFGRCRkiIOqS61ceVDzxHMZ1qASS_-L-CiwOnTBloez4MGD_eUejZpmokFvbWPMS6xTOeyvKOPCbtqarekRQbeWjtNAg',
  formBgImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBfHyCzMk0MvoPL423GD2WtWUHx_FXHbyQMji2GlBvpnmr1XmEISyIgrHbX5T-WMgDeAG9r40lWl6_mVAZTe7NUTP9tOtfqXSZqx-IRtTK6oDktnFGyejL5dE0ODYfNu3IYuwwf2YTEKKBTnBRQLVU1_FhB4ip_O3qgRLm-vZWOvYhDlbOeNR_3Do2J8cwQ8KyxzUpAkpii8R_fiD1Zk0qoLe2urFOz-c-JuxPWBMz6QVGBHCQWEaDbjQ',
};

export const CORE_VALUES = [
  {
    title: 'Chất lượng',
    desc: 'Tạo uy tín về dịch vụ thiết bị y tế và vật tư tiêu hao cam kết tốt nhất.',
    icon: 'verified',
    color: 'bg-secondary',
  },
  {
    title: 'Uy tín',
    desc: 'Với 16 năm xây dựng và phát triển về thiết bị y tế và vật tư tiêu hao trên toàn quốc.',
    icon: 'workspace_premium',
    color: 'bg-[#001d31]',
  },
  {
    title: 'Hợp tác',
    desc: 'Trí Việt Phát số 1 về máy móc thiết bị y tế và vật tư tiêu hao ngành y.',
    icon: 'handshake',
    color: 'bg-secondary',
  },
];

export const BUSINESS_AREAS = [
  {
    title: 'Máy móc trang thiết bị y tế',
    desc: 'Hệ thống máy xét nghiệm sinh hóa, huyết học, miễn dịch, đông máu, nước tiểu tự động.',
  },
  {
    title: 'Hóa chất xét nghiệm',
    desc: 'Hóa chất phân tích dùng trong y tế đạt chuẩn kiểm định CE & FDA.',
  },
  {
    title: 'Thiết bị đo lường kiểm nghiệm',
    desc: 'Máy phân tích chuyên sâu cho nghiên cứu và chẩn đoán lâm sàng.',
  },
  {
    title: 'Hóa chất y tế & công nghiệp',
    desc: 'Các loại dung môi, chất tẩy rửa sinh học và vật tư phụ trợ phòng Lab.',
  },
  {
    title: 'Dịch vụ lắp đặt bảo trì',
    desc: 'Bảo dưỡng định kỳ, sửa chữa thiết bị y tế theo chuẩn nhà sản xuất.',
  },
  {
    title: 'Tư vấn thiết kế chuyên sâu',
    desc: 'Thiết kế lắp đặt phòng xét nghiệm đạt tiêu chuẩn an toàn sinh học cấp I, II.',
  },
];

export const PRODUCTS: Product[] = REAL_PRODUCTS;

export const PARTNERS: Partner[] = [
  { name: 'DIRUI', textColor: 'text-secondary', highlight: true },
  { name: 'CHEMA', subName: 'DIAGNOSTICA', textColor: 'text-[#0b1c30]' },
  { name: 'Wondfo', textColor: 'text-primary', highlight: true },
  { name: 'EKF', textColor: 'text-secondary', bgColor: 'bg-secondary-fixed' },
  { name: 'Drawray', textColor: 'text-primary' },
  { name: 'AUDICOM', textColor: 'text-medical-blue-deep' },
  { name: 'Convergent', subName: 'Technologies', textColor: 'text-[#0b1c30]' },
  { name: 'dewei 德威', textColor: 'text-primary' },
];

export const ARTICLES: Article[] = [
  {
    id: 'vat-tu-tieu-hao-y-te-2025',
    title: 'Vật tư tiêu hao y tế 2025: Bảng giá và Dịch vụ từ Trí Việt Phát',
    slug: 'vat-tu-tieu-hao-y-te-2025-bang-gia-va-dich-vu',
    date: '13/01/2025',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC1iLgI3rum62LyvFc27EuuGdXBBy_BeR9_TkwpZMDvnhFdq_TS1b29E1SzkC5yJTjiRfBQx8n8xv8D1X9wrVcIvzJ7dZZrOO7npZooef6Ih84BGkPhj9RYaEWovlhd53fxZw4WKVFVPgE6IyW-GR6HJ177CzQawJhC3AYgWWRXi3hDxX5sDxouL4gfxUu9YR4MW35wnP095_feYWedemzdYIlFHXN8nhDF4VHUaouGBZMYGAkuUSmDVw',
    alt: 'Bảng giá vật tư tiêu hao y tế 2025',
    category: 'Thị trường y tế',
    readTime: '5 phút đọc',
    excerpt: 'Giới thiệu: Trong bối cảnh ngành y tế ngày càng phát triển, nhu cầu về vật tư tiêu hao y tế trở nên cường độ hơn bao giờ hết. Năm 2025 được dự báo sẽ có những bước ngoặt mới về tiêu chuẩn kỹ thuật...',
    content: [
      'Bước sang năm 2025, thị trường thiết bị và vật tư tiêu hao y tế tại Việt Nam chứng kiến sự chuyển dịch mạnh mẽ hướng tới các tiêu chuẩn chất lượng khắt khe hơn. Các bệnh viện công lập và hệ thống y tế tư nhân ngày càng chú trọng vào nguồn gốc xuất xứ minh bạch, độ tinh khiết hóa chất và chứng chỉ kiểm định quốc tế như CE và FDA.',
      'Công ty TNHH Thiết bị Y tế Trí Việt Phát với vị thế là nhà cung cấp uy tín 16 năm qua, chính thức công bố khung bảng giá ưu đãi mới cho các dòng vật tư tiêu hao phòng xét nghiệm: cuvette nhựa trắc quang, kim lấy mẫu chân không, ống nghiệm chống đông EDTA/Heparin, và các loại hóa chất tẩy rửa sinh học chuyên dụng.',
      'Đặc biệt, dịch vụ hậu mãi năm 2025 được nâng cấp toàn diện: cam kết giao hàng hỏa tốc trong 2-4 giờ tại khu vực nội thành Hà Nội và TP.HCM, hỗ trợ bảo quản lạnh tiêu chuẩn GDP từ kho đến tận phòng xét nghiệm của quý khách hàng.'
    ],
    keyPoints: [
      'Cập nhật chính sách giá sỉ ưu đãi năm 2025 cho bệnh viện và phòng khám',
      'Cam kết 100% hàng hóa có CO/CQ và giấy phép lưu hành của Bộ Y Tế',
      'Hỗ trợ kỹ sư test thử mẫu và hiệu chuẩn máy móc miễn phí'
    ]
  },
  {
    id: 'cach-chon-vat-tu-tieu-hao',
    title: 'Cách chọn vật tư tiêu hao cho phòng thí nghiệm y tế',
    slug: 'cach-chon-vat-tu-tieu-hao-cho-phong-thi-nghiem-y-te',
    date: '29/11/2024',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAhap8zGfKiJ5CAmjRZOuk0bD3up_QRLPH5vgLn2aihvrFVl3ZNvUV1irv7gfUl4NVy3OZVAcHjloAKUxauDliA4VCLeCnuqTGJfyDeOKnF1XOimlgioxcoKGC2aai0Ti5a40WX7KcRKZUUPMozsZw3Vgq8yK6EPejSUTJp1lxw32UuvE4Wp2bRW_K0tMeqUv2HFIfBHt38IGhtY14-E5vLv8X5-Oc9tckdKTOWdh5018akfjHtB9-vvA',
    alt: 'Cách chọn vật tư tiêu hao phòng xét nghiệm',
    category: 'Kiến thức xét nghiệm',
    readTime: '6 phút đọc',
    excerpt: 'Cách Chọn Vật Tư Tiêu Hao Cho Phòng Thí Nghiệm Y Tế: Hướng Dẫn Từ Trí Việt Phát. Trong lĩnh vực y tế, phòng thí nghiệm đóng vai trò quyết định trong việc bảo đảm kết quả chẩn đoán chính xác...',
    content: [
      'Trong thực hành xét nghiệm lâm sàng, kết quả phân tích chỉ có thể chính xác khi mẫu bệnh phẩm được xử lý bằng những vật tư tiêu hao đạt chuẩn. Một chiếc đầu tip pipette bị nhiễm hạt bụi vi mô hay một ống nghiệm chứa sai tỷ lệ chất chống đông có thể làm sai lệch hoàn toàn kết quả chẩn đoán của bác sĩ.',
      'Khi lựa chọn vật tư tiêu hao, nhà quản lý phòng Lab cần lưu ý 4 tiêu chí cốt lõi: 1) Tương thích sinh học tuyệt đối không gây tán huyết; 2) Dung sai kích thước cơ học chuẩn xác để không kẹt kim máy tự động; 3) Khả năng chịu hóa chất và ly tâm tốc độ cao; 4) Giấy chứng nhận vô trùng (Sterile) và không chứa enzyme phân giải RNA/DNA.',
      'Trí Việt Phát luôn hỗ trợ khách hàng kiểm tra độ tương thích của vật tư tiêu hao với hệ thống máy hiện hữu trước khi ký kết hợp đồng cung cấp lâu dài.'
    ],
    keyPoints: [
      'Tiêu chuẩn kích thước và độ trong suốt quang học của cuvette xét nghiệm',
      'Cách nhận biết ống lấy máu chân không đạt chuẩn ISO 6710',
      'Kinh nghiệm quản lý hạn sử dụng và lưu kho hóa chất phòng Lab'
    ]
  },
  {
    id: 'vat-tu-tieu-hao-y-te-la-gi',
    title: 'Vật tư tiêu hao y tế là gì',
    slug: 'vat-tu-tieu-hao-y-te-la-gi-dinh-nghia-va-phan-loai',
    date: '27/11/2024',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDepxvuGtVt4cJwusq-vtbZuWuB5jJ4YIssTWNehTvw_vwhgrHlzp194ZsV1cU0zzIBGbgvtxxb06vWJB1Wlz71SZu77pewcmg_oG5x2u9jwsJXfqmDpbIN4NGq2JmkWw87CRVn-roKa3FiqMKztL0pmdgin0udvTpEXOJWd1Nq0TxZVAf7XqdECerDnHHDQufZwt2jUsD-LemIJSrlvDcApjcAn_0BFiKnMZpakPoBr2hKKSPl27F0Vg',
    alt: 'Định nghĩa vật tư tiêu hao y tế',
    category: 'Thuật ngữ ngành y',
    readTime: '4 phút đọc',
    excerpt: 'Trong ngành y tế, vật tư tiêu hao y tế là một trong những yếu tố quan trọng không thể thiếu trong quy trình chăm sóc và điều trị bệnh nhân. Định nghĩa chi tiết và phân loại theo thông tư mới...',
    content: [
      'Vật tư tiêu hao y tế (Medical Consumables / Disposables) là những sản phẩm, dụng cụ, vật liệu y tế chỉ được sử dụng một lần hoặc có số lần tái sử dụng giới hạn theo khuyến cáo của nhà sản xuất nhằm ngăn ngừa nguy cơ nhiễm trùng chéo trong bệnh viện.',
      'Theo phân loại của Bộ Y Tế, vật tư tiêu hao bao gồm: vật tư phòng xét nghiệm (que thử, hóa chất, đầu tip, phiến kính), vật tư can thiệp ngoại khoa (chỉ khâu, bông gạc, găng tay vô trùng), và vật tư tiêm truyền, hồi sức (bơm kim tiêm, dây truyền dịch, catheter).',
      'Việc phân loại chính xác theo phân nhóm A, B, C, D là căn cứ pháp lý quan trọng để cơ sở y tế thực hiện thủ tục đấu thầu và bảo hiểm y tế thanh toán đúng quy định.'
    ],
    keyPoints: [
      'Định nghĩa pháp lý theo Nghị định 98/2021/NĐ-CP và Nghị định 07/2023/NĐ-CP',
      'Bảng danh mục các nhóm vật tư tiêu hao xét nghiệm trọng yếu',
      'Nguyên tắc kiểm soát nhiễm khuẩn và xử lý rác thải y tế sau sử dụng'
    ]
  },
  {
    id: 'mua-vat-tu-tieu-hao-o-dau-gia-tot',
    title: 'Mua vật tư tiêu hao y tế ở đâu giá tốt',
    slug: 'mua-vat-tu-tieu-hao-y-te-o-dau-gia-tot-chinh-hang',
    date: '27/11/2024',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAC8d--QjRpPFGyYzV8M3mEUC0TBlvE9Amyt3FiIaNAtfP6l3IYAGmG5X2NiqlHeSRo9bLFUs0610JrwMDP7UOaaPyYSnfQYqdAHw7OowLttAdb3v-juVx5vvblnGUOUuIKUZhxv_n5uB01QFxNLasyRPmaOX5GCQ6rt_EKwflL2TJNUfsQ0e-XD7kJyhgLQn0x7YSLs8dc9GtVA7VDHCYRzbmjFynzDLDxt7U5QmtP340MXzXpj_rsmA',
    alt: 'Địa chỉ mua vật tư tiêu hao y tế giá tốt',
    category: 'Tư vấn mua sắm',
    readTime: '4 phút đọc',
    excerpt: 'Mua Vật Tư Tiêu Hao Y Tế Ở Đâu Giá Tốt? Tìm Hiểu Về Trí Việt Phát. Trong ngành y tế, vật tư tiêu hao đóng vai trò vô cùng quan trọng, giúp giảm thiểu chi phí và tối ưu hoạt động phòng khám...',
    content: [
      'Một trong những bài toán đau đầu nhất của các chủ đầu tư phòng khám và giám đốc bệnh viện là làm sao cân bằng giữa chi phí vật tư và chất lượng xét nghiệm. Mua hàng giá rẻ trôi nổi dễ gặp nguy cơ hóa chất kém phẩm chất, hỏng điện cực máy hoặc kết quả sai lệch.',
      'Trí Việt Phát giải quyết triệt để bài toán này bằng cách nhập khẩu trực tiếp số lượng lớn từ các nhà máy sản xuất chính hãng, cắt giảm toàn bộ các khâu trung gian, từ đó mang đến mức giá cạnh tranh nhất thị trường kèm hóa đơn VAT đầy đủ.',
      'Bên cạnh đó, chính sách chiết khấu lũy tiến và công nợ linh hoạt cho các đơn vị ký hợp đồng định kỳ hàng năm giúp tối ưu dòng tiền vận hành cho phòng khám.'
    ],
    keyPoints: [
      'Trực tiếp phân phối không qua đại lý trung gian',
      'Hóa đơn chứng từ, kiểm định xuất xứ rõ ràng 100%',
      'Chính sách công nợ và đổi trả hàng linh hoạt trong 48 giờ'
    ]
  },
  {
    id: 'quy-dinh-chat-luong-vat-tu-tieu-hao',
    title: 'Quy định về chất lượng vật tư tiêu hao y tế tại Việt Nam',
    slug: 'quy-dinh-ve-chat-luong-vat-tu-tieu-hao-y-te-tai-viet-nam',
    date: '27/11/2024',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA-70MzlqT9ogbEiYoeFBNvSZsYkvXNwJMJE-bYzZQYgeaKmawgsWtIIgyucOWpLNgnTXl-vjomrGw3rlu5a8XlVLonHd4da_1XSwzBdK8l5iMQ9skfLD7kyI3yC1oGXbdghS5_RtziBwIf_cJQcU3y04ZFXyO5F0sWRXUoZ-Gxs6ugucgTyDdr-ZWFJdWf0W0kLAz9CG1a9TnmcmRO7cGni7oRXUGQzHHUBGpZ1LFrRdJAMyS2PA922A',
    alt: 'Quy định chất lượng vật tư y tế',
    category: 'Pháp lý y tế',
    readTime: '5 phút đọc',
    excerpt: 'Ngày nay, sự phát triển của ngành y tế tại Việt Nam đòi hỏi phải bảo đảm chất lượng cao trong mọi loại vật tư tiêu hao y tế. Chất lượng y tế không chỉ bảo vệ an toàn cho bệnh nhân...',
    content: [
      'Bộ Y Tế Việt Nam áp dụng hệ thống tiêu chuẩn kỹ thuật quốc gia TCVN kết hợp tiêu chuẩn quốc tế ISO 13485 đối với tất cả các đơn vị sản xuất, nhập khẩu và phân phối trang thiết bị y tế. Mọi lô hàng vật tư tiêu hao nhập khẩu đều phải có số lưu hành hoặc giấy phép nhập khẩu hợp lệ.',
      'Ngoài ra, các hóa chất chẩn đoán in vitro (IVD) phải trải qua quy trình đánh giá lâm sàng hoặc thử nghiệm tại các viện đầu ngành trước khi được cấp phép thương mại.',
      'Trí Việt Phát luôn chủ động tuân thủ 100% hồ sơ công bố tiêu chuẩn áp dụng đối với trang thiết bị y tế loại A, B và đăng ký lưu hành đối với loại C, D.'
    ],
    keyPoints: [
      'Hệ thống quản lý chất lượng ISO 13485:2016 trong phân phối thiết bị y tế',
      'Hồ sơ kỹ thuật chung ASEAN (CSDT) trong quản lý thiết bị y tế',
      'Trách nhiệm bảo đảm chất lượng và giải trình kiểm tra của nhà phân phối'
    ]
  },
  {
    id: 'thu-tuc-nhap-khau-vat-tu-tieu-hao',
    title: 'Thủ tục nhập khẩu vật tư tiêu hao y tế như thế nào',
    slug: 'thu-tuc-nhap-khau-vat-tu-tieu-hao-y-te-nhu-the-nao',
    date: '27/11/2024',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA1kbm0dlfyilRPXaxQCd5t9L5LUg0t41TGQG9IWIi2c10b01PdwmAwDJa3f7FZ5qY6TAfaP8vAvrfdiqCk6ziftjJ7kuadjmydE_uDfTMtLOlghlSh-MJPt_CLixNSgRtZzF-RUgQnsyUrxPmrZtN2FMyMc9xipVKrUxtcwh6llsyHr2nhuIPEaPJ75f0q9RRnJV3jxiKFOofl67ZPLffSkPW5zALSuLBBg-gOglW2TniEPIFu1JxsdQ',
    alt: 'Thủ tục nhập khẩu trang thiết bị y tế',
    category: 'Thương mại quốc tế',
    readTime: '6 phút đọc',
    excerpt: 'Thủ Tục Nhập Khẩu Vật Tư Tiêu Hao Y Tế: Hướng Dẫn Từ Trí Việt Phát. Hướng dẫn toàn diện về quy trình xin giấy phép lưu hành, phân loại thiết bị y tế loại A, B, C, D theo nghị định mới nhất...',
    content: [
      'Quy trình thông quan hàng hóa y tế đòi hỏi sự chuẩn bị kỹ lưỡng về mặt chứng từ hải quan: phân loại trang thiết bị y tế theo mức độ rủi ro, giấy chứng nhận lưu hành tự do CFS (Certificate of Free Sale), chứng nhận chất lượng ISO 13485 của nhà sản xuất.',
      'Với các mặt hàng hóa chất xét nghiệm cần bảo quản lạnh (2 - 8°C), thủ tục mở tờ khai hải quan và đưa hàng về bảo quản tại kho đạt chuẩn phải diễn ra nhanh chóng để tránh đứt gãy chuỗi cung ứng lạnh.',
      'Đội ngũ xuất nhập khẩu giàu kinh nghiệm của Trí Việt Phát đã xử lý hàng trăm lô hàng nhập khẩu từ Đức, Mỹ, Nhật Bản và Trung Quốc, đảm bảo tiến độ giao hàng đúng cam kết cho các dự án thầu y tế trên cả nước.'
    ],
    keyPoints: [
      'Phân loại mức độ rủi ro thiết bị y tế theo 4 nhóm A, B, C, D',
      'Các loại giấy phép: Giấy chứng nhận CFS, CO, CQ và số đăng ký lưu hành',
      'Quy trình bảo quản chuỗi lạnh (Cold Chain) đối với sinh phẩm xét nghiệm'
    ]
  }
  ,{
    id: "xet-nghiem-ft3-chan-doan-benh-ly-tuyen-giap",
    title: "Xét nghiệm FT3 hữu hiệu trong chuẩn đoán bệnh lý tuyến giáp",
    slug: "xet-nghiem-ft3-chan-doan-benh-ly-tuyen-giap",
    date: "15/01/2025",
    image: "https://login.medlatec.vn//ImagePath/images/20200429/20200429_tuyen-giap.jpg.png",
    alt: "Xét nghiệm FT3 hữu hiệu trong chuẩn đoán bệnh lý tuyến giáp",
    category: "Kiến thức sức khỏe",
    readTime: "5 phút đọc",
    excerpt: "&nbsp; Rối loạn hormon tuyến giáp là nguyên nhân của các bệnh lý tuyến giáp. Cho nên việc thường xuyên kiểm tra nồng độ hormon tuyến giáp là biện pháp hữu hiệu trong việc theo dõi, phát hiện sớm các bệnh lý tuyến giáp. FT3 mà một trong những hormon cần phải theo dõi thường [&hellip;]",
    content: [
      "&nbsp; Rối loạn hormon tuyến giáp là nguyên nhân của các bệnh lý tuyến giáp. Cho nên việc thường xuyên kiểm tra nồng độ hormon tuyến giáp là biện pháp hữu hiệu trong việc theo dõi, phát hiện sớm các bệnh lý tuyến giáp. FT3 mà một trong những hormon cần phải theo dõi thường [&hellip;]",
      "Để tìm hiểu thêm về bài viết 'Xét nghiệm FT3 hữu hiệu trong chuẩn đoán bệnh lý tuyến giáp' cũng như các giải pháp chẩn đoán xét nghiệm liên quan, quý khách hàng vui lòng liên hệ trực tiếp Trí Việt Phát Medical để được tư vấn chuyên sâu.",
      "Trí Việt Phát cam kết cung cấp các hệ thống máy xét nghiệm và sinh phẩm chẩn đoán y khoa chính hãng, đáp ứng tiêu chuẩn khắt khe của Bộ Y Tế."
    ],
    keyPoints: [
      "Nội dung chuyên sâu cập nhật từ cổng thông tin Thietbiytegroup.com",
      "Hướng dẫn thực hành xét nghiệm và ứng dụng lâm sàng thực tế",
      "Liên hệ hotline 0904.698.699 - 0392.123.688 để được hỗ trợ 24/7"
    ]
  }
  ,{
    id: "xet-nghiem-tsh-chan-doan-cac-benh-ve-tuyen-giap",
    title: "Xét nghiệm TSH trong việc chẩn đoán các bệnh về tuyến giáp",
    slug: "xet-nghiem-tsh-chan-doan-cac-benh-ve-tuyen-giap",
    date: "15/01/2025",
    image: "https://login.medlatec.vn//ImagePath/images/20200207/20200207_xet-nghiem-tsh-01.jpg",
    alt: "Xét nghiệm TSH trong việc chẩn đoán các bệnh về tuyến giáp",
    category: "Kiến thức sức khỏe",
    readTime: "5 phút đọc",
    excerpt: "TSH là gì? Xét nghiệm TSH liên quan gì đến tuyến giáp. TSH sẽ thông báo cho tuyến giáp làm gì? Cùng giải đáp thắc mắc trong bài viết dưới đây!",
    content: [
      "TSH là gì? Xét nghiệm TSH liên quan gì đến tuyến giáp. TSH sẽ thông báo cho tuyến giáp làm gì? Cùng giải đáp thắc mắc trong bài viết dưới đây!",
      "Để tìm hiểu thêm về bài viết 'Xét nghiệm TSH trong việc chẩn đoán các bệnh về tuyến giáp' cũng như các giải pháp chẩn đoán xét nghiệm liên quan, quý khách hàng vui lòng liên hệ trực tiếp Trí Việt Phát Medical để được tư vấn chuyên sâu.",
      "Trí Việt Phát cam kết cung cấp các hệ thống máy xét nghiệm và sinh phẩm chẩn đoán y khoa chính hãng, đáp ứng tiêu chuẩn khắt khe của Bộ Y Tế."
    ],
    keyPoints: [
      "Nội dung chuyên sâu cập nhật từ cổng thông tin Thietbiytegroup.com",
      "Hướng dẫn thực hành xét nghiệm và ứng dụng lâm sàng thực tế",
      "Liên hệ hotline 0904.698.699 - 0392.123.688 để được hỗ trợ 24/7"
    ]
  }
  ,{
    id: "benh-tuyen-giap",
    title: "FT4 - Chỉ số cơ bản trong theo dõi các bệnh lý tuyến giáp",
    slug: "benh-tuyen-giap",
    date: "15/01/2025",
    image: "https://thietbiytegroup.com/wp-content/uploads/2024/08/pasted-image-0.jpg",
    alt: "FT4 - Chỉ số cơ bản trong theo dõi các bệnh lý tuyến giáp",
    category: "Kiến thức sức khỏe",
    readTime: "5 phút đọc",
    excerpt: "Tuyến giáp là một trong những tuyến nội tiết có chức năng vô cùng quan trọng đối với cơ thể. Cùng Trí Việt Phát tìm hiểu những thông tin liên quan và giải đáp tuyến giáp là bệnh gì qua bài viết dưới đây nhé",
    content: [
      "Tuyến giáp là một trong những tuyến nội tiết có chức năng vô cùng quan trọng đối với cơ thể. Cùng Trí Việt Phát tìm hiểu những thông tin liên quan và giải đáp tuyến giáp là bệnh gì qua bài viết dưới đây nhé",
      "Để tìm hiểu thêm về bài viết 'FT4 - Chỉ số cơ bản trong theo dõi các bệnh lý tuyến giáp' cũng như các giải pháp chẩn đoán xét nghiệm liên quan, quý khách hàng vui lòng liên hệ trực tiếp Trí Việt Phát Medical để được tư vấn chuyên sâu.",
      "Trí Việt Phát cam kết cung cấp các hệ thống máy xét nghiệm và sinh phẩm chẩn đoán y khoa chính hãng, đáp ứng tiêu chuẩn khắt khe của Bộ Y Tế."
    ],
    keyPoints: [
      "Nội dung chuyên sâu cập nhật từ cổng thông tin Thietbiytegroup.com",
      "Hướng dẫn thực hành xét nghiệm và ứng dụng lâm sàng thực tế",
      "Liên hệ hotline 0904.698.699 - 0392.123.688 để được hỗ trợ 24/7"
    ]
  }
  ,{
    id: "xet-nghiem-hba1c-benh-tieu-duong",
    title: "Xét nghiệm HBA1c có ý nghĩa gì với người bệnh tiểu đường?",
    slug: "xet-nghiem-hba1c-benh-tieu-duong",
    date: "15/01/2025",
    image: "https://thietbiytegroup.com/wp-content/uploads/2024/07/knxnghiem.png",
    alt: "Xét nghiệm HBA1c có ý nghĩa gì với người bệnh tiểu đường?",
    category: "Kiến thức sức khỏe",
    readTime: "5 phút đọc",
    excerpt: "Xét nghiệm HbA1c không chỉ xác định một người bị đái tháo đường mà còn giúp người đã bị bệnh biết được chỉ số đường huyết tại thời điểm xét nghiệm.",
    content: [
      "Xét nghiệm HbA1c không chỉ xác định một người bị đái tháo đường mà còn giúp người đã bị bệnh biết được chỉ số đường huyết tại thời điểm xét nghiệm.",
      "Để tìm hiểu thêm về bài viết 'Xét nghiệm HBA1c có ý nghĩa gì với người bệnh tiểu đường?' cũng như các giải pháp chẩn đoán xét nghiệm liên quan, quý khách hàng vui lòng liên hệ trực tiếp Trí Việt Phát Medical để được tư vấn chuyên sâu.",
      "Trí Việt Phát cam kết cung cấp các hệ thống máy xét nghiệm và sinh phẩm chẩn đoán y khoa chính hãng, đáp ứng tiêu chuẩn khắt khe của Bộ Y Tế."
    ],
    keyPoints: [
      "Nội dung chuyên sâu cập nhật từ cổng thông tin Thietbiytegroup.com",
      "Hướng dẫn thực hành xét nghiệm và ứng dụng lâm sàng thực tế",
      "Liên hệ hotline 0904.698.699 - 0392.123.688 để được hỗ trợ 24/7"
    ]
  }
  ,{
    id: "vai-tro-cua-xet-nghiem-sinh-hoa-mien-dich-mau",
    title: "Vai trò của xét nghiệm sinh hoá - Miễn dịch máu",
    slug: "vai-tro-cua-xet-nghiem-sinh-hoa-mien-dich-mau",
    date: "15/01/2025",
    image: "https://thietbiytegroup.com/wp-content/uploads/2024/04/CS-1600.png",
    alt: "Vai trò của xét nghiệm sinh hoá - Miễn dịch máu",
    category: "Tin y tế",
    readTime: "5 phút đọc",
    excerpt: "Xét nghiệm sinh hóa máu là một xét nghiệm y học phổ biến, xét nghiệm để đo lường nồng độ hay hoạt độ của một số chất hóa học nhất định trong bệnh phẩm là máu, qua đó giúp đánh giá chức năng của một số bộ phận, cơ quan trong cơ thể như gan, [&hellip;]",
    content: [
      "Xét nghiệm sinh hóa máu là một xét nghiệm y học phổ biến, xét nghiệm để đo lường nồng độ hay hoạt độ của một số chất hóa học nhất định trong bệnh phẩm là máu, qua đó giúp đánh giá chức năng của một số bộ phận, cơ quan trong cơ thể như gan, [&hellip;]",
      "Để tìm hiểu thêm về bài viết 'Vai trò của xét nghiệm sinh hoá - Miễn dịch máu' cũng như các giải pháp chẩn đoán xét nghiệm liên quan, quý khách hàng vui lòng liên hệ trực tiếp Trí Việt Phát Medical để được tư vấn chuyên sâu.",
      "Trí Việt Phát cam kết cung cấp các hệ thống máy xét nghiệm và sinh phẩm chẩn đoán y khoa chính hãng, đáp ứng tiêu chuẩn khắt khe của Bộ Y Tế."
    ],
    keyPoints: [
      "Nội dung chuyên sâu cập nhật từ cổng thông tin Thietbiytegroup.com",
      "Hướng dẫn thực hành xét nghiệm và ứng dụng lâm sàng thực tế",
      "Liên hệ hotline 0904.698.699 - 0392.123.688 để được hỗ trợ 24/7"
    ]
  }
  ,{
    id: "cac-loai-xet-nghiem-mien-dich-thuong-dung",
    title: "Các loại xét nghiệm miễn dịch thường dùng",
    slug: "cac-loai-xet-nghiem-mien-dich-thuong-dung",
    date: "15/01/2025",
    image: "https://thietbiytegroup.com/wp-content/uploads/2024/06/H-800.png",
    alt: "Các loại xét nghiệm miễn dịch thường dùng",
    category: "Kiến thức sức khỏe",
    readTime: "5 phút đọc",
    excerpt: "Xét nghiệm miễn dịch là 1 trong những bước thường quy cần phải làm trong quá trình khám bệnh. Việc thực hiện xét nghiệm miễn dịch sẽ giúp đánh giá đúng hơn về tình hình sức khỏe của mỗi người, từ đó có phương hướng điều trị bệnh lý thích hợp. 1. Xét nghiệm miễn [&hellip;]",
    content: [
      "Xét nghiệm miễn dịch là 1 trong những bước thường quy cần phải làm trong quá trình khám bệnh. Việc thực hiện xét nghiệm miễn dịch sẽ giúp đánh giá đúng hơn về tình hình sức khỏe của mỗi người, từ đó có phương hướng điều trị bệnh lý thích hợp. 1. Xét nghiệm miễn [&hellip;]",
      "Để tìm hiểu thêm về bài viết 'Các loại xét nghiệm miễn dịch thường dùng' cũng như các giải pháp chẩn đoán xét nghiệm liên quan, quý khách hàng vui lòng liên hệ trực tiếp Trí Việt Phát Medical để được tư vấn chuyên sâu.",
      "Trí Việt Phát cam kết cung cấp các hệ thống máy xét nghiệm và sinh phẩm chẩn đoán y khoa chính hãng, đáp ứng tiêu chuẩn khắt khe của Bộ Y Tế."
    ],
    keyPoints: [
      "Nội dung chuyên sâu cập nhật từ cổng thông tin Thietbiytegroup.com",
      "Hướng dẫn thực hành xét nghiệm và ứng dụng lâm sàng thực tế",
      "Liên hệ hotline 0904.698.699 - 0392.123.688 để được hỗ trợ 24/7"
    ]
  }
  ,{
    id: "tong-quan-ve-cac-xet-nghiem-mien-dich-danh-gia-suc-khoe",
    title: "Tổng quan về các xét nghiệm miễn dịch và đánh giá sức khoẻ",
    slug: "tong-quan-ve-cac-xet-nghiem-mien-dich-danh-gia-suc-khoe",
    date: "15/01/2025",
    image: "https://thietbiytegroup.com/wp-content/uploads/2024/08/32.jpg",
    alt: "Tổng quan về các xét nghiệm miễn dịch và đánh giá sức khoẻ",
    category: "Kiến thức sức khỏe",
    readTime: "5 phút đọc",
    excerpt: "Xét nghiệm miễn dịch sẽ giúp đánh giá đúng hơn về tình hình sức khỏe của mỗi người, từ đó có phương hướng điều trị bệnh lý thích hợp",
    content: [
      "Xét nghiệm miễn dịch sẽ giúp đánh giá đúng hơn về tình hình sức khỏe của mỗi người, từ đó có phương hướng điều trị bệnh lý thích hợp",
      "Để tìm hiểu thêm về bài viết 'Tổng quan về các xét nghiệm miễn dịch và đánh giá sức khoẻ' cũng như các giải pháp chẩn đoán xét nghiệm liên quan, quý khách hàng vui lòng liên hệ trực tiếp Trí Việt Phát Medical để được tư vấn chuyên sâu.",
      "Trí Việt Phát cam kết cung cấp các hệ thống máy xét nghiệm và sinh phẩm chẩn đoán y khoa chính hãng, đáp ứng tiêu chuẩn khắt khe của Bộ Y Tế."
    ],
    keyPoints: [
      "Nội dung chuyên sâu cập nhật từ cổng thông tin Thietbiytegroup.com",
      "Hướng dẫn thực hành xét nghiệm và ứng dụng lâm sàng thực tế",
      "Liên hệ hotline 0904.698.699 - 0392.123.688 để được hỗ trợ 24/7"
    ]
  }
  ,{
    id: "nguoi-phu-nu-mac-xo-gan-bo-thuoc-dieu-tri-viem-gan-b",
    title: "Phụ nữ mắc xơ gan giai đoạn cuối do bỏ thuốc điều trị viêm gan B",
    slug: "nguoi-phu-nu-mac-xo-gan-bo-thuoc-dieu-tri-viem-gan-b",
    date: "15/01/2025",
    image: "https://thietbiytegroup.com/wp-content/uploads/2024/04/benh-nhan-xo-gan.png",
    alt: "Phụ nữ mắc xơ gan giai đoạn cuối do bỏ thuốc điều trị viêm gan B",
    category: "Kiến thức sức khỏe",
    readTime: "5 phút đọc",
    excerpt: "Sau 4 năm bỏ thuốc điều trị viêm gan B vì nghĩ virus không hoạt động, người phụ nữ nhập viện trong tình trạng xơ gan chướng bụng nhiều vàng da",
    content: [
      "Sau 4 năm bỏ thuốc điều trị viêm gan B vì nghĩ virus không hoạt động, người phụ nữ nhập viện trong tình trạng xơ gan chướng bụng nhiều vàng da",
      "Để tìm hiểu thêm về bài viết 'Phụ nữ mắc xơ gan giai đoạn cuối do bỏ thuốc điều trị viêm gan B' cũng như các giải pháp chẩn đoán xét nghiệm liên quan, quý khách hàng vui lòng liên hệ trực tiếp Trí Việt Phát Medical để được tư vấn chuyên sâu.",
      "Trí Việt Phát cam kết cung cấp các hệ thống máy xét nghiệm và sinh phẩm chẩn đoán y khoa chính hãng, đáp ứng tiêu chuẩn khắt khe của Bộ Y Tế."
    ],
    keyPoints: [
      "Nội dung chuyên sâu cập nhật từ cổng thông tin Thietbiytegroup.com",
      "Hướng dẫn thực hành xét nghiệm và ứng dụng lâm sàng thực tế",
      "Liên hệ hotline 0904.698.699 - 0392.123.688 để được hỗ trợ 24/7"
    ]
  }
  ,{
    id: "viem-gan-b-co-sinh-con-duoc-khong",
    title: "Viêm gan B có mang thai được không?",
    slug: "viem-gan-b-co-sinh-con-duoc-khong",
    date: "15/01/2025",
    image: "https://thietbiytegroup.com/wp-content/uploads/2024/04/vien-gan-b-co-sinh-con-duoc-khong.jpg",
    alt: "Viêm gan B có mang thai được không?",
    category: "Kiến thức sức khỏe",
    readTime: "5 phút đọc",
    excerpt: "Tìm hiểu về vấn đề người viêm gan B có mang thai được không, tìm ra những biện pháp cần thiết để đảm bảo quá trình thai kỳ diễn ra an toàn",
    content: [
      "Tìm hiểu về vấn đề người viêm gan B có mang thai được không, tìm ra những biện pháp cần thiết để đảm bảo quá trình thai kỳ diễn ra an toàn",
      "Để tìm hiểu thêm về bài viết 'Viêm gan B có mang thai được không?' cũng như các giải pháp chẩn đoán xét nghiệm liên quan, quý khách hàng vui lòng liên hệ trực tiếp Trí Việt Phát Medical để được tư vấn chuyên sâu.",
      "Trí Việt Phát cam kết cung cấp các hệ thống máy xét nghiệm và sinh phẩm chẩn đoán y khoa chính hãng, đáp ứng tiêu chuẩn khắt khe của Bộ Y Tế."
    ],
    keyPoints: [
      "Nội dung chuyên sâu cập nhật từ cổng thông tin Thietbiytegroup.com",
      "Hướng dẫn thực hành xét nghiệm và ứng dụng lâm sàng thực tế",
      "Liên hệ hotline 0904.698.699 - 0392.123.688 để được hỗ trợ 24/7"
    ]
  }
];

export const DOCUMENTS: DocumentItem[] = [
  {
    id: 'doc-1',
    title: 'Catalog Tổng Hợp Thiết Bị Xét Nghiệm & Hóa Chất Trí Việt Phát 2025',
    code: 'CAT-TVP-2025-VN',
    type: 'catalog',
    category: 'Catalog sản phẩm',
    fileSize: '14.8 MB',
    updateDate: '15/01/2025',
    description: 'Bản in màu điện tử chi tiết toàn bộ máy xét nghiệm sinh hóa, huyết học, nước tiểu, miễn dịch và hóa chất chẩn đoán.'
  },
  {
    id: 'doc-2',
    title: 'Chứng nhận Hệ thống Quản lý Chất lượng ISO 13485:2016',
    code: 'ISO-13485-TVP',
    type: 'certificate',
    category: 'Chứng nhận chất lượng',
    fileSize: '2.4 MB',
    updateDate: '10/12/2024',
    description: 'Giấy chứng nhận đạt chuẩn quốc tế ISO 13485 cho lĩnh vực kinh doanh, phân phối và bảo trì trang thiết bị y tế.'
  },
  {
    id: 'doc-3',
    title: 'Hướng dẫn sử dụng & Bảo dưỡng định kỳ Máy xét nghiệm AC9803',
    code: 'UM-AC9803-VIE',
    type: 'manual',
    category: 'Hướng dẫn sử dụng',
    fileSize: '5.2 MB',
    updateDate: '05/11/2024',
    description: 'Tài liệu hướng dẫn vận hành, quy trình rửa điện cực tự động và khắc phục sự cố thường gặp cho kỹ thuật viên phòng xét nghiệm.'
  },
  {
    id: 'doc-4',
    title: 'Bảng dữ liệu an toàn vật liệu (MSDS) Hóa chất huyết học Dewei',
    code: 'MSDS-DEWEI-HEM',
    type: 'specification',
    category: 'Dữ liệu kỹ thuật & An toàn',
    fileSize: '3.1 MB',
    updateDate: '20/10/2024',
    description: 'Báo cáo độc tính, hướng dẫn xử lý tràn đổ và bảo quản an toàn sinh học theo chuẩn quốc tế GHS.'
  },
  {
    id: 'doc-5',
    title: 'Hồ sơ năng lực Công ty TNHH Thiết bị Y tế Trí Việt Phát',
    code: 'PROFILE-TVP-2025',
    type: 'catalog',
    category: 'Hồ sơ doanh nghiệp',
    fileSize: '8.6 MB',
    updateDate: '01/01/2025',
    description: 'Giới thiệu 16 năm kinh nghiệm, mạng lưới 34 tỉnh thành, năng lực nhân sự kỹ sư y sinh và danh sách dự án tiêu biểu.'
  }
];

export const JOB_OPENINGS: JobOpening[] = [
  {
    id: 'job-1',
    title: 'Kỹ sư Y sinh - Chuyên viên Lắp đặt & Bảo trì Thiết bị xét nghiệm',
    department: 'Phòng Kỹ thuật Dịch vụ',
    location: 'Hà Nội & các tỉnh lân cận',
    type: 'Toàn thời gian cố định',
    salary: '15.000.000 - 25.000.000 VNĐ + Thưởng dự án',
    deadline: '28/02/2025',
    experience: 'Từ 1 - 3 năm kinh nghiệm trong ngành thiết bị y tế',
    description: 'Chịu trách nhiệm bàn giao, lắp đặt, hướng dẫn vận hành và thực hiện bảo dưỡng định kỳ các hệ thống máy xét nghiệm sinh hóa, huyết học, nước tiểu cho bệnh viện và phòng khám đối tác.',
    requirements: [
      'Tốt nghiệp Đại học/Cao đẳng chuyên ngành Điện tử Y sinh, Thiết bị Y tế, Tự động hóa hoặc liên quan',
      'Hiểu biết cơ bản về cơ điện tử, mạch quang học và hệ thống thủy lực trong máy xét nghiệm',
      'Sẵn sàng đi công tác ngắn ngày khi có yêu cầu chuyển giao công nghệ',
      'Trung thực, cẩn trọng, có tinh thần trách nhiệm cao đối với thiết bị y tế'
    ],
    benefits: [
      'Được gửi đi đào tạo chuyên sâu chính hãng bởi các chuyên gia nước ngoài (DIRUI, Wondfo, EKF)',
      'Đóng BHXH, BHYT đầy đủ theo Luật Lao động, bảo hiểm sức khỏe cao cấp',
      'Thưởng tháng lương 13, thưởng hiệu quả kinh doanh dự án định kỳ',
      'Môi trường làm việc nhân văn, đồng nghiệp chuyên nghiệp, hỗ trợ tối đa'
    ]
  },
  {
    id: 'job-2',
    title: 'Chuyên viên Kinh doanh Thiết bị Y tế & Hóa chất phòng Lab',
    department: 'Phòng Kinh doanh Thiết bị',
    location: 'Hà Nội',
    type: 'Toàn thời gian',
    salary: '12.000.000 - 30.000.000 VNĐ (Lương cứng + Hoa hồng không giới hạn)',
    deadline: '15/03/2025',
    experience: 'Tối thiểu 1 năm sales B2B hoặc thiết bị khoa học kỹ thuật',
    description: 'Tìm kiếm, tiếp cận và phát triển quan hệ khách hàng là các bệnh viện công, bệnh viện tư nhân, phòng khám đa khoa và trung tâm xét nghiệm trên địa bàn được phân công.',
    requirements: [
      'Tốt nghiệp chuyên ngành Dược, Y tế công cộng, Quản trị kinh doanh hoặc Sinh học',
      'Kỹ năng giao tiếp, đàm phán hợp đồng thương mại xuất sắc',
      'Nhanh nhẹn, có khả năng làm việc độc lập và chịu áp lực doanh số'
    ],
    benefits: [
      'Hoa hồng doanh số hấp dẫn, thanh toán minh bạch theo từng kỳ bán lẻ/thầu',
      'Cung cấp data khách hàng tiềm năng và hỗ trợ kỹ thuật viên đi demo sản phẩm',
      'Cơ hội thăng tiến lên Trưởng nhóm / Giám đốc kinh doanh vùng'
    ]
  },
  {
    id: 'job-3',
    title: 'Chuyên viên Ứng dụng Lâm sàng (Application Specialist)',
    department: 'Phòng R&D và Hỗ trợ Khách hàng',
    location: 'Hà Nội',
    type: 'Toàn thời gian',
    salary: '14.000.000 - 22.000.000 VNĐ',
    deadline: '10/03/2025',
    experience: 'Từ 1 năm kinh nghiệm tại phòng xét nghiệm y khoa',
    description: 'Hỗ trợ kỹ thuật viên xét nghiệm tối ưu hóa thông số hóa chất, kiểm soát chất lượng nội kiểm QC/ngoại kiểm EQAS và xử lý các vấn đề chuyên môn xét nghiệm.',
    requirements: [
      'Tốt nghiệp Cử nhân Kỹ thuật Xét nghiệm Y học (Đại học Y Hà Nội, ĐH Dược...)',
      'Thành thạo quy trình xét nghiệm sinh hóa, miễn dịch và kiểm tra chất lượng phòng Lab',
      'Có khả năng đọc hiểu tài liệu kỹ thuật tiếng Anh'
    ],
    benefits: [
      'Được tiếp cận các công nghệ xét nghiệm tiên tiến nhất trên thế giới',
      'Thời gian làm việc linh hoạt, phụ cấp công tác và điện thoại đầy đủ',
      'Lộ trình phát triển chuyên gia ứng dụng sản phẩm y khoa hàng đầu'
    ]
  }
];
