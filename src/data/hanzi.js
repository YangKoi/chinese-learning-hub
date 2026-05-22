// Dữ liệu nét viết cơ bản và tọa độ SVG nét viết của một số chữ Hán mẫu
export const STROKES_BASIC = [
  { name: "Nét Ngang (Héng - 横)", desc: "Viết từ trái qua phải, nằm ngang.", symbol: "一", example: "三 (sān)" },
  { name: "Nét Sổ (Shù - 竖)", desc: "Viết từ trên xuống dưới, thẳng đứng.", symbol: "丨", example: "十 (shí)" },
  { name: "Nét Phẩy (Piě - 撇)", desc: "Viết từ trên xuống, cong xiên về bên trái.", symbol: "丿", example: "人 (rén)" },
  { name: "Nét Mác (Nà - 捺)", desc: "Viết từ trên xuống, thẳng xiên về bên phải, đuôi dày ra.", symbol: "乀", example: "八 (bā)" },
  { name: "Nét Chấm (Diǎn - 点)", desc: "Một điểm nhấn nhẹ từ trên xuống dưới, hơi nghiêng về phải.", symbol: "丶", example: "六 (liù)" },
  { name: "Nét Hất (Tí - 提)", desc: "Đặt bút rồi hất mạnh xéo từ dưới lên trên, nghiêng sang phải.", symbol: "㇀", example: "我 (wǒ)" },
  { name: "Nét Gập (Zhé - 折)", desc: "Có nét gập góc ở giữa (ngang gập, sổ gập...).", symbol: "𠃋", example: "口 (kǒu)" },
  { name: "Nét Móc (Gōu - 钩)", desc: "Có một móc nhỏ nhọn ở cuối nét vẽ.", symbol: "亅", example: "小 (xiǎo)" }
];

export const HANZI_WRITING_DATA = [
  {
    character: "一",
    pinyin: "yī",
    meaning: "Một (Số 1)",
    strokesCount: 1,
    canvasGuide: "Viết một nét ngang phẳng từ trái qua phải.",
    strokes: [
      "M 15 50 L 85 50"
    ]
  },
  {
    character: "二",
    pinyin: "èr",
    meaning: "Hai (Số 2)",
    strokesCount: 2,
    canvasGuide: "Viết nét ngang ngắn ở trên trước, nét ngang dài hơn ở dưới sau.",
    strokes: [
      "M 25 35 L 75 35",
      "M 15 65 L 85 65"
    ]
  },
  {
    character: "三",
    pinyin: "sān",
    meaning: "Ba (Số 3)",
    strokesCount: 3,
    canvasGuide: "Viết nét ngang trên, nét ngang giữa ngắn nhất, và nét ngang dưới cùng dài nhất.",
    strokes: [
      "M 25 25 L 75 25",
      "M 32 50 L 68 50",
      "M 15 75 L 85 75"
    ]
  },
  {
    character: "人",
    pinyin: "rén",
    meaning: "Người (Nhân)",
    strokesCount: 2,
    canvasGuide: "Viết nét Phẩy xiên trái trước, sau đó đặt bút từ giữa nét phẩy xiên phải viết nét Mác.",
    strokes: [
      "M 50 20 Q 40 50 20 80",
      "M 44 42 Q 62 62 82 80"
    ]
  },
  {
    character: "口",
    pinyin: "kǒu",
    meaning: "Miệng (Khẩu)",
    strokesCount: 3,
    canvasGuide: "Viết nét sổ dọc trái, tiếp theo viết nét ngang gập bên phải, cuối cùng đóng lại bằng nét ngang dưới.",
    strokes: [
      "M 28 25 L 28 75",
      "M 28 25 L 72 25 L 72 75",
      "M 28 75 L 72 75"
    ]
  },
  {
    character: "日",
    pinyin: "rì",
    meaning: "Ngày / Mặt trời (Nhật)",
    strokesCount: 4,
    canvasGuide: "Viết giống chữ Khẩu nhưng thon dài hơn, thêm nét ngang ở giữa rồi mới đóng nét ngang dưới cùng.",
    strokes: [
      "M 28 20 L 28 80",
      "M 28 20 L 72 20 L 72 80",
      "M 28 50 L 72 50",
      "M 28 80 L 72 80"
    ]
  },
  {
    character: "中",
    pinyin: "zhōng",
    meaning: "Giữa / Trung",
    strokesCount: 4,
    canvasGuide: "Viết một chữ Khẩu (口) dẹt ở giữa trước, sau đó vẽ một nét sổ thẳng đứng xuyên qua tâm chữ.",
    strokes: [
      "M 22 32 L 22 68",
      "M 22 32 L 78 32 L 78 68",
      "M 22 68 L 78 68",
      "M 50 12 L 50 88"
    ]
  }
];
