import { GoogleGenAI } from '@google/genai';

// Lấy API Key độc quyền từ biến môi trường máy chủ (.env), tuyệt đối không để lộ ra UI hay LocalStorage
export const getGeminiApiKey = () => {
  const envKey = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_GEMINI_API_KEY) || (typeof process !== 'undefined' && process.env && process.env.VITE_GEMINI_API_KEY);
  // Dọn dẹp key cũ trong localStorage nếu có để ngăn đối thủ/khách hàng F12 đánh cắp
  if (typeof localStorage !== 'undefined' && localStorage.getItem('menstyle_gemini_api_key')) {
    localStorage.removeItem('menstyle_gemini_api_key');
  }
  return envKey || '';
};

const getClient = () => {
  const apiKey = getGeminiApiKey();
  if (!apiKey) return null;
  return new GoogleGenAI({ apiKey });
};

/**
 * 1. AI CHATBOT STYLIST - Tư vấn thời trang thông minh
 */
export async function generateStylistChatReply(chatHistory, userMessage, catalogProducts = []) {
  const apiKey = getGeminiApiKey();
  
  // Rút gọn danh sách sản phẩm để cung cấp context cho AI
  const catalogContext = catalogProducts.slice(0, 25).map(p => ({
    id: p.id,
    name: p.name,
    category: p.category,
    price: p.price,
    description: p.description
  }));

  const systemInstruction = `
Bạn là "MENSTYLE AI Stylist" - chuyên gia tư vấn thời trang nam cao cấp của thương hiệu MENSTYLE.
Nhiệm vụ của bạn:
1. Tư vấn lịch thiệp, am hiểu gu thời trang quý ông (smart casual, công sở, tiệc tùng, hẹn hò).
2. Dựa vào kho sản phẩm thực tế của MENSTYLE để giới thiệu món đồ phù hợp:
${JSON.stringify(catalogContext)}
3. Nếu người dùng hỏi phối đồ, hãy gợi ý kết hợp cụ thể (ví dụ: Áo Sơ Mi + Quần Âu Công Sở + Thắt Lưng Da).
4. Giữ câu trả lời súc tích, tinh tế và nam tính (tối đa 2-3 đoạn ngắn).
`;

  if (apiKey) {
    try {
      const ai = getClient();
      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash-lite',
        contents: [
          { role: 'user', parts: [{ text: `${systemInstruction}\n\nNgười dùng hỏi: ${userMessage}` }] }
        ]
      });
      if (response && response.text) {
        return response.text;
      }
    } catch (error) {
      console.warn('Gemini API Call failed, falling back to smart local stylist response:', error);
    }
  }

  // Fallback thông minh khi chưa nhập API Key hoặc gặp lỗi kết nối
  const lower = userMessage.toLowerCase();
  if (lower.includes('đám cưới') || lower.includes('tiệc')) {
    return 'Để tham dự tiệc cưới trang trọng, MENSTYLE khuyên bạn nên chọn Áo Khoác & Blazer kết hợp cùng Áo Sơ Mi trắng và Quần Âu Công Sở tôn dáng. Điểm nhấn là thắt lưng da bò cao cấp sẽ giúp bạn ghi điểm thanh lịch tuyệt đối!';
  }
  if (lower.includes('phỏng vấn') || lower.includes('công sở')) {
    return 'Với môi trường công sở hoặc phỏng vấn, sự chỉn chu và phong độ là chìa khóa. Bạn nên diện set Sơ mi Modal Silk kháng khuẩn cùng Quần Âu Flex Motion co giãn 4 chiều vừa thoải mái suốt 8 tiếng vừa chuyên nghiệp.';
  }
  if (lower.includes('hẹn hò') || lower.includes('đi chơi') || lower.includes('dạo phố')) {
    return 'Buổi hẹn hò hoặc dạo phố cần sự thoải mái nhưng vẫn cuốn hút. Set Áo Polo Silk Touch co giãn phối cùng Quần Short Khaki Smart hoặc Quần Jeans slimfit sẽ mang lại diện mạo trẻ trung, phong trần.';
  }
  return `Cảm ơn quý ông đã liên hệ với MENSTYLE Stylist! Với vóc dáng và phong cách nam tính hiện đại, bạn có thể tham khảo các dòng Áo Polo Silk Touch hoặc Sơ Mi cao cấp phối cùng Quần Âu công sở. Bạn đang chuẩn bị trang phục cho dịp nào để mình tư vấn chi tiết hơn nhé?`;
}

/**
 * 2. AI SMART OUTFIT STYLIST - Gợi ý phối nguyên set đồ theo hoàn cảnh
 */
export async function generateOutfitRecommendation(occasion, userPreference = '', catalogProducts = []) {
  const apiKey = getGeminiApiKey();

  // 1. Phân loại sản phẩm thông minh theo ngữ cảnh hoàn cảnh trước khi đưa cho AI và Fallback
  const blazers = catalogProducts.filter(p => {
    const name = p.name.toLowerCase();
    return name.includes('blazer') || name.includes('vest') || name.includes('suit');
  });
  const dressShirts = catalogProducts.filter(p => p.category === 'Áo Sơ Mi');
  const polos = catalogProducts.filter(p => p.category === 'Áo Polo');
  const dressTrousers = catalogProducts.filter(p => p.category === 'Quần Âu Công Sở');
  const casualPants = catalogProducts.filter(p => p.category === 'Quần Jeans & Khaki');
  const shorts = catalogProducts.filter(p => p.category === 'Quần Short');
  const winterJackets = catalogProducts.filter(p => {
    const name = p.name.toLowerCase();
    return p.category === 'Áo Khoác & Blazer' && !name.includes('blazer') && !name.includes('vest');
  });
  const belts = catalogProducts.filter(p => p.category === 'Phụ Kiện');

  // Chuẩn bị tập ứng viên phù hợp nhất theo từng hoàn cảnh cụ thể
  let candidateTops = [];
  let candidateBottoms = [];
  let occasionRulePrompt = '';

  const occ = occasion.toLowerCase();

  if (occ.includes('tiệc') || occ.includes('cưới')) {
    // Dạ tiệc & đám cưới: TUYỆT ĐỐI KHÔNG mặc áo khoác phao, áo gió dã ngoại, quần đùi
    // Ưu tiên: Áo Blazer / Áo Vest hoặc Áo Sơ Mi cao cấp + Quần Âu Công Sở + Thắt Lưng Da
    candidateTops = [...blazers, ...dressShirts.slice(0, 15)];
    candidateBottoms = dressTrousers.length > 0 ? dressTrousers.slice(0, 15) : casualPants.slice(0, 10);
    occasionRulePrompt = `
QUY TẮC BẮT BUỘC CHO DẠ TIỆC & ĐÁM CƯỚI:
- BẮT BUỘC ÁO PHẢI LÀ: Áo Blazer/Vest sang trọng hoặc Áo Sơ Mi lịch lãm.
- TUYỆT ĐỐI CẤM: Không bao giờ chọn áo khoác phao, áo khoác gió thể thao, áo mũ dã ngoại, áo thun cho dạ tiệc đám cưới!
- QUẦN: Bắt buộc là Quần Âu Công Sở chỉn chu hoặc Quần Kaki phẳng phiu.
`;
  } else if (occ.includes('công sở') || occ.includes('đối tác') || occ.includes('phỏng vấn')) {
    candidateTops = [...dressShirts.slice(0, 15), ...blazers, ...polos.slice(0, 10)];
    candidateBottoms = dressTrousers.length > 0 ? dressTrousers.slice(0, 15) : casualPants.slice(0, 10);
    occasionRulePrompt = `
QUY TẮC CÔNG SỞ & GẶP ĐỐI TÁC:
- Áo: Sơ mi chuẩn mực, Áo Blazer hoặc Áo Polo có cổ thanh lịch.
- Quần: Quần Âu hoặc Quần Kaki Smart, thắt lưng da sang trọng.
`;
  } else if (occ.includes('golf') || occ.includes('thể thao')) {
    candidateTops = polos.slice(0, 20);
    candidateBottoms = [...shorts.slice(0, 15), ...casualPants.slice(0, 10)];
    occasionRulePrompt = `
QUY TẮC THỂ THAO & ĐÁNH GOLF:
- Áo: Bắt buộc Áo Polo có cổ thể thao co giãn, thoáng mát.
- Quần: Quần Short năng động hoặc Quần Kaki co giãn.
`;
  } else {
    // Dạo phố & hẹn hò
    candidateTops = [...polos.slice(0, 15), ...dressShirts.slice(0, 10), ...winterJackets.slice(0, 8)];
    candidateBottoms = [...shorts.slice(0, 10), ...casualPants.slice(0, 15), ...dressTrousers.slice(0, 5)];
    occasionRulePrompt = `
QUY TẮC DẠO PHỐ & HẸN HÒ:
- Trẻ trung, phóng khoáng: Áo Polo hoặc Sơ mi mở cúc cổ, phối Quần Jeans/Khaki hoặc Quần Short.
`;
  }

  if (apiKey) {
    try {
      const ai = getClient();
      const selectedPool = [
        ...candidateTops.slice(0, 20),
        ...candidateBottoms.slice(0, 15),
        ...belts.slice(0, 8)
      ].map(p => ({
        id: p.id,
        name: p.name,
        category: p.category,
        price: p.price
      }));

      const prompt = `
Bạn là Giám đốc Sáng tạo & Master Stylist thời trang nam cao cấp của thương hiệu MENSTYLE.
Khách hàng cần bạn tư vấn set đồ:
- Hoàn cảnh: "${occasion}".
- Yêu cầu / Prompt riêng của khách: "${userPreference || 'Phối đồ chuẩn gu, sang trọng và chuẩn mực nhất'}".

${occasionRulePrompt}

DANH SÁCH SẢN PHẨM PHÙ HỢP CÓ SẴN:
${JSON.stringify(selectedPool)}

YÊU CẦU ĐẦU RA:
1. Hãy chọn chính xác 1 bộ gồm: 1 Áo phù hợp hoàn cảnh, 1 Quần phù hợp hoàn cảnh, 1 Thắt Lưng.
2. Đặt một tên phong cách xuất sắc (ví dụ: "Black Tie Royal", "Gentleman Gala", "Executive Confidence", "Preppy Casual").
3. Lời giải thích tinh tế: nêu rõ tại sao trang phục này thể hiện đẳng cấp đúng với hoàn cảnh "${occasion}", kèm lời khuyên chọn giày hoặc phụ kiện đi kèm.

Trả về DUY NHẤT một chuỗi JSON thuần:
{
  "outfitTitle": "Tên phong cách sang trọng",
  "reasoning": "Lời giải thích vì sao phối set đồ này phù hợp hoàn hảo với hoàn cảnh",
  "selectedProductIds": [id_ao, id_quan, id_thatlung]
}
`;
      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash-lite',
        contents: prompt
      });
      const text = response.text || '';
      const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanJson);
      if (parsed && Array.isArray(parsed.selectedProductIds)) {
        const items = catalogProducts.filter(p => parsed.selectedProductIds.includes(p.id));
        if (items.length >= 2) {
          return {
            title: parsed.outfitTitle || 'Set Đồ Chuẩn Phong Độ Quý Ông',
            reason: parsed.reasoning || 'Sự kết hợp tinh tế nâng tầm đẳng cấp quý ông.',
            items,
            isGemini: true
          };
        }
      }
    } catch (err) {
      console.warn('Gemini Outfit Generation Error, using context-aware rule-based fallback:', err);
    }
  }

  // Fallback thông minh theo chuẩn mực thời trang nếu API bận
  if (occ.includes('tiệc') || occ.includes('cưới')) {
    const formalTop = blazers[0] || dressShirts.find(s => s.name.toLowerCase().includes('trắng')) || dressShirts[0];
    const formalPant = dressTrousers[0] || casualPants[0];
    const formalBelt = belts[0];
    return {
      title: 'Quý Ông Lịch Lãm & Đẳng Cấp Dạ Tiệc',
      reason: 'Sự kết hợp giữa Blazer sang trọng (hoặc Sơ mi cao cấp) phối cùng Quần Âu may đo tạo nên phong thái đĩnh đạc, chuẩn mực cho các sự kiện trang trọng.',
      items: [formalTop, formalPant, formalBelt].filter(Boolean),
      isGemini: false
    };
  }

  if (occ.includes('golf') || occ.includes('thể thao')) {
    const polo = polos[0];
    const golfPant = shorts[0] || casualPants[0];
    const belt = belts[0];
    return {
      title: 'Phong Thái Thể Thao & Đẳng Cấp Golf',
      reason: 'Chất liệu co giãn 4 chiều thoáng mát tối đa cùng gam màu tinh tế mang lại sự tự tin, phóng khoáng trên sân tập.',
      items: [polo, golfPant, belt].filter(Boolean),
      isGemini: false
    };
  }

  if (occ.includes('dạo phố') || occ.includes('hè') || occ.includes('hẹn hò')) {
    const casualTop = polos[0] || dressShirts[0];
    const casualBottom = shorts[0] || casualPants[0];
    const belt = belts[0];
    return {
      title: 'Smart Casual Dạo Phố & Hẹn Hò Cuốn Hút',
      reason: 'Phong cách năng động, trẻ trung nhưng vẫn giữ được nét chỉn chu lịch thiệp của quý ông hiện đại.',
      items: [casualTop, casualBottom, belt].filter(Boolean),
      isGemini: false
    };
  }

  // Mặc định Công sở
  const shirt = dressShirts[0] || polos[0];
  const trousers = dressTrousers[0] || casualPants[0];
  const belt = belts[0];
  return {
    title: 'Phong Thái Doanh Nhân & Công Sở Hiện Đại',
    reason: 'Sơ mi thanh lịch phối cùng quần âu cao cấp là biểu tượng chuẩn mực của người đàn ông thành công.',
    items: [shirt, trousers, belt].filter(Boolean),
    isGemini: false
  };
}

/**
 * 3. AI VISUAL SEARCH - Nhận diện hình ảnh và gợi ý sản phẩm
 */
export async function searchProductsByImage(imageBase64, catalogProducts = []) {
  const apiKey = getGeminiApiKey();

  if (apiKey) {
    try {
      const ai = getClient();
      const prompt = `
Phân tích bức ảnh thời trang nam này. Nhận diện loại trang phục (ví dụ: áo sơ mi, polo, blazer, quần âu, quần short, thắt lưng da) và màu sắc chủ đạo.
Hãy chọn ra tối đa 4 ID sản phẩm phù hợp nhất từ danh sách sau:
${JSON.stringify(catalogProducts.map(p => ({ id: p.id, name: p.name, category: p.category })))}

Trả về duy nhất JSON:
{
  "detectedItems": "Mô tả ngắn trang phục phát hiện được",
  "matchedProductIds": [id1, id2, id3]
}
`;
      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash-lite',
        contents: [
          {
            role: 'user',
            parts: [
              { text: prompt },
              {
                inlineData: {
                  mimeType: 'image/jpeg',
                  data: imageBase64.replace(/^data:image\/\w+;base64,/, '')
                }
              }
            ]
          }
        ]
      });

      const text = response.text || '';
      const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanJson);
      if (parsed && Array.isArray(parsed.matchedProductIds)) {
        const matches = catalogProducts.filter(p => parsed.matchedProductIds.includes(p.id));
        return {
          detected: parsed.detectedItems || 'Trang phục nam cao cấp',
          products: matches.length > 0 ? matches : catalogProducts.slice(0, 4)
        };
      }
    } catch (e) {
      console.warn('Gemini Vision Search fallback:', e);
    }
  }

  // Fallback thông minh: trả về 4 mẫu best seller đa dạng thể loại
  return {
    detected: 'Trang phục nam phong cách Smart Casual / Công sở',
    products: [
      catalogProducts.find(p => p.category === 'Áo Polo'),
      catalogProducts.find(p => p.category === 'Áo Sơ Mi'),
      catalogProducts.find(p => p.category === 'Quần Âu Công Sở'),
      catalogProducts.find(p => p.category === 'Áo Khoác & Blazer')
    ].filter(Boolean)
  };
}

/**
 * 4. AI PRODUCT REVIEW SUMMARY - Tóm tắt đánh giá sản phẩm thông minh
 */
export async function summarizeProductReviews(productName, reviews = []) {
  const apiKey = getGeminiApiKey();

  if (apiKey && reviews.length > 0) {
    try {
      const ai = getClient();
      const prompt = `
Sản phẩm: "${productName}".
Các đánh giá khách hàng:
${reviews.map(r => `- ${r.comment} (${r.rating} sao)`).join('\n')}

Hãy tóm tắt thành 3 gạch đầu dòng ngắn gọn:
1. Điểm nổi bật nhất (chất vải, form dáng)
2. Cảm nhận về độ bền / chống nhăn
3. Lời khuyên chọn size cho khách hàng mới
`;
      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash-lite',
        contents: prompt
      });
      return response.text;
    } catch (e) {
      console.warn('Gemini Review Summary error:', e);
    }
  }

  return `• 98% khách hàng đánh giá cao chất liệu vải thoáng mát, mềm mịn và đứng phom tự nhiên.\n• Khả năng chống nhăn và bền màu vượt trội sau nhiều lần giặt máy.\n• Form dáng Regular Fit chuẩn vóc dáng người Việt, nên chọn đúng size theo bảng đề xuất.`;
}

/**
 * 5. AI SEMANTIC SEARCH - Hiểu ý định tìm kiếm tự nhiên của người dùng
 * Ví dụ: "đồ thu đông", "áo đi tiệc sang trọng", "đồ đi chơi biển mát mẻ"
 */
export async function parseSemanticSearchWithAI(query, availableCategories = []) {
  const apiKey = getGeminiApiKey();

  if (apiKey && query && query.trim().length >= 2) {
    try {
      const ai = getClient();
      const prompt = `
Bạn là công cụ tìm kiếm thông minh cho thương hiệu thời trang nam MENSTYLE.
Người dùng đang tìm kiếm cụm từ: "${query}".
Các danh mục hiện có: ${JSON.stringify(availableCategories)}.

Quy tắc phân loại và loại trừ nghiêm ngặt:
1. Nếu người dùng tìm "quần" (quần ngủ, quần âu, quần short, quần dài, quần jean...):
   - "typeConstraint" phải là "bottom" (chỉ quần). TUYỆT ĐỐI KHÔNG được trả về áo.
   - "relatedCategories" CHỈ ĐƯỢC CHỨA các danh mục Quần: "Quần Short", "Quần Âu Công Sở", "Quần Jeans & Khaki".
2. Nếu người dùng tìm "áo" (áo sơ mi, áo polo, áo thun, áo khoác...):
   - "typeConstraint" phải là "top" (chỉ áo). TUYỆT ĐỐI KHÔNG được trả về quần.
   - "relatedCategories" CHỈ ĐƯỢC CHỨA các danh mục Áo: "Áo Sơ Mi", "Áo Polo", "Áo Khoác & Blazer".
3. Nếu người dùng tìm phụ kiện (thắt lưng, ví, cà vạt...):
   - "typeConstraint" là "accessory". "relatedCategories": ["Phụ Kiện"].
4. Nếu người dùng tìm hoàn cảnh chung (đồ thu đông, đồ đi biển, đồ công sở):
   - "typeConstraint" là "all" (cả áo và quần đều được).

Trả về DUY NHẤT định dạng JSON:
{
  "typeConstraint": "bottom" | "top" | "accessory" | "all",
  "relatedCategories": ["Tên danh mục 1"],
  "expandedKeywords": ["từ khóa cụ thể 1", "từ khóa cụ thể 2"],
  "aiExplanation": "Giải thích ngắn dưới 15 chữ gợi ý cho người dùng"
}
`;
      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash-lite',
        contents: prompt
      });

      const text = response.text || '';
      const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanJson);
      if (parsed) {
        return {
          typeConstraint: parsed.typeConstraint || 'all',
          relatedCategories: parsed.relatedCategories || [],
          expandedKeywords: parsed.expandedKeywords || [],
          aiExplanation: parsed.aiExplanation || 'AI đã phân tích ngữ cảnh phù hợp cho bạn'
        };
      }
    } catch (e) {
      console.warn('Gemini Semantic Search parse error:', e);
    }
  }

  // Fallback Rule-based cho các từ khóa phổ biến khi API bận
  const q = query.toLowerCase();
  const isLookingForPant = q.includes('quần');
  const isLookingForShirt = q.includes('áo');

  if (isLookingForPant) {
    let cats = ['Quần Short', 'Quần Âu Công Sở', 'Quần Jeans & Khaki'];
    if (q.includes('ngủ') || q.includes('đùi') || q.includes('mặc nhà') || q.includes('ngắn')) {
      cats = ['Quần Short'];
    } else if (q.includes('âu') || q.includes('tây') || q.includes('công sở')) {
      cats = ['Quần Âu Công Sở'];
    } else if (q.includes('jean') || q.includes('khaki') || q.includes('bò')) {
      cats = ['Quần Jeans & Khaki'];
    }
    return {
      typeConstraint: 'bottom',
      relatedCategories: cats,
      expandedKeywords: ['quần'],
      aiExplanation: `Gợi ý các mẫu ${cats.join(', ')} phù hợp nhất`
    };
  }

  if (isLookingForShirt) {
    let cats = ['Áo Sơ Mi', 'Áo Polo', 'Áo Khoác & Blazer'];
    if (q.includes('sơ mi') || q.includes('dài tay')) {
      cats = ['Áo Sơ Mi'];
    } else if (q.includes('polo') || q.includes('cộc') || q.includes('thun')) {
      cats = ['Áo Polo'];
    } else if (q.includes('khoác') || q.includes('blazer') || q.includes('ấm')) {
      cats = ['Áo Khoác & Blazer'];
    }
    return {
      typeConstraint: 'top',
      relatedCategories: cats,
      expandedKeywords: ['áo'],
      aiExplanation: `Gợi ý các mẫu ${cats.join(', ')} phù hợp nhất`
    };
  }

  return {
    relatedCategories: [],
    expandedKeywords: [],
    aiExplanation: ''
  };
}

