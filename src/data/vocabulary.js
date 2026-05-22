// Dữ liệu từ vựng HSK 1 chia theo chủ đề
export const VOCABULARY_DATA = [
  {
    topicId: "greetings",
    topicName: "Chào hỏi & Đại từ",
    icon: "message-circle",
    words: [
      { id: "v1", hanzi: "你", pinyin: "nǐ", hanviet: "Nhĩ", meaning: "Bạn, anh, chị (ngôi thứ 2 số ít)", example: "你好！", examplePinyin: "Nǐ hǎo!", exampleMeaning: "Chào bạn!", soundUrl: "https://dict.youdao.com/dictvoice?audio=%E4%BD%A0&type=2" },
      { id: "v2", hanzi: "我", pinyin: "wǒ", hanviet: "Ngã", meaning: "Tôi, tao, tớ (ngôi thứ 1 số ít)", example: "我是学生。", examplePinyin: "Wǒ shì xué sheng.", exampleMeaning: "Tôi là học sinh.", soundUrl: "https://dict.youdao.com/dictvoice?audio=%E6%88%91&type=2" },
      { id: "v3", hanzi: "他", pinyin: "tā", hanviet: "Tha", meaning: "Anh ấy, ông ấy, cậu ấy", example: "他是我的老师。", examplePinyin: "Tā shì wǒ de lǎo shī.", exampleMeaning: "Thầy ấy là giáo viên của tôi.", soundUrl: "https://dict.youdao.com/dictvoice?audio=%E4%BB%96&type=2" },
      { id: "v4", hanzi: "她", pinyin: "tā", hanviet: "Tha (nữ)", meaning: "Cô ấy, bà ấy, chị ấy", example: "她很漂亮。", examplePinyin: "Tā hěn piào liang.", exampleMeaning: "Cô ấy rất xinh đẹp.", soundUrl: "https://dict.youdao.com/dictvoice?audio=%E5%A5%B3%E4%BB%96&type=2" },
      { id: "v5", hanzi: "们", pinyin: "men", hanviet: "Môn", meaning: "Chúng tôi, các bạn, bọn họ (hậu tố chỉ số nhiều)", example: " we: 我们 (wǒmen)", examplePinyin: "Wǒ men hěn máng.", exampleMeaning: "Chúng tôi rất bận.", soundUrl: "https://dict.youdao.com/dictvoice?audio=%E4%BB%AC&type=2" },
      { id: "v6", hanzi: "您", pinyin: "nín", hanviet: "Nẫm", meaning: "Ngài, ông, bà (kính trọng)", example: "老师，您好！", examplePinyin: "Lǎo shī, nín hǎo!", exampleMeaning: "Em chào thầy/cô ạ!", soundUrl: "https://dict.youdao.com/dictvoice?audio=%E6%82%A8&type=2" },
      { id: "v7", hanzi: "谢谢", pinyin: "xiè xie", hanviet: "Tạ tạ", meaning: "Cảm ơn", example: "谢谢你的 giúp đỡ (bāngzhù)。", examplePinyin: "Xiè xie nǐ!", exampleMeaning: "Cảm ơn bạn!", soundUrl: "https://dict.youdao.com/dictvoice?audio=%E8%B0%A2%E8%B0%A2&type=2" },
      { id: "v8", hanzi: "再见", pinyin: "zài jiàn", hanviet: "Tái kiến", meaning: "Tạm biệt, hẹn gặp lại", example: "爸爸，再见！", examplePinyin: "Bà ba, zài jiàn!", exampleMeaning: "Tạm biệt bố!", soundUrl: "https://dict.youdao.com/dictvoice?audio=%E5%86%8D%E8%A7%81&type=2" }
    ]
  },
  {
    topicId: "family",
    topicName: "Gia đình & Đời sống",
    icon: "users",
    words: [
      { id: "v9", hanzi: "家", pinyin: "jiā", hanviet: "Gia", meaning: "Nhà, gia đình", example: "我爱我的家。", examplePinyin: "Wǒ ài wǒ de jiā.", exampleMeaning: "Tôi yêu gia đình của tôi.", soundUrl: "https://dict.youdao.com/dictvoice?audio=%E5%AE%B6&type=2" },
      { id: "v10", hanzi: "爸爸", pinyin: "bà ba", hanviet: "Bá bá", meaning: "Bố, cha", example: "我爸爸是医生。", examplePinyin: "Wǒ bà ba shì yī shēng.", exampleMeaning: "Bố tôi là bác sĩ.", soundUrl: "https://dict.youdao.com/dictvoice?audio=%E7%88%B8%E7%88%B8&type=2" },
      { id: "v11", hanzi: "妈妈", pinyin: "mā ma", hanviet: "Ma ma", meaning: "Mẹ", example: "我妈妈做饭很好吃。", examplePinyin: "Wǒ mā ma zuò fàn hěn hǎo chī.", exampleMeaning: "Mẹ tôi nấu ăn rất ngon.", soundUrl: "https://dict.youdao.com/dictvoice?audio=%E5%A6%88%E5%A6%88&type=2" },
      { id: "v12", hanzi: "儿子", pinyin: "ér zi", hanviet: "Nhi tử", meaning: "Con trai", example: "他有三个儿子。", examplePinyin: "Tā yǒu sān ge ér zi.", exampleMeaning: "Anh ấy có ba người con trai.", soundUrl: "https://dict.youdao.com/dictvoice?audio=%E5%84%BF%E5%AD%90&type=2" },
      { id: "v13", hanzi: "女儿", pinyin: "nǚ 'ér", hanviet: "Nữ nhi", meaning: "Con gái", example: "我女儿今年五岁了。", examplePinyin: "Wǒ nǚ 'ér jīn nián wǔ suì le.", exampleMeaning: "Con gái tôi năm nay 5 tuổi rồi.", soundUrl: "https://dict.youdao.com/dictvoice?audio=%E5%A5%B3%E5%84%BF&type=2" },
      { id: "v14", hanzi: "朋友", pinyin: "péng you", hanviet: "Bằng hữu", meaning: "Bạn bè, người bạn", example: "他是我的好朋友。", examplePinyin: "Tā shì wǒ de hǎo péng you.", exampleMeaning: "Cậu ấy là người bạn tốt của tôi.", soundUrl: "https://dict.youdao.com/dictvoice?audio=%E6%9C%8B%E5%8F%8B&type=2" }
    ]
  },
  {
    topicId: "numbers",
    topicName: "Số đếm & Thời gian",
    icon: "calendar",
    words: [
      { id: "v15", hanzi: "一", pinyin: "yī", hanviet: "Nhất", meaning: "Số một (1)", example: "星期一 (Thứ hai)", examplePinyin: "Xīng qī yī.", exampleMeaning: "Hôm nay là thứ hai.", soundUrl: "https://dict.youdao.com/dictvoice?audio=%E4%B8%80&type=2" },
      { id: "v16", hanzi: "二", pinyin: "èr", hanviet: "Nhị", meaning: "Số hai (2)", example: "他有二(两)个姐姐。", examplePinyin: "Tā yǒu liǎng ge jiě jie.", exampleMeaning: "Anh ấy có hai người chị gái.", soundUrl: "https://dict.youdao.com/dictvoice?audio=%E4%BA%8C&type=2" },
      { id: "v17", hanzi: "三", pinyin: "sān", hanviet: "Tam", meaning: "Số ba (3)", example: "三月 (Tháng ba)", examplePinyin: "Sān yuè.", exampleMeaning: "Tháng ba.", soundUrl: "https://dict.youdao.com/dictvoice?audio=%E4%B8%89&type=2" },
      { id: "v18", hanzi: "十", pinyin: "shí", hanviet: "Thập", meaning: "Số mười (10)", example: "这里有十个人。", examplePinyin: "Zhè lǐ yǒu shí ge rén.", exampleMeaning: "Ở đây có 10 người.", soundUrl: "https://dict.youdao.com/dictvoice?audio=%E5%8D%81&type=2" },
      { id: "v19", hanzi: "年", pinyin: "nián", hanviet: "Niên", meaning: "Năm", example: "今年是二〇二六年。", examplePinyin: "Jīn nián shì èr líng èr liù nián.", exampleMeaning: "Năm nay là năm 2026.", soundUrl: "https://dict.youdao.com/dictvoice?audio=%E5%B9%B4&type=2" },
      { id: "v20", hanzi: "月", pinyin: "yuè", hanviet: "Nguyệt", meaning: "Tháng, mặt trăng", example: "九月十号是教师节。", examplePinyin: "Jiǔ yuè shí hào shì jiào shī jié.", exampleMeaning: "Ngày 10 tháng 9 là ngày nhà giáo.", soundUrl: "https://dict.youdao.com/dictvoice?audio=%E6%9C%88&type=2" },
      { id: "v21", hanzi: "号", pinyin: "hào", hanviet: "Hiệu", meaning: "Ngày, số (ngày trong tháng)", example: "今天几号？", examplePinyin: "Jīn tiān jǐ hào?", exampleMeaning: "Hôm nay ngày mấy?", soundUrl: "https://dict.youdao.com/dictvoice?audio=%E5%8F%B7&type=2" },
      { id: "v22", hanzi: "点", pinyin: "diǎn", hanviet: "Điểm", meaning: "Giờ (chỉ thời gian)", example: "现在几点？", examplePinyin: "Xiàn zài jǐ diǎn?", exampleMeaning: "Bây giờ là mấy giờ?", soundUrl: "https://dict.youdao.com/dictvoice?audio=%E7%82%B9&type=2" }
    ]
  },
  {
    topicId: "food",
    topicName: "Ăn uống & Mua sắm",
    icon: "shopping-bag",
    words: [
      { id: "v23", hanzi: "米饭", pinyin: "mǐ fàn", hanviet: "Mễ phạn", meaning: "Cơm, cơm trắng", example: "我想吃米饭。", examplePinyin: "Wǒ xiǎng chī mǐ fàn.", exampleMeaning: "Tôi muốn ăn cơm.", soundUrl: "https://dict.youdao.com/dictvoice?audio=%E7%B1%B3%E9%A5%AD&type=2" },
      { id: "v24", hanzi: "水", pinyin: "shuǐ", hanviet: "Thủy", meaning: "Nước", example: "请喝水。", examplePinyin: "Qǐng hē shuǐ.", exampleMeaning: "Xin mời uống nước.", soundUrl: "https://dict.youdao.com/dictvoice?audio=%E6%B0%B4&type=2" },
      { id: "v25", hanzi: "苹果", pinyin: "píng guǒ", hanviet: "Tần quả", meaning: "Quả táo", example: "这个苹果很大。", examplePinyin: "Zhè ge píng guǒ hěn dà.", exampleMeaning: "Quả táo này rất to.", soundUrl: "https://dict.youdao.com/dictvoice?audio=%E8%8B%B9%E6%9E%9C&type=2" },
      { id: "v26", hanzi: "茶", pinyin: "chá", hanviet: "Trà", meaning: "Trà, chè", example: "中国茶很好喝。", examplePinyin: "Zhōng guó chá hěn hǎo hē.", exampleMeaning: "Trà Trung Quốc rất ngon.", soundUrl: "https://dict.youdao.com/dictvoice?audio=%E8%8C%B6&type=2" },
      { id: "v27", hanzi: "买", pinyin: "mǎi", hanviet: "Mãi", meaning: "Mua", example: "我想买一个苹果。", examplePinyin: "Wǒ xiǎng mǎi yí ge píng guǒ.", exampleMeaning: "Tôi muốn mua một quả táo.", soundUrl: "https://dict.youdao.com/dictvoice?audio=%E4%B9%B0&type=2" },
      { id: "v28", hanzi: "钱", pinyin: "qián", hanviet: "Tiền", meaning: "Tiền, tiền bạc", example: "这个多少钱？", examplePinyin: "Zhè ge duō shǎo qián?", exampleMeaning: "Cái này bao nhiêu tiền?", soundUrl: "https://dict.youdao.com/dictvoice?audio=%E9%92%B1&type=2" }
    ]
  },
  {
    topicId: "school",
    topicName: "Học tập & Công việc",
    icon: "book-open",
    words: [
      { id: "v29", hanzi: "学校", pinyin: "xué xiào", hanviet: "Học hiệu", meaning: "Trường học", example: "我们的学校很大。", examplePinyin: "Wǒ men de xué xiào hěn dà.", exampleMeaning: "Trường học của chúng tôi rất lớn.", soundUrl: "https://dict.youdao.com/dictvoice?audio=%E5%AD%A6%E6%A0%A1&type=2" },
      { id: "v30", hanzi: "老师", pinyin: "lǎo shī", hanviet: "Lão sư", meaning: "Thầy giáo, cô giáo, giáo viên", example: "她是我们的汉语老师。", examplePinyin: "Tā shì wǒ men de hàn yǔ lǎo shī.", exampleMeaning: "Cô ấy là giáo viên tiếng Trung của chúng tôi.", soundUrl: "https://dict.youdao.com/dictvoice?audio=%E8%80%81%E5%B8%88&type=2" },
      { id: "v31", hanzi: "学生", pinyin: "xué sheng", hanviet: "Học sinh", meaning: "Học sinh, sinh viên", example: "学校里有很多学生。", examplePinyin: "Xué xiào lǐ yǒu hěn duō xué sheng.", exampleMeaning: "Trong trường học có rất nhiều học sinh.", soundUrl: "https://dict.youdao.com/dictvoice?audio=%E5%AD%A6%E7%94%9F&type=2" },
      { id: "v32", hanzi: "汉语", pinyin: "hàn yǔ", hanviet: "Hán ngữ", meaning: "Tiếng Trung, tiếng Hán", example: "学汉语很有趣。", examplePinyin: "Xué hàn yǔ hěn yǒu qù.", exampleMeaning: "Học tiếng Trung rất thú vị.", soundUrl: "https://dict.youdao.com/dictvoice?audio=%E6%B1%89%E8%AF%AD&type=2" },
      { id: "v33", hanzi: "书", pinyin: "shū", hanviet: "Thư", meaning: "Sách, cuốn sách", example: "桌子上有一本书。", examplePinyin: "Zhuō zi shang yǒu yì běn shū.", exampleMeaning: "Trên bàn có một cuốn sách.", soundUrl: "https://dict.youdao.com/dictvoice?audio=%E4%B9%A6&type=2" },
      { id: "v34", hanzi: "写", pinyin: "xiě", hanviet: "Tả", meaning: "Viết, tập viết", example: "他在写汉字。", examplePinyin: "Tā zài xiě hàn zì.", exampleMeaning: "Cậu ấy đang viết chữ Hán.", soundUrl: "https://dict.youdao.com/dictvoice?audio=%E5%86%99&type=2" }
    ]
  }
];
