import React from 'react';
import { Wind, Droplets, Cpu, Shield, Sparkles, CheckCircle2 } from 'lucide-react';

export const FABRIC_LIST = [
  {
    id: 'thermo-lock',
    name: 'THERMO-LOCK™',
    subtitle: 'Khóa Nhiệt Tối Đa & Giữ Ấm Siêu Nhẹ',
    category: 'Áo Khoác & Blazer',
    icon: Wind,
    image: 'https://images.unsplash.com/photo-1548883354-7622d03aca27?q=80&w=800&auto=format&fit=crop',
    tagline: 'Giữ ấm thân nhiệt 37°C trong điều kiện thời tiết đại hàn khắc nghiệt mà vẫn đảm bảo độ thanh thoát, không cồng kềnh.',
    features: [
      'Cấu trúc đệm bông chần đa khoang 120gsm cản gió lạnh tuyệt đối',
      'Lớp màng chắn Nano vi mô ngăn thoát nhiệt từ cơ thể ra bên ngoài',
      'Bề mặt trượt nước thông minh Water-Repellent chống mưa phùn và sương sớm',
      'Trọng lượng siêu nhẹ chỉ bằng 1/3 so với áo khoác len dạ truyền thống'
    ],
    care: 'Giặt máy chế độ nhẹ, sấy nhiệt độ thấp, không ủi trực tiếp ở nhiệt độ cao.',
    suitability: 'Hoàn hảo cho áo măng tô, áo khoác chần bông, áo phao lông vũ và blazer thu đông.'
  },
  {
    id: 'modal-silk',
    name: 'MODAL-SILK™',
    subtitle: 'Chống Nhăn Tự Nhiên & Óng Ả Chuẩn Quý Ông',
    category: 'Áo Sơ Mi',
    icon: Droplets,
    image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=800&auto=format&fit=crop',
    tagline: 'Sự hòa quyện tuyệt hảo giữa sợi sồi sinh thái Bắc Âu và tơ tằm tự nhiên cho bề mặt áo sơ mi mịn như lụa.',
    features: [
      'Khả năng chống nhăn tự nhiên, giữ nếp phẳng phiu suốt 12 tiếng làm việc',
      'Hút ẩm và thông thoáng cao gấp 2 lần so với sợi cotton thông thường',
      'Độ óng ánh nhẹ tự nhiên tạo chiều sâu sang trọng dưới ánh đèn công sở',
      'Cảm giác chạm mát lạnh (Cool-Touch) ngay khi tiếp xúc với làn da'
    ],
    care: 'Giặt tay hoặc giặt máy kèm túi giặt, phơi nơi râm mát, là ủi nhẹ ở nhiệt độ trung bình.',
    suitability: 'Được thiết kế độc quyền cho sơ mi công sở cao cấp, sơ mi dạ tiệc và sơ mi kháng khuẩn.'
  },
  {
    id: 'diamond-air',
    name: 'DIAMOND-AIR™',
    subtitle: 'Dệt Tổ Ong Kim Cương Siêu Thoát Khí',
    category: 'Áo Polo',
    icon: Cpu,
    image: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?q=80&w=800&auto=format&fit=crop',
    tagline: 'Đột phá dệt kim tổ ong micro hình kim cương giúp luồng không khí lưu thông liên tục, giải nhiệt cơ thể ngay lập tức.',
    features: [
      'Công nghệ dệt lỗ vi mô đa chiều đối lưu khí nóng, hạ nhiệt từ 2 - 3°C',
      'Khô thoáng siêu tốc Quick-Dry chỉ sau 15 phút vận động ra mồ hôi',
      'Không bai xù, không dão cổ áo sau hơn 100 lần giặt máy liên tục',
      'Xử lý ion bạc kháng khuẩn khử mùi hôi cơ thể cả ngày dài'
    ],
    care: 'Giặt máy thoải mái với nước mát, không dùng chất tẩy clo mạnh.',
    suitability: 'Ứng dụng chính trên dòng áo Polo Smart Casual, áo thun thể thao và trang phục di chuyển thường nhật.'
  },
  {
    id: 'flex-stretch',
    name: 'FLEX-STRETCH 4D™',
    subtitle: 'Co Giãn Đa Chiều & Định Hình Phom Dáng',
    category: 'Quần Âu Công Sở',
    icon: Shield,
    image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?q=80&w=800&auto=format&fit=crop',
    tagline: 'Sự kết hợp giữa sợi Poly-Rayon cao cấp và 5% Spandex đàn hồi giúp phái mạnh đứng ngồi, lái xe thoải mái mà quần không bị mất ly.',
    features: [
      'Co giãn 4 hướng linh hoạt (ngang, dọc, chéo), không gò bó bắp đùi hay hông',
      'Định hình nếp ly vĩnh viễn (Permanent Crease) không cần ủi thường xuyên',
      'Chống bai gối và hạn chế bám bụi bẩn khi di chuyển ngoài đường phố',
      'Lưng cạp chun co giãn thông minh ẩn bên trong đai quần âu'
    ],
    care: 'Giặt sấy thông thường, treo móc kẹp quần để giữ form dáng bền đẹp.',
    suitability: 'Áp dụng cho quần âu công sở, quần kaki phom slim-fit và quần âu dự tiệc.'
  }
];
