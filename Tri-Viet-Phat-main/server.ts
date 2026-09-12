import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized Gemini AI client
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

const SYSTEM_INSTRUCTION = `
Bạn là "Trợ lý AI Trí Việt Phát" - Chuyên gia tư vấn kỹ thuật y sinh và trang thiết bị xét nghiệm y khoa của CÔNG TY TNHH THIẾT BỊ Y TẾ TRÍ VIỆT PHÁT (16+ năm kinh nghiệm).

Thông tin công ty:
- Tên: CÔNG TY TNHH THIẾT BỊ Y TẾ TRÍ VIỆT PHÁT
- Giấy phép ĐKKD: 0105558779 do Sở KH&ĐT Hà Nội cấp
- Trụ sở: Số 5, nhà P16 TT Trương Định, P. Tương Mai, Q. Hoàng Mai, Hà Nội
- Hotline 24/7: 0984.567.890
- Điện thoại bàn: 0392.123.688
- Email: infothietbiyte168@gmail.com
- Website: www.thietbiytegroup.com

CẤU HÌNH KỸ THUẬT CHUẨN XÁC CỦA CÁC THIẾT BỊ (BẮT BUỘC TRẢ LỜI ĐÚNG 100% CẤU HÌNH, TUYỆT ĐỐI KHÔNG BỊA HOẶC THAY ĐỔI SỐ LIỆU):

1. Máy xét nghiệm điện giải AC9803 (Audicom):
- Tên: Máy xét nghiệm điện giải AC9803 gồm các chất NA, K, CL, CA/LI
- Hãng sản xuất: Jiangsu Audicom Medical Technology Co. Ltd. (Audicom)
- Thông số kỹ thuật:
  + Thông số đo: K, Na, Cl, Ca, pH
  + Thông số tính toán: nCa, TCa
  + Thời gian đo: ≤ 90s (thời gian lấy mẫu và xả)
  + Thể tích mẫu: 160µl
  + Nguyên lý đo: Điện cực chọn lọc ion (ISE)
  + Vị trí khay mẫu: 26 vị trí mẫu tự động
  + Kết nối máy quét: Hỗ trợ súng quét mã vạch Barcode trực tiếp
- Đặc điểm kỹ thuật:
  + Ống xét nghiệm ban đầu để lấy mẫu: Máy xét nghiệm có thể sử dụng ống xét nghiệm ban đầu để lấy mẫu trực tiếp để đơn giản hoá quá trình lấy mẫu hoặc có thể chọn sử dụng cốc mẫu lấy mẫu để đáp ứng các quy định xét nghiệm khác nhau.
  + Giao diện cho máy quét mã vạch: Người dùng có thể định cấu hình súng quét theo yêu cầu, lấy thông tin mẫu trực tiếp, giúp giảm khối lượng công việc nhập thủ công.
  + Nhiều vị trí mẫu: Vị trí mẫu được tăng lên 26 vị trí, sử dụng phạm vi rộng.
  + Tự động rửa buồng đo và xả mẫu.

2. Bảng hóa chất huyết học Dewei:
- Thương hiệu: Dewei (Đức / Quốc tế)
- Quy cách:
  + Dung dịch pha loãng (Diluent): 20L/thùng, pH đệm sinh lý chuẩn
  + Dung dịch ly giải (Lyse): 500ml/1000ml chai, phá vỡ hồng cầu chọn lọc
  + Dung dịch rửa (Cleaner/Rinse): 5L/10L hoặc dung dịch tẩy rửa tập trung
  + Thời hạn bảo quản: 24 tháng kể từ ngày sản xuất, nhiệt độ lưu trữ 2°C - 30°C
- Ưu điểm: Không chứa Cyanide an toàn môi trường, độ lặp lại CV < 2.0%, tương thích hoàn hảo máy 3 & 5 thành phần bạch cầu (Mindray, Sysmex, Dirui, URIT...).

3. Máy xét nghiệm nước tiểu tự động H-1600 (DIRUI):
- Công suất: 300 - 500 mẫu/giờ
- Số thông số đo: 11, 12 hoặc 14 thông số sinh hóa nước tiểu (Uro, Bil, Ket, Bld, Pro, Nit, Leu, Glu, SG, pH, VC, Microalbumin, Creatinine)
- Khay nạp mẫu tự động: Sức chứa lên tới 100 mẫu liên tục
- Đầu đọc mã vạch: Tích hợp sẵn đọc Barcode ống mẫu
- Bộ nhớ: Hơn 20.000 dữ liệu bệnh nhân
- Cảm biến: Cảm biến quang học lạnh đa bước sóng, tự động bù trừ màu sắc nước tiểu.

4. Máy xét nghiệm miễn dịch hóa phát quang iStar 500 (Wondfo):
- Công nghệ: Hóa phát quang hạt nano từ tính (Magnetic Particle CLIA)
- Tốc độ xét nghiệm: 180 - 240 test/giờ
- Thời gian có kết quả đầu tiên: Sau 14 phút
- Vị trí hóa chất: 25 vị trí làm lạnh liên tục 24/7 (4°C - 8°C)
- Vị trí mẫu: 60 vị trí mẫu hỗ trợ nạp liên tục và mẫu khẩn STAT
- Hệ thống đo quang: Ống đếm photon (PMT) độ nhạy cực cao

5. Máy xét nghiệm HbA1c Quo-Test (EKF - Châu Âu):
- Phương pháp: Sắc ký ái lực Boronate Affinity
- Thời gian phân tích: 4 phút / mẫu
- Lượng mẫu: 4 µL máu mao mạch hoặc tĩnh mạch
- Đơn vị đo: % DCCT hoặc mmol/mol IFCC
- Dải đo: 4% - 15% DCCT (20 - 140 mmol/mol), CV < 3.0% tại HbA1c 7%
- Không bị can thiệp bởi các biến thể Hemoglobin

6. Máy phân tích đông máu quang học OCG-102 (Drawray):
- Số kênh đo: 2 kênh quang học độc lập
- Vị trí ủ ấm: 16 vị trí ủ mẫu và hóa chất ở 37°C ± 0.5°C
- Các xét nghiệm hỗ trợ: PT (INR), APTT, Fibrinogen (FIB), Thrombin Time (TT), D-Dimer

QUY TẮC ĐẶC BIỆT VỀ ĐỊNH DẠNG:
- TUYỆT ĐỐI KHÔNG DÙNG ký hiệu LaTeX toán học như $...$ hoặc dấu $ trong câu trả lời (cấm dùng $Na^+$, $K^+$, $Cl^-$, $Ca^{++}$, $Li^+$, $pH$).
- Luôn viết công thức hóa học và ion dạng tự nhiên, trực quan bằng ký tự Unicode: Na⁺, K⁺, Cl⁻, Ca²⁺, Li⁺, pH (hoặc K, Na, Cl, Ca, pH).
- Dùng gạch đầu dòng dấu gạch ngang (- ) để liệt kê tính năng hoặc thông số kỹ thuật. In đậm tiêu đề mục bằng **tiêu đề:**.
- Trả lời bằng tiếng Việt lịch sự, súc tích, chuyên nghiệp, nhiệt tình và có căn cứ khoa học kỹ thuật y sinh.
- Khi khách hàng hỏi giá hoặc cần mua, giải thích ưu điểm và hướng dẫn gọi Hotline: 0984.567.890 để nhận báo giá chiết khấu đại lý tốt nhất.
`;

function sanitizeMedicalText(text: string): string {
  if (!text) return '';
  let str = text;
  // Convert specific chemical ion LaTeX formats
  str = str.replace(/\$Na\^\{\+?\}\$|\$Na\^\+\$/gi, 'Na⁺');
  str = str.replace(/\$K\^\{\+?\}\$|\$K\^\+\$/gi, 'K⁺');
  str = str.replace(/\$Cl\^\{\-?\}\$|\$Cl\^\-\$/gi, 'Cl⁻');
  str = str.replace(/\$Ca\^\{\+\+\}\$|\$Ca\^\{2\+\}\$|\$Ca\^\+\+\$|\$Ca\^2\+\$/gi, 'Ca²⁺');
  str = str.replace(/\$Li\^\{\+?\}\$|\$Li\^\+\$/gi, 'Li⁺');
  str = str.replace(/\$Mg\^\{2\+\}\$|\$Mg\^\{\+\+\}\$|\$Mg\^2\+\$/gi, 'Mg²⁺');
  str = str.replace(/\$pH\$/gi, 'pH');
  str = str.replace(/\$HCO_3\^-\$|\$HCO_3\^\{\-\}\$/gi, 'HCO₃⁻');

  // Generic latex cleaner
  str = str.replace(/\$([^$]+)\$/g, (_, inner) => {
    return inner
      .replace(/\^\{\+\+\}/g, '²⁺')
      .replace(/\^\{2\+\}/g, '²⁺')
      .replace(/\^\{\+\}/g, '⁺')
      .replace(/\^\{\-\}/g, '⁻')
      .replace(/\^\+/g, '⁺')
      .replace(/\^\-/g, '⁻')
      .replace(/\^2/g, '²')
      .replace(/\^3/g, '³')
      .replace(/\{|\}/g, '');
  });

  return str;
}

function getDomainFallbackReply(message: string): string {
  const lower = message.toLowerCase();
  
  if (lower.includes('giá') || lower.includes('báo giá') || lower.includes('chi phí') || lower.includes('bao nhiêu')) {
    return 'Dạ để nhận bảng báo giá chi tiết và chính sách chiết khấu tốt nhất cho các dòng máy xét nghiệm hoặc hóa chất tiêu hao, Quý khách vui lòng để lại số điện thoại hoặc liên hệ trực tiếp **Hotline 24/7: 0984.567.890**. Đội ngũ chuyên viên kinh doanh Trí Việt Phát sẽ gửi báo giá kèm hồ sơ kỹ thuật trong vòng 15 phút!';
  }
  
  if (lower.includes('điện giải') || lower.includes('ac9803') || lower.includes('audicom') || lower.includes('ac-9803')) {
    return 'Chi tiết cấu hình kỹ thuật **Máy xét nghiệm điện giải AC9803 (Audicom)**:\n\n**1. Thông số kỹ thuật:**\n- **Thông số đo:** K, Na, Cl, Ca, pH\n- **Thông số tính toán:** nCa, TCa\n- **Thời gian đo:** ≤ 90s (thời gian lấy mẫu và xả)\n- **Thể tích mẫu:** 160µl\n- **Nguyên lý đo:** Điện cực chọn lọc ion (ISE)\n- **Vị trí khay mẫu:** 26 vị trí mẫu tự động\n- **Kết nối máy quét:** Hỗ trợ súng quét mã vạch Barcode trực tiếp\n\n**2. Đặc điểm kỹ thuật:**\n- **Ống xét nghiệm ban đầu để lấy mẫu:** Máy xét nghiệm có thể sử dụng ống xét nghiệm ban đầu để lấy mẫu trực tiếp để đơn giản hoá quá trình lấy mẫu hoặc có thể chọn sử dụng cốc mẫu lấy mẫu để đáp ứng các quy định xét nghiệm khác nhau.\n- **Giao diện cho máy quét mã vạch:** Người dùng có thể định cấu hình súng quét theo yêu cầu, lấy thông tin mẫu trực tiếp, giúp giảm khối lượng công việc nhập thủ công.\n- **Nhiều vị trí mẫu:** Vị trí mẫu được tăng lên 26 vị trí, sử dụng phạm vi rộng.\n- **Tự động hóa:** Tự động rửa buồng đo và xả mẫu sau mỗi chu trình đo.\n\nQuý khách liên hệ **Hotline 24/7: 0984.567.890** để nhận ưu đãi giá và catalogue chi tiết!';
  }
  
  if (lower.includes('huyết học') || lower.includes('dewei') || lower.includes('hóa chất') || lower.includes('pha loãng') || lower.includes('ly giải')) {
    return 'Bảng hóa chất huyết học **Dewei** chính hãng do Trí Việt Phát phân phối:\n\n**1. Thông số quy cách:**\n- **Dung dịch pha loãng (Diluent):** 20L/thùng, pH đệm sinh lý chuẩn.\n- **Dung dịch ly giải (Lyse):** 500ml/1000ml chai, phá vỡ hồng cầu chọn lọc.\n- **Dung dịch rửa (Cleaner/Rinse):** 5L/10L hoặc dung dịch tẩy rửa tập trung.\n- **Thời hạn bảo quản:** 24 tháng, lưu trữ 2°C - 30°C.\n\n**2. Ưu điểm nổi bật:**\n- Tương thích hoàn hảo với các máy xét nghiệm huyết học 3 thành phần và 5 thành phần bạch cầu (Mindray, Sysmex, Dirui, URIT...).\n- Công thức không chứa Cyanide an toàn với môi trường và kỹ thuật viên.\n- Độ lặp lại (CV) tế bào máu < 2.0%, hạn chế tối đa bám cặn buồng đếm.';
  }
  
  if (lower.includes('sinh hóa') || lower.includes('cs-1600') || lower.includes('cs1600') || lower.includes('cs 1600')) {
    return 'Hệ thống máy xét nghiệm sinh hóa tự động **CS-1600 (DIRUI)**:\n- **Công suất:** 1200 xét nghiệm quang học/giờ (lên tới 1600 test/giờ khi tích hợp ISE).\n- **Hệ thống nạp mẫu:** Khay nạp rack tự động liên tục chứa 140 mẫu bệnh phẩm.\n- **Cuvette phản ứng:** Cuvette thạch anh vĩnh cửu, tự động rửa 8 bước sấy khô thông minh.\n- **Khuấy phản ứng:** Công nghệ khuấy sóng siêu âm không tiếp xúc, triệt tiêu nhiễm chéo.\n- **Phù hợp:** Bệnh viện đa khoa tuyến tỉnh, trung tâm xét nghiệm quy mô vừa và lớn.';
  }
  
  if (lower.includes('nước tiểu') || lower.includes('h-1600') || lower.includes('h1600') || lower.includes('dirui')) {
    return 'Máy phân tích nước tiểu tự động **DIRUI H-1600**:\n- **Công suất:** 300 - 500 mẫu/giờ, tự động nạp mẫu liên tục lên đến 100 ống nghiệm.\n- **Thông số xét nghiệm:** 11 - 14 thông số sinh hóa nước tiểu (Uro, Bil, Ket, Bld, Pro, Nit, Leu, Glu, SG, pH, VC, Microalbumin, Creatinine).\n- **Quang học:** Cảm biến quang học lạnh đa bước sóng độ nhạy cao, tự động bù màu mẫu nước tiểu.\n- **Bộ nhớ:** Lưu trữ hơn 20.000 dữ liệu bệnh nhân.';
  }
  
  if (lower.includes('miễn dịch') || lower.includes('istar') || lower.includes('wondfo')) {
    return 'Máy xét nghiệm miễn dịch hóa phát quang **iStar 500 (Wondfo CLIA)**:\n- **Công nghệ:** Hóa phát quang hạt từ tính trực tiếp (Magnetic Particle CLIA).\n- **Tốc độ:** 180 - 240 test/giờ, có kết quả đầu tiên sau 14 phút.\n- **Vị trí hóa chất:** 25 vị trí làm lạnh liên tục 24/7 (4°C - 8°C).\n- **Vị trí mẫu:** 60 vị trí mẫu (hỗ trợ mẫu khẩn STAT và nạp mẫu liên tục).\n- **Danh mục xét nghiệm:** Tuyến giáp, hormone sinh sản, dấu ấn tim mạch, dấu ấn khối u ung thư, marker viêm nhiễm.';
  }
  
  if (lower.includes('hba1c') || lower.includes('quo-test') || lower.includes('quotest') || lower.includes('tiểu đường')) {
    return 'Máy đo HbA1c tại chỗ **Quo-Test (EKF Diagnostics - Châu Âu)**:\n- **Nguyên lý:** Sắc ký ái lực Boronate Affinity, không bị ảnh hưởng bởi các biến thể Hemoglobin.\n- **Lượng mẫu:** Chỉ cần 4µL máu mao mạch (đầu ngón tay) hoặc máu tĩnh mạch.\n- **Thời gian phân tích:** 4 phút có kết quả định lượng chính xác.\n- **Dải đo:** 4% - 15% DCCT (20 - 140 mmol/mol), CV < 3.0% tại HbA1c 7%.\n- **Chứng nhận:** Chuẩn hóa theo NGSP và IFCC, CE-IVD Châu Âu.';
  }
  
  if (lower.includes('đông máu') || lower.includes('ocg-102') || lower.includes('drawray')) {
    return 'Máy phân tích đông máu bán tự động **OCG-102 (Drawray)**:\n- **Số kênh đo:** 2 kênh quang học độc lập.\n- **Vị trí ủ ấm:** 16 vị trí ủ mẫu và hóa chất ở 37°C ± 0.5°C.\n- **Các xét nghiệm:** PT (INR), APTT, Fibrinogen (FIB), Thrombin Time (TT), D-Dimer.\n- **Quang học:** LED bước sóng 470nm chống đục và tán xạ.';
  }
  
  if (lower.includes('bảo hành') || lower.includes('bảo dưỡng') || lower.includes('sửa chữa') || lower.includes('kỹ thuật')) {
    return 'Chính sách dịch vụ kỹ thuật của **Trí Việt Phát**:\n- **Bảo hành:** 12 - 24 tháng theo tiêu chuẩn chính hãng của nhà sản xuất.\n- **Thời gian phản hồi:** Hỗ trợ kỹ thuật 24/7. Có mặt xử lý sự cố trong vòng 2-4 giờ tại khu vực nội thành Hà Nội và trong 24 giờ tại các tỉnh lân cận.\n- **Linh kiện:** Cam kết 100% linh kiện, board mạch và phụ tùng thay thế chính hãng, có sẵn tại kho.';
  }
  
  if (lower.includes('địa chỉ') || lower.includes('liên hệ') || lower.includes('hotline') || lower.includes('ở đâu') || lower.includes('công ty')) {
    return '**CÔNG TY TNHH THIẾT BỊ Y TẾ TRÍ VIỆT PHÁT** (16+ năm phát triển):\n- **Trụ sở:** Số 5, nhà P16 TT Trương Định, Phường Tương Mai, Quận Hoàng Mai, Hà Nội.\n- **Hotline 24/7:** **0984.567.890** (Zalo / Call)\n- **Điện thoại:** 0392.123.688\n- **Email:** infothietbiyte168@gmail.com\n- **Website:** www.thietbiytegroup.com';
  }
  
  return 'Xin kính chào Quý khách! **Trí Việt Phát** là đơn vị hơn 16 năm kinh nghiệm chuyên phân phối trang thiết bị y tế và hóa chất xét nghiệm chính hãng đạt chuẩn **ISO 13485 & CE**:\n- Máy xét nghiệm điện giải Audicom AC9803 (ISE, thời gian đo ≤ 90s, thể tích 160µl, 26 vị trí mẫu)\n- Hóa chất huyết học Dewei cho máy 3 & 5 thành phần bạch cầu\n- Máy xét nghiệm nước tiểu DIRUI H-1600 (300-500 test/h)\n- Máy miễn dịch hóa phát quang iStar 500\n- Máy đo HbA1c Quo-Test (4 phút, 4µL máu)\n- Máy đông máu OCG-102\n\nQuý khách đang quan tâm đến dòng thiết bị nào hoặc cần bảng thông số kỹ thuật chi tiết ạ? Vui lòng gọi **Hotline: 0984.567.890** để được tư vấn kỹ thuật ngay!';
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// AI Chat Endpoint with multi-model failover & graceful fallback
app.post('/api/chat', async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Nội dung tin nhắn không hợp lệ' });
    }

    const ai = getGeminiClient();

    if (!ai) {
      return res.json({ reply: getDomainFallbackReply(message) });
    }

    // Format previous context if provided
    let conversationContext = '';
    if (Array.isArray(history) && history.length > 0) {
      conversationContext = history
        .slice(-6)
        .map((h: { sender: string; text: string }) => `${h.sender === 'user' ? 'Khách hàng' : 'Trợ lý Trí Việt Phát'}: ${h.text}`)
        .join('\n');
    }

    const promptText = conversationContext
      ? `Lịch sử hội thoại:\n${conversationContext}\n\nKhách hàng hỏi: ${message}\n\nHãy trả lời khách hàng:`
      : message;

    // Ordered list of models to try. gemini-3.1-flash-lite provides high throughput and avoids 503 spikes.
    const candidateModels = ['gemini-3.1-flash-lite', 'gemini-3.8-flash', 'gemini-flash-latest'];
    let reply: string | null = null;

    for (const modelName of candidateModels) {
      try {
        const response = await ai.models.generateContent({
          model: modelName,
          contents: promptText,
          config: {
            systemInstruction: SYSTEM_INSTRUCTION,
            temperature: 0.7,
          },
        });

        if (response && response.text) {
          reply = response.text;
          break;
        }
      } catch (err: unknown) {
        // High demand (503) or rate limits (429) are handled smoothly by falling back to the next model
        const status = (err as { status?: number })?.status;
        if (status === 503 || status === 429) {
          await new Promise((resolve) => setTimeout(resolve, 300));
        }
        // Continue loop to try next model
      }
    }

    if (reply) {
      return res.json({ reply: sanitizeMedicalText(reply) });
    }

    // Deliver the domain-specific medical reply if AI models are temporarily unavailable
    return res.json({ reply: getDomainFallbackReply(message) });
  } catch (_error) {
    const { message } = req.body || {};
    return res.json({
      reply: getDomainFallbackReply(typeof message === 'string' ? message : ''),
    });
  }
});

// Vite Middleware for development & static serving for production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server Trí Việt Phát đang chạy trên http://0.0.0.0:${PORT}`);
  });
}

startServer();
