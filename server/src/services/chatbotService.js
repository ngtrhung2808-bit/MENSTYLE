import { AI_Conversation } from '../models/AI_Conversation.js';
import { Product } from '../models/Product.js';

export const handleChatMessage = async ({ sessionId = 'guest_session', userId = null, messageText }) => {
  const query = messageText.toLowerCase().trim();
  let replyText = '';
  let intent = 'general';
  let suggestedProducts = [];

  // 1. Intent: Chính sách đổi trả / bảo hành
  if (query.includes('đổi trả') || query.includes('bảo hành') || query.includes('chính sách')) {
    intent = 'policy_inquiry';
    replyText = 'MENSTYLE cam kết chính sách đặc quyền: Hỗ trợ đổi size và mẫu miễn phí trong 30 ngày tận nơi. Shipper sẽ mang sản phẩm mới đến và thu hồi lại sản phẩm cũ tại nhà cho quý ông mà không phát sinh thêm chi phí!';
  }
  // 2. Intent: Tư vấn chọn size theo chiều cao / cân nặng
  else if (query.includes('size') || query.includes('chiều cao') || query.includes('cân nặng') || query.includes('kg') || query.includes('cm')) {
    intent = 'size_advice';
    const weightMatch = query.match(/(\d+)\s*(kg|kí|cân)/i) || query.match(/nặng\s*(\d+)/i);
    const heightMatch = query.match(/(\d{3})\s*(cm|m)/i) || query.match(/cao\s*(\d+)/i);

    if (weightMatch || heightMatch) {
      const weight = weightMatch ? parseInt(weightMatch[1]) : 65;
      let suggestedSize = 'M';
      if (weight < 58) suggestedSize = 'S';
      else if (weight <= 66) suggestedSize = 'M';
      else if (weight <= 75) suggestedSize = 'L';
      else if (weight <= 84) suggestedSize = 'XL';
      else suggestedSize = '2XL';

      replyText = `Dựa trên số đo thể hình của bạn (khoảng ${weight}kg), Stylist MENSTYLE khuyên bạn nên lựa chọn phom áo/quần size [${suggestedSize}] để có độ vừa vặn slim-fit tôn dáng chuẩn nhất!`;
    } else {
      replyText = 'Stylist MENSTYLE luôn sẵn sàng tư vấn size chuẩn cho bạn. Xin quý ông vui lòng cung cấp chiều cao (cm) và cân nặng (kg) để tôi gợi ý kích cỡ phù hợp nhất nhé!';
    }
  }
  // 3. Intent: Phối đồ dạ tiệc / sự kiện / Blazer
  else if (query.includes('blazer') || query.includes('tiệc') || query.includes('suit') || query.includes('phối đồ')) {
    intent = 'style_recommendation';
    replyText = 'Với sự kiện hoặc tiệc tối trang trọng, Stylist MENSTYLE gợi ý bạn kết hợp Áo Blazer Italian Wool Dáng Slim-fit cùng Áo Sơ Mi Trắng Kháng Khuẩn Nano và Thắt lưng da bò cao cấp. Đây là bộ trang phục quyền lực và đĩnh đạc nhất!';
    suggestedProducts = await Product.find({
      $or: [
        { category: 'Blazer & Suit' },
        { tags: { $in: ['blazer', 'suit', 'tiệc tối'] } }
      ]
    }).limit(3);
  }
  // 4. Intent: Tìm kiếm sản phẩm thông minh (Áo polo, Sơ mi, Quần tây...)
  else {
    // Tìm thử trong database xem có từ khóa khớp không
    const matchedProducts = await Product.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { category: { $regex: query, $options: 'i' } },
        { tags: { $in: [new RegExp(query, 'i')] } }
      ]
    }).limit(3);

    if (matchedProducts.length > 0) {
      intent = 'product_recommendation';
      suggestedProducts = matchedProducts;
      replyText = `MENSTYLE có các mẫu ${matchedProducts.map(p => p.name).slice(0, 2).join(' và ')} rất được các quý ông ưa chuộng. Bạn có thể xem nhanh các gợi ý nổi bật dưới đây:`;
    } else {
      intent = 'fallback';
      replyText = 'Cảm ơn quý ông đã liên hệ với Stylist AI của MENSTYLE! Tôi có thể hỗ trợ bạn chọn size áo/quần, gợi ý phối set đồ cho sự kiện, hoặc tra cứu các mẫu thời trang nam cao cấp.';
    }
  }

  // Lưu lịch sử vào MongoDB AI_Conversation
  let conversation = await AI_Conversation.findOne({ sessionId });
  if (!conversation) {
    conversation = new AI_Conversation({
      sessionId,
      userId,
      messages: []
    });
  }

  conversation.messages.push({
    sender: 'user',
    text: messageText,
    metadata: { intent }
  });

  conversation.messages.push({
    sender: 'bot',
    text: replyText,
    suggestedProducts: suggestedProducts.map(p => p._id),
    metadata: { intent }
  });

  conversation.lastActiveAt = new Date();
  await conversation.save();

  return {
    replyText,
    intent,
    suggestedProducts
  };
};
