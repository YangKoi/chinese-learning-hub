// Bộ câu hỏi trắc nghiệm ôn luyện đa dạng cho người học
export const QUIZ_QUESTIONS = [
  {
    id: "q1",
    type: "hanzi-to-pinyin",
    question: "Phiên âm Pinyin chính xác của chữ Hán '你' là gì?",
    options: ["wǒ", "tā", "nǐ", "nín"],
    answer: "nǐ",
    explanation: "Chữ '你' nghĩa là bạn/anh/chị, có phiên âm Pinyin là 'nǐ'."
  },
  {
    id: "q2",
    type: "meaning-to-hanzi",
    question: "Chữ Hán nào dưới đây mang ý nghĩa là 'Cám ơn'?",
    options: ["再见", "谢谢", "朋友", "老师"],
    answer: "谢谢",
    explanation: "'谢谢' (xièxie) nghĩa là cảm ơn; '再见' là tạm biệt; '朋友' là bạn bè; '老师' là giáo viên."
  },
  {
    id: "q3",
    type: "pinyin-to-meaning",
    question: "Từ phiên âm 'mā ma' tương ứng với nghĩa nào dưới đây?",
    options: ["Bố", "Mẹ", "Con gái", "Bạn bè"],
    answer: "Mẹ",
    explanation: "'mā ma' là phiên âm của chữ '妈妈', dịch nghĩa tiếng Việt là 'Mẹ'."
  },
  {
    id: "q4",
    type: "hanzi-to-meaning",
    question: "Nghĩa tiếng Việt của chữ '学校' là gì?",
    options: ["Học sinh", "Giáo viên", "Trường học", "Sách học"],
    answer: "Trường học",
    explanation: "'学校' (xuéxiào) có âm Hán Việt là Học hiệu, mang nghĩa là 'Trường học'."
  },
  {
    id: "q5",
    type: "listening-quiz",
    question: "Nghe từ phát âm và chọn phiên âm đúng nhất:",
    soundUrl: "https://dict.youdao.com/dictvoice?audio=%E6%B0%B4&type=2",
    options: ["shū", "shuǐ", "chá", "qián"],
    answer: "shuǐ",
    explanation: "Âm thanh phát ra là 'shuǐ' (Chữ Hán: '水', nghĩa là Nước)."
  },
  {
    id: "q6",
    type: "pinyin-to-hanzi",
    question: "Phiên âm 'hàn yǔ' ứng với chữ Hán nào sau đây?",
    options: ["汉语", "写字", "米饭", "苹果"],
    answer: "汉语",
    explanation: "'hàn yǔ' phiên âm Hán ngữ (tiếng Trung) viết là '汉语'."
  },
  {
    id: "q7",
    type: "tone-quiz",
    question: "Thanh điệu nào sau đây được đọc dứt khoát mạnh từ cao xuống thấp (ví dụ: à)?",
    options: ["Thanh 1", "Thanh 2", "Thanh 3", "Thanh 4"],
    answer: "Thanh 4",
    explanation: "Thanh 4 (Thanh điệu rơi xuống nhanh, mạnh, dứt khoát từ cao độ 5 xuống 1, kí hiệu bằng dấu huyền ngược: `à`)."
  },
  {
    id: "q8",
    type: "sentence-reorder",
    question: "Sắp xếp các từ sau thành câu hoàn chỉnh: '是 (shì) / 我 (wǒ) / 学生 (xué sheng)'",
    options: [
      "学生 是 我",
      "我 学生 是",
      "我 是 学生",
      "是 我 学生"
    ],
    answer: "我 是 学生",
    explanation: "Cấu trúc câu khẳng định cơ bản trong tiếng Trung là: Chủ ngữ (我 - Tôi) + Động từ (是 - là) + Tân ngữ (学生 - học sinh)."
  }
];
