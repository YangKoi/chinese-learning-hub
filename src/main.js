import { createIcons, icons } from 'lucide';
import confetti from 'canvas-confetti';
import { firebaseService } from './firebase';
import { PINYIN_DATA } from './data/pinyin';
import { VOCABULARY_DATA } from './data/vocabulary';
import { HANZI_WRITING_DATA, STROKES_BASIC } from './data/hanzi';
import { QUIZ_QUESTIONS } from './data/quiz';

// ==========================================================================
// TRẠNG THÁI TOÀN CỤC CỦA ỨNG DỤNG (GLOBAL STATE)
// ==========================================================================
let state = {
  currentTab: 'dashboard',
  theme: 'dark',
  user: null,
  progress: firebaseService.getDefaultProgress('Học viên'),
  
  // Trạng thái Pinyin
  activePinyinType: 'initials',
  activePinyinItem: null,
  toneGameAnswer: null,

  // Trạng thái Flashcard
  activeTopicId: VOCABULARY_DATA[0].topicId,
  activeVocabIndex: 0,
  cardFlipped: false,

  // Trạng thái Hanzi
  activeHanziIndex: 0,
  isDrawing: false,
  canvasContext: null,
  
  // Trạng thái Quiz
  quizActive: false,
  quizCurrentQuestionIndex: 0,
  quizAnswers: [], // Lưu các câu trả lời đúng/sai
  quizSelectedOption: null,
  quizFinished: false
};

// ==========================================================================
// KHỞI ĐỘNG KHI TẢI TRANG (DOM CONTENT LOADED)
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initNavigation();
  initLucideIcons();
  
  // Thiết lập Firebase Auth Subscription
  firebaseService.subscribeAuth(async (user) => {
    state.user = user;
    updateUIForAuth(user);
    
    if (user) {
      // Tải tiến trình học tập từ đám mây (hoặc local backup)
      const data = await firebaseService.getUserData(user.uid);
      if (data) {
        state.progress = data;
      } else {
        state.progress = firebaseService.getDefaultProgress(user.displayName || 'Học viên');
        await firebaseService.saveUserData(user.uid, state.progress);
      }
      
      // Đồng bộ từ local cũ nếu có
      await firebaseService.syncLocalToCloud(user.uid);
    } else {
      // Chế độ Khách (Local Mode)
      const guestProgress = localStorage.getItem('progress_local_guest');
      if (guestProgress) {
        state.progress = JSON.parse(guestProgress);
      } else {
        state.progress = firebaseService.getDefaultProgress('Học viên');
        localStorage.setItem('progress_local_guest', JSON.stringify(state.progress));
      }
    }
    
    // Cập nhật giao diện theo dữ liệu tiến độ mới
    updateStatsUI();
    renderDashboardRoadmap();
    renderPinyinGrid();
    renderVocabTopicSelector();
    renderFlashcard();
    renderHanziLab();
    updateFirebaseSettingsForm();
  });

  // Đăng ký toàn bộ event listeners
  bindEvents();
});

// Khởi tạo các biểu tượng Lucide
function initLucideIcons() {
  createIcons({ icons });
}

// Khởi tạo giao diện tối / sáng
function initTheme() {
  const savedTheme = localStorage.getItem('chinese_theme') || 'dark';
  state.theme = savedTheme;
  document.documentElement.setAttribute('data-theme', savedTheme);
  
  const themeBtn = document.getElementById('theme-toggle-btn');
  const themeIcon = themeBtn.querySelector('i');
  if (savedTheme === 'light') {
    themeIcon.setAttribute('data-lucide', 'moon');
  } else {
    themeIcon.setAttribute('data-lucide', 'sun');
  }
  initLucideIcons();
}

// Chuyển đổi theme Sáng/Tối
function toggleTheme() {
  const newTheme = state.theme === 'dark' ? 'light' : 'dark';
  state.theme = newTheme;
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('chinese_theme', newTheme);
  
  const themeBtn = document.getElementById('theme-toggle-btn');
  const themeIcon = themeBtn.querySelector('i');
  if (newTheme === 'light') {
    themeIcon.setAttribute('data-lucide', 'moon');
  } else {
    themeIcon.setAttribute('data-lucide', 'sun');
  }
  
  // Hiệu ứng dịch orb glow cho đẹp
  const orbLeft = document.getElementById('orb-left');
  const orbRight = document.getElementById('orb-right');
  if (newTheme === 'light') {
    if(orbLeft) orbLeft.style.opacity = '0.04';
    if(orbRight) orbRight.style.opacity = '0.04';
  } else {
    if(orbLeft) orbLeft.style.opacity = '0.15';
    if(orbRight) orbRight.style.opacity = '0.15';
  }
  
  initLucideIcons();
}

// ==========================================================================
// ĐIỀU HƯỚNG & SPA ROUTER
// ==========================================================================
function initNavigation() {
  const navLinks = document.querySelectorAll('.nav-link');
  
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = link.getAttribute('data-target');
      switchTab(target);
    });
  });
}

function switchTab(tabId) {
  state.currentTab = tabId;
  
  // Active Sidebar Link
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    if (link.getAttribute('data-target') === tabId) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
  
  // Show/Hide Sections
  const sections = document.querySelectorAll('.app-section');
  sections.forEach(sec => {
    if (sec.id === `${tabId}-section`) {
      sec.classList.add('active');
    } else {
      sec.classList.remove('active');
    }
  });

  // Tùy biến tiêu đề header theo tab
  const headerTitle = document.getElementById('header-title');
  const headerSubtitle = document.getElementById('header-subtitle');
  const username = state.progress.displayName || 'Học viên';

  switch (tabId) {
    case 'dashboard':
      headerTitle.innerText = `Chào mừng quay trở lại, ${username}!`;
      headerSubtitle.innerText = 'Hôm nay bạn muốn rèn luyện kỹ năng nào nào?';
      renderDashboardRoadmap();
      break;
    case 'pinyin':
      headerTitle.innerText = 'Bảng Phát Âm Tiếng Trung';
      headerSubtitle.innerText = 'Luyện nghe và phát âm chuẩn các thanh mẫu, vận mẫu Pinyin.';
      renderPinyinGrid();
      break;
    case 'flashcard':
      headerTitle.innerText = 'Học Từ Vựng Flashcard';
      headerSubtitle.innerText = 'Học từ vựng thông dụng qua thẻ lật 3D tương tác thông minh.';
      renderFlashcard();
      break;
    case 'hanzi':
      headerTitle.innerText = 'Luyện Viết Chữ Hán';
      headerSubtitle.innerText = 'Học quy tắc bút thuận và tập vẽ chữ Hán trực tiếp trên màn hình.';
      renderHanziLab();
      break;
    case 'quiz':
      headerTitle.innerText = 'Đấu Trường Quiz Trắc Nghiệm';
      headerSubtitle.innerText = 'Kiểm tra và củng cố kiến thức để tích lũy điểm kinh nghiệm XP.';
      resetQuizUI();
      break;
    case 'settings':
      headerTitle.innerText = 'Đồng Bộ Hóa Tiến Trình';
      headerSubtitle.innerText = 'Quản lý dữ liệu sao lưu hoặc kết nối tới Google Firebase.';
      updateFirebaseSettingsForm();
      break;
  }
  
  // Tự động cuộn trang lên đầu
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Cập nhật HUD chỉ số điểm & streak
function updateStatsUI() {
  const streakCount = document.getElementById('streak-count');
  const xpCount = document.getElementById('xp-count');
  const dbStreak = document.getElementById('db-streak');
  const dbXp = document.getElementById('db-xp');
  const dbLevel = document.getElementById('db-level');

  const { streak, xp, level } = state.progress;

  if (streakCount) streakCount.innerText = streak;
  if (xpCount) xpCount.innerText = xp;
  if (dbStreak) dbStreak.innerText = streak;
  if (dbXp) dbXp.innerText = xp;
  if (dbLevel) dbLevel.innerText = level;

  // Cập nhật vòng tròn tiến độ hôm nay (Mục tiêu 30 XP)
  const percent = Math.min(Math.round((xp % 30) / 30 * 100), 100);
  const ring = document.getElementById('daily-progress-ring');
  const percentDisplay = document.getElementById('daily-xp-percent');
  const xpDisplay = document.getElementById('daily-current-xp');

  if (ring) {
    // Chiều dài vòng tròn là 2 * Math.PI * r = 2 * 3.14 * 60 = ~377
    const offset = 377 - (percent / 100 * 377);
    ring.style.strokeDashoffset = offset;
  }
  if (percentDisplay) percentDisplay.innerText = percent;
  if (xpDisplay) xpDisplay.innerText = xp % 30;
}

// Cộng điểm XP cho người dùng
async function gainXP(amount) {
  state.progress.xp += amount;
  
  // Tính toán cấp độ (mỗi 100 XP lên 1 cấp)
  const newLevel = Math.floor(state.progress.xp / 100) + 1;
  if (newLevel > state.progress.level) {
    state.progress.level = newLevel;
    triggerConfetti();
    alert(`🎉 Chúc mừng bạn đã tăng cấp! Bạn hiện đang đạt Cấp độ ${newLevel}!`);
  }
  
  // Cập nhật streak ngày nếu là ngày mới
  updateStreak();
  
  updateStatsUI();
  
  // Lưu tiến trình lên Cloud hoặc local
  if (state.user) {
    await firebaseService.saveUserData(state.user.uid, state.progress);
  } else {
    localStorage.setItem('progress_local_guest', JSON.stringify(state.progress));
  }
}

// Cập nhật chuỗi học Streak hàng ngày
function updateStreak() {
  const todayStr = new Date().toDateString();
  const lastActive = state.progress.lastActiveDate;

  if (!lastActive) {
    state.progress.streak = 1;
  } else {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toDateString();

    if (lastActive === yesterdayStr) {
      state.progress.streak += 1;
    } else if (lastActive !== todayStr) {
      state.progress.streak = 1; // Đứt chuỗi, thiết lập lại
    }
  }
  
  state.progress.lastActiveDate = todayStr;
}

// Hiệu ứng pháo hoa ăn mừng Confetti
function triggerConfetti() {
  confetti({
    particleCount: 150,
    spread: 80,
    origin: { y: 0.6 }
  });
}

// ==========================================================================
// A. MODULE: DASHBOARD ROADMAP GENERATOR
// ==========================================================================
function renderDashboardRoadmap() {
  const container = document.getElementById('learning-roadmap');
  if (!container) return;
  container.innerHTML = '';

  VOCABULARY_DATA.forEach((topic, index) => {
    const isUnlocked = state.progress.unlockedLessons.includes(topic.topicId);
    // Vị trí chặng đang học
    const isActive = isUnlocked && (index === VOCABULARY_DATA.length - 1 || !state.progress.unlockedLessons.includes(VOCABULARY_DATA[index+1].topicId));
    
    let nodeClass = 'locked';
    let statusText = 'Chưa mở khóa';
    
    if (isActive) {
      nodeClass = 'active';
      statusText = 'Đang rèn luyện';
    } else if (isUnlocked) {
      nodeClass = 'unlocked';
      statusText = 'Đã mở khóa';
    }

    const nodeElement = document.createElement('div');
    nodeElement.className = `roadmap-node ${nodeClass}`;
    nodeElement.innerHTML = `
      <div class="node-circle" title="${statusText}">
        ${index + 1}
      </div>
      <div class="node-content">
        <h3>
          <i data-lucide="${topic.icon}"></i> ${topic.topicName}
          ${isUnlocked ? '' : '<i data-lucide="lock" style="width:14px; height:14px; color:var(--text-muted);"></i>'}
        </h3>
        <p>${topic.words.length} từ vựng cơ bản • ${statusText}</p>
      </div>
    `;

    // Nếu đã mở khóa, click sẽ nhảy tới Tab từ vựng chủ đề đó
    if (isUnlocked) {
      nodeElement.addEventListener('click', () => {
        state.activeTopicId = topic.topicId;
        state.activeVocabIndex = 0;
        switchTab('flashcard');
      });
    }

    container.appendChild(nodeElement);
  });
  
  initLucideIcons();
}

// ==========================================================================
// B. MODULE: PINYIN INTERACTIVE CHART & TONE GAME
// ==========================================================================
function renderPinyinGrid() {
  const grid = document.getElementById('pinyin-items-grid');
  if (!grid) return;
  grid.innerHTML = '';

  const activeTab = state.activePinyinType;
  const items = PINYIN_DATA[activeTab];

  items.forEach(item => {
    const card = document.createElement('div');
    card.className = 'pinyin-card';
    card.innerHTML = `
      <span class="pinyin-sound">${item.sound || item.symbol}</span>
      <span class="pinyin-read">${item.read || item.name.split(' ')[0]}</span>
    `;

    card.addEventListener('click', () => {
      playAudio(item.soundUrl, card);
      showPinyinDetails(item);
    });

    grid.appendChild(card);
  });
}

function showPinyinDetails(item) {
  const placeholder = document.getElementById('pinyin-placeholder');
  const content = document.getElementById('pinyin-detail-content');
  
  if (!placeholder || !content) return;
  
  placeholder.style.display = 'none';
  content.style.display = 'block';

  document.getElementById('detail-sound').innerText = item.sound || item.symbol;
  document.getElementById('detail-ipa').innerText = item.ipa || item.name;
  document.getElementById('detail-read').innerText = item.read || 'Không có';
  document.getElementById('detail-desc').innerText = item.desc;
  
  const exampleElement = document.getElementById('detail-example');
  if (item.example) {
    exampleElement.innerText = `Ví dụ: ${item.example}`;
    exampleElement.style.display = 'block';
  } else {
    exampleElement.style.display = 'none';
  }

  // Nút nghe
  const playBtn = document.getElementById('detail-play-sound-btn');
  playBtn.onclick = () => playAudio(item.soundUrl, playBtn);
}

// Luyện nghe thanh điệu (Mini-game)
function playToneGameQuestion() {
  const toneIndex = Math.floor(Math.random() * PINYIN_DATA.tones.length);
  const toneObj = PINYIN_DATA.tones[toneIndex];
  state.toneGameAnswer = toneIndex + 1; // Thanh 1, 2, 3, 4 hoặc thanh nhẹ (5)

  // Reset nút
  const optButtons = document.querySelectorAll('.game-opt-btn');
  optButtons.forEach(btn => {
    btn.className = 'game-opt-btn';
    btn.disabled = false;
  });

  const feedback = document.getElementById('tone-game-feedback');
  if (feedback) feedback.innerText = '';

  // Phát âm thanh câu hỏi
  playAudio(toneObj.soundUrl);
}

function handleToneGameGuess(element, userTone) {
  const correctTone = state.toneGameAnswer;
  if (!correctTone) return;

  const feedback = document.getElementById('tone-game-feedback');
  const optButtons = document.querySelectorAll('.game-opt-btn');

  // Khóa tất cả nút
  optButtons.forEach(btn => btn.disabled = true);

  if (userTone === correctTone) {
    element.classList.add('correct');
    if (feedback) {
      feedback.innerHTML = '<span style="color:#10b981;">🎉 Chính xác! Bạn đã tai thính rồi đấy! (+5 XP)</span>';
    }
    gainXP(5);
  } else {
    element.classList.add('wrong');
    // Highlight đáp án đúng
    optButtons.forEach(btn => {
      if (parseInt(btn.getAttribute('data-tone')) === correctTone) {
        btn.classList.add('correct');
      }
    });
    if (feedback) {
      feedback.innerHTML = `<span style="color:#ef4444;">❌ Chưa đúng rồi! Đáp án đúng phải là Thanh ${correctTone}.</span>`;
    }
  }
}

// Phát âm thanh từ link URL
function playAudio(url, elementToAnimate = null) {
  if (!url) return;
  
  if (elementToAnimate) {
    elementToAnimate.classList.add('playing');
  }

  const audio = new Audio(url);
  audio.play()
    .then(() => {
      audio.onended = () => {
        if (elementToAnimate) elementToAnimate.classList.remove('playing');
      };
    })
    .catch(err => {
      console.warn("⚠️ Không thể phát âm thanh:", err);
      // Fallback dùng TTS Web Speech Synthesis nếu Youdao lỗi
      const textToSpeak = url.split("audio=")[1]?.split("&")[0];
      if (textToSpeak) {
        const decodedText = decodeURIComponent(textToSpeak);
        speakChineseTTS(decodedText);
      }
      if (elementToAnimate) elementToAnimate.classList.remove('playing');
    });
}

// Phát âm chuẩn TTS trình duyệt nếu link API âm thanh bị chặn
function speakChineseTTS(text) {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'zh-CN'; // Tiếng Trung
    window.speechSynthesis.speak(utterance);
  }
}

// ==========================================================================
// C. MODULE: VOCABULARY FLASHCARDS (3D FLIP CONTAINER)
// ==========================================================================
function renderVocabTopicSelector() {
  const select = document.getElementById('vocab-topic-select');
  if (!select) return;
  select.innerHTML = '';

  VOCABULARY_DATA.forEach(topic => {
    const opt = document.createElement('option');
    opt.value = topic.topicId;
    opt.innerText = topic.topicName;
    if (topic.topicId === state.activeTopicId) {
      opt.selected = true;
    }
    select.appendChild(opt);
  });
}

function renderFlashcard() {
  const topic = VOCABULARY_DATA.find(t => t.topicId === state.activeTopicId);
  if (!topic) return;

  const word = topic.words[state.activeVocabIndex];
  if (!word) return;

  // Render text
  document.getElementById('card-hanzi').innerText = word.hanzi;
  document.getElementById('card-pinyin').innerText = word.pinyin;
  document.getElementById('card-hanviet').innerText = word.hanviet;
  document.getElementById('card-meaning').innerText = word.meaning;
  document.getElementById('card-example-hz').innerText = word.example;
  document.getElementById('card-example-py').innerText = word.examplePinyin;
  document.getElementById('card-example-vi').innerText = word.exampleMeaning;
  
  // Update index display
  document.getElementById('card-index-display').innerText = `${state.activeVocabIndex + 1} / ${topic.words.length}`;

  // Đảm bảo card không bị lật khi chuyển từ mới
  const cardBox = document.getElementById('flashcard-box');
  cardBox.classList.remove('flipped');
  state.cardFlipped = false;

  // Lắng nghe nút Nghe Audio từ vựng
  const audioBtn = document.getElementById('card-audio-btn');
  audioBtn.onclick = (e) => {
    e.stopPropagation(); // Không cho lật thẻ
    playAudio(word.soundUrl, audioBtn);
  };

  // Cập nhật trạng thái Yêu thích & Học thuộc
  const favBtn = document.getElementById('card-favorite-toggle');
  const isFav = state.progress.favoriteWords.includes(word.id);
  if (isFav) {
    favBtn.classList.add('active');
  } else {
    favBtn.classList.remove('active');
  }

  const learnedBtn = document.getElementById('card-learned-toggle');
  const learnedText = document.getElementById('card-learned-text');
  const isLearned = state.progress.learnedWords.includes(word.id);
  
  if (isLearned) {
    learnedBtn.classList.add('learned');
    learnedText.innerText = 'Đã thuộc từ vựng này';
  } else {
    learnedBtn.classList.remove('learned');
    learnedText.innerText = 'Đánh dấu đã thuộc từ này';
  }

  // Cập nhật đếm thống kê chung
  updateVocabStatsCount();
}

function updateVocabStatsCount() {
  let totalLearned = state.progress.learnedWords.length;
  let totalWords = 0;
  VOCABULARY_DATA.forEach(t => totalWords += t.words.length);

  const learnedCountEl = document.getElementById('vocab-learned-count');
  const favCountEl = document.getElementById('vocab-favorite-count');
  
  if (learnedCountEl) learnedCountEl.innerText = `${totalLearned} / ${totalWords}`;
  if (favCountEl) favCountEl.innerText = state.progress.favoriteWords.length;
}

// Bấm Yêu thích
async function toggleWordFavorite() {
  const topic = VOCABULARY_DATA.find(t => t.topicId === state.activeTopicId);
  const word = topic.words[state.activeVocabIndex];
  
  const index = state.progress.favoriteWords.indexOf(word.id);
  if (index > -1) {
    state.progress.favoriteWords.splice(index, 1);
  } else {
    state.progress.favoriteWords.push(word.id);
  }

  renderFlashcard();

  if (state.user) {
    await firebaseService.saveUserData(state.user.uid, state.progress);
  } else {
    localStorage.setItem('progress_local_guest', JSON.stringify(state.progress));
  }
}

// Bấm Học Thuộc
async function toggleWordLearned() {
  const topic = VOCABULARY_DATA.find(t => t.topicId === state.activeTopicId);
  const word = topic.words[state.activeVocabIndex];
  
  const index = state.progress.learnedWords.indexOf(word.id);
  let xpGained = 0;

  if (index > -1) {
    state.progress.learnedWords.splice(index, 1);
  } else {
    state.progress.learnedWords.push(word.id);
    xpGained = 10; // Thưởng 10 XP khi thuộc từ mới
  }

  renderFlashcard();
  
  // Tự động mở khóa chặng tiếp theo nếu học hết từ chặng trước
  checkAndUnlockNextRoadmapNode();

  if (xpGained > 0) {
    await gainXP(xpGained);
  } else {
    if (state.user) {
      await firebaseService.saveUserData(state.user.uid, state.progress);
    } else {
      localStorage.setItem('progress_local_guest', JSON.stringify(state.progress));
    }
  }
}

// Kiểm tra mở khóa chương mới
function checkAndUnlockNextRoadmapNode() {
  const currentTopicIndex = VOCABULARY_DATA.findIndex(t => t.topicId === state.activeTopicId);
  const currentTopic = VOCABULARY_DATA[currentTopicIndex];

  // Kiểm tra học viên học hết từ thuộc topic hiện tại chưa
  const hasLearnedAll = currentTopic.words.every(w => state.progress.learnedWords.includes(w.id));
  
  if (hasLearnedAll && currentTopicIndex < VOCABULARY_DATA.length - 1) {
    const nextTopic = VOCABULARY_DATA[currentTopicIndex + 1];
    if (!state.progress.unlockedLessons.includes(nextTopic.topicId)) {
      state.progress.unlockedLessons.push(nextTopic.topicId);
      triggerConfetti();
      alert(`🎉 Tuyệt vời! Bạn đã học thuộc toàn bộ từ vựng chặng này. Chặng mới "${nextTopic.topicName}" đã được mở khóa!`);
    }
  }
}

// ==========================================================================
// D. MODULE: HANZI WRITING LAB (CANVAS & SVG STROKE PATTERNS)
// ==========================================================================
function renderHanziLab() {
  // 1. Render danh sách chữ chọn để tập viết
  const selectionGrid = document.getElementById('hanzi-selection-grid');
  if (selectionGrid) {
    selectionGrid.innerHTML = '';
    HANZI_WRITING_DATA.forEach((hz, idx) => {
      const btn = document.createElement('button');
      btn.className = `hanzi-select-btn ${idx === state.activeHanziIndex ? 'active' : ''}`;
      btn.innerHTML = `
        ${hz.character}
        <span class="py-label">${hz.pinyin}</span>
      `;
      btn.addEventListener('click', () => {
        state.activeHanziIndex = idx;
        renderHanziLab();
      });
      selectionGrid.appendChild(btn);
    });
  }

  // 2. Render 8 nét cơ bản
  const strokesInfo = document.getElementById('basic-strokes-info-list');
  if (strokesInfo) {
    strokesInfo.innerHTML = '';
    STROKES_BASIC.forEach(str => {
      const div = document.createElement('div');
      div.className = 'glass-card';
      div.style.padding = '0.75rem';
      div.innerHTML = `
        <div style="display:flex; justify-content:space-between; font-weight:700;">
          <span style="color:var(--color-primary);">${str.name}</span>
          <span style="font-family:var(--font-chinese); font-size:1.1rem; color:var(--color-secondary);">${str.symbol}</span>
        </div>
        <p style="color:var(--text-muted); font-size:0.75rem; margin-top:0.25rem;">HD: ${str.desc} (Ví dụ: ${str.example})</p>
      `;
      strokesInfo.appendChild(div);
    });
  }

  // 3. Setup chữ đang chọn tập viết
  const currentHz = HANZI_WRITING_DATA[state.activeHanziIndex];
  if (!currentHz) return;

  document.getElementById('hanzi-meaning-guide').innerHTML = `
    Chữ mẫu: <strong style="font-family:var(--font-chinese); font-size:1.3rem; color:var(--text-main);">${currentHz.character}</strong> (${currentHz.pinyin}) — ${currentHz.meaning}
  `;
  document.getElementById('hanzi-canvas-guide').innerText = currentHz.canvasGuide;

  // 4. Render nét mẫu SVG và chạy hoạt ảnh nét vẽ
  animateHanziStrokes(currentHz);

  // 5. Khởi tạo Bảng vẽ Canvas
  initWritingCanvas();
}

// Chạy hoạt ảnh thứ tự nét viết chữ Hán bằng SVG
function animateHanziStrokes(hzObj) {
  const animatedSvg = document.getElementById('stroke-animated-svg');
  if (!animatedSvg) return;
  animatedSvg.innerHTML = '';

  // Đổ nét vào SVG làm hướng dẫn
  hzObj.strokes.forEach((strokePath, index) => {
    // 1. Nét mờ nền phía dưới
    const pathBg = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    pathBg.setAttribute('d', strokePath);
    pathBg.setAttribute('class', 'stroke-svg-path');
    animatedSvg.appendChild(pathBg);
    
    // 2. Nét vẽ động chạy đè phía trên
    const pathFg = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    pathFg.setAttribute('d', strokePath);
    pathFg.setAttribute('class', 'stroke-svg-path animate');
    pathFg.setAttribute('id', `stroke-animated-path-${index}`);
    
    // Dùng CSS animation delay để vẽ các nét lần lượt
    pathFg.style.animation = `drawStroke 1s ease forwards`;
    pathFg.style.animationDelay = `${index * 1.1}s`;
    
    animatedSvg.appendChild(pathFg);
  });

  // Chèn CSS @keyframes động cho hoạt ảnh vẽ
  let styleSheet = document.getElementById('svg-animation-keyframes');
  if (!styleSheet) {
    styleSheet = document.createElement('style');
    styleSheet.id = 'svg-animation-keyframes';
    document.head.appendChild(styleSheet);
  }
  styleSheet.innerHTML = `
    @keyframes drawStroke {
      to {
        stroke-dashoffset: 0;
      }
    }
  `;
}

// Khởi tạo Canvas vẽ nháp
function initWritingCanvas() {
  const canvas = document.getElementById('hanzi-sketchpad');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  state.canvasContext = ctx;

  // Reset Canvas sạch sẽ
  clearWritingCanvas();

  // Mouse Events
  canvas.addEventListener('mousedown', startDrawing);
  canvas.addEventListener('mousemove', drawStroke);
  canvas.addEventListener('mouseup', stopDrawing);
  canvas.addEventListener('mouseleave', stopDrawing);

  // Touch Events (Hỗ trợ viết trên Smartphone cực mượt)
  canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent('mousedown', {
      clientX: touch.clientX,
      clientY: touch.clientY
    });
    canvas.dispatchEvent(mouseEvent);
  });

  canvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent('mousemove', {
      clientX: touch.clientX,
      clientY: touch.clientY
    });
    canvas.dispatchEvent(mouseEvent);
  });

  canvas.addEventListener('touchend', (e) => {
    e.preventDefault();
    const mouseEvent = new MouseEvent('mouseup', {});
    canvas.dispatchEvent(mouseEvent);
  });
}

function startDrawing(e) {
  state.isDrawing = true;
  const canvas = e.target;
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;

  const x = (e.clientX - rect.left) * scaleX;
  const y = (e.clientY - rect.top) * scaleY;

  const ctx = state.canvasContext;
  ctx.beginPath();
  ctx.moveTo(x, y);
  
  // Style nét bút phát sáng (Neon style cực WOW)
  ctx.lineWidth = 10;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  
  const isLightTheme = document.documentElement.getAttribute('data-theme') === 'light';
  ctx.strokeStyle = isLightTheme ? '#0f766e' : '#14b8a6'; // Teal phát sáng
  ctx.shadowColor = 'rgba(20, 184, 166, 0.4)';
  ctx.shadowBlur = 4;
}

function drawStroke(e) {
  if (!state.isDrawing) return;
  const canvas = e.target;
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;

  const x = (e.clientX - rect.left) * scaleX;
  const y = (e.clientY - rect.top) * scaleY;

  const ctx = state.canvasContext;
  ctx.lineTo(x, y);
  ctx.stroke();
}

function stopDrawing() {
  state.isDrawing = false;
}

function clearWritingCanvas() {
  const canvas = document.getElementById('hanzi-sketchpad');
  if (!canvas || !state.canvasContext) return;
  state.canvasContext.clearRect(0, 0, canvas.width, canvas.height);
}

// Xác nhận hoàn thành tập viết chữ Hán
async function submitWritingProgress() {
  // Hiệu ứng pháo hoa ăn mừng khi viết xong
  triggerConfetti();
  alert("🎉 Thật xuất sắc! Bút lực phi phàm, nét viết rất chuẩn. (+10 XP)");
  
  // Cộng thưởng 10 XP
  await gainXP(10);
  clearWritingCanvas();
}

// ==========================================================================
// E. MODULE: QUIZ ARENA (ĐẤU TRƯỜNG TRẮC NGHIỆM)
// ==========================================================================
function startQuiz() {
  state.quizActive = true;
  state.quizCurrentQuestionIndex = 0;
  state.quizAnswers = [];
  state.quizSelectedOption = null;
  state.quizFinished = false;

  document.getElementById('quiz-welcome-panel').style.display = 'none';
  document.getElementById('quiz-result-panel').classList.remove('active');
  document.getElementById('quiz-play-panel').classList.add('active');

  loadQuizQuestion();
}

function loadQuizQuestion() {
  const question = QUIZ_QUESTIONS[state.quizCurrentQuestionIndex];
  if (!question) return;

  // Cập nhật số thứ tự câu hỏi
  document.getElementById('quiz-question-index').innerText = `Câu hỏi: ${state.quizCurrentQuestionIndex + 1} / ${QUIZ_QUESTIONS.length}`;

  // Cập nhật thanh tiến độ
  const progressPercent = ((state.quizCurrentQuestionIndex) / QUIZ_QUESTIONS.length) * 100;
  document.getElementById('quiz-progress-fill-bar').style.width = `${progressPercent}%`;

  // Render câu hỏi
  document.getElementById('quiz-question-text').innerText = question.question;

  // Setup dạng câu hỏi nghe phát âm
  const listeningBox = document.getElementById('quiz-listening-box');
  if (question.type === 'listening-quiz' && question.soundUrl) {
    listeningBox.style.display = 'flex';
    // Đăng ký nghe âm thanh
    document.getElementById('quiz-audio-play-btn').onclick = () => playAudio(question.soundUrl);
    // Tự động phát âm thanh đầu tiên cho người nghe
    playAudio(question.soundUrl);
  } else {
    listeningBox.style.display = 'none';
  }

  // Render các phương án lựa chọn
  const answersList = document.getElementById('quiz-answers-list');
  answersList.innerHTML = '';
  state.quizSelectedOption = null;

  // Khóa nút "Tiếp tục" lúc đầu
  const nextBtn = document.getElementById('quiz-next-btn');
  nextBtn.disabled = true;
  nextBtn.innerText = 'Xác nhận lựa chọn';

  // Ẩn giải thích
  document.getElementById('quiz-explain-card').classList.remove('active');

  question.options.forEach((opt, idx) => {
    const card = document.createElement('div');
    card.className = 'quiz-option-card';
    card.setAttribute('data-option', opt);
    card.innerHTML = `
      <span>${idx + 1}. ${opt}</span>
      <div class="option-indicator"></div>
    `;

    card.addEventListener('click', () => {
      if (nextBtn.innerText === 'Câu tiếp theo' || nextBtn.innerText === 'Hoàn thành bài thi') return; // Đã submit không cho chọn lại
      
      // Bỏ select các thẻ cũ
      document.querySelectorAll('.quiz-option-card').forEach(el => el.classList.remove('selected'));
      card.classList.add('selected');
      state.quizSelectedOption = opt;
      nextBtn.disabled = false;
    });

    answersList.appendChild(card);
  });
}

// Bấm nút Check/Next của Quiz
function handleQuizNextSubmit() {
  const nextBtn = document.getElementById('quiz-next-btn');
  const question = QUIZ_QUESTIONS[state.quizCurrentQuestionIndex];

  if (nextBtn.innerText === 'Xác nhận lựa chọn') {
    const userOption = state.quizSelectedOption;
    if (!userOption) return;

    const isCorrect = userOption === question.answer;
    state.quizAnswers.push(isCorrect);

    // Hiển thị trực quan Đáp án đúng/sai
    document.querySelectorAll('.quiz-option-card').forEach(card => {
      const opt = card.getAttribute('data-option');
      card.classList.remove('selected');
      if (opt === question.answer) {
        card.classList.add('correct');
      } else if (opt === userOption) {
        card.classList.add('wrong');
      }
    });

    // Phát âm thanh phụ vui vẻ
    if (isCorrect) {
      triggerConfetti();
    }

    // Hiển thị giải thích
    const explainCard = document.getElementById('quiz-explain-card');
    const explainText = document.getElementById('quiz-explain-text');
    if (explainCard && explainText) {
      explainText.innerText = question.explanation;
      explainCard.classList.add('active');
    }

    // Chuyển nút hành động
    if (state.quizCurrentQuestionIndex === QUIZ_QUESTIONS.length - 1) {
      nextBtn.innerText = 'Hoàn thành bài thi';
    } else {
      nextBtn.innerText = 'Câu tiếp theo';
    }
  } else {
    // Chuyển sang câu hỏi tiếp theo
    state.quizCurrentQuestionIndex += 1;
    
    if (state.quizCurrentQuestionIndex >= QUIZ_QUESTIONS.length) {
      finishQuiz();
    } else {
      loadQuizQuestion();
    }
  }
}

// Hoàn thành thi trắc nghiệm
async function finishQuiz() {
  state.quizActive = false;
  state.quizFinished = true;

  document.getElementById('quiz-play-panel').classList.remove('active');
  document.getElementById('quiz-result-panel').classList.add('active');

  const totalQuestions = QUIZ_QUESTIONS.length;
  const correctCount = state.quizAnswers.filter(a => a === true).length;
  
  // Render kết quả điểm
  document.getElementById('quiz-result-score').innerText = `${correctCount} / ${totalQuestions}`;

  // Phần thưởng nếu đạt điểm tốt
  const xpReward = 15;
  document.getElementById('quiz-result-xp-gain').innerText = `+${xpReward} XP Thưởng hoàn thành!`;
  
  triggerConfetti();

  // Lưu lịch sử Quiz của người dùng
  state.progress.quizHistory.push({
    date: new Date().toISOString(),
    score: correctCount,
    total: totalQuestions
  });

  await gainXP(xpReward);
}

function resetQuizUI() {
  document.getElementById('quiz-welcome-panel').style.display = 'block';
  document.getElementById('quiz-play-panel').classList.remove('active');
  document.getElementById('quiz-result-panel').classList.remove('active');
}

// ==========================================================================
// F. MODULE: SETTINGS (FIREBASE & LOCAL BACKUP HANDLERS)
// ==========================================================================
function updateFirebaseSettingsForm() {
  const dbStatus = document.getElementById('db-status-badge');
  const apiKeyInput = document.getElementById('fb-apiKey');
  const authDomainInput = document.getElementById('fb-authDomain');
  const projectIdInput = document.getElementById('fb-projectId');
  const appIdInput = document.getElementById('fb-appId');
  const storageBucketInput = document.getElementById('fb-storageBucket');

  const beforeActions = document.getElementById('fb-form-actions-before');
  const afterActions = document.getElementById('fb-form-actions-after');

  if (firebaseService.isConfigured) {
    dbStatus.className = 'sync-status-badge online';
    dbStatus.innerHTML = '<i data-lucide="cloud"></i> <span>Chế độ: Đám mây thời gian thực (Firebase)</span>';
    
    // Điền sẵn dữ liệu và disable
    const stored = JSON.parse(localStorage.getItem('chinese_learning_firebase_config') || '{}');
    apiKeyInput.value = stored.apiKey || '•••••••••••••••••••••';
    authDomainInput.value = stored.authDomain || '';
    projectIdInput.value = stored.projectId || '';
    appIdInput.value = stored.appId || '';
    storageBucketInput.value = stored.storageBucket || '';

    apiKeyInput.disabled = true;
    authDomainInput.disabled = true;
    projectIdInput.disabled = true;
    appIdInput.disabled = true;
    storageBucketInput.disabled = true;

    beforeActions.style.display = 'none';
    afterActions.style.display = 'flex';
  } else {
    dbStatus.className = 'sync-status-badge offline';
    dbStatus.innerHTML = '<i data-lucide="cloud-off"></i> <span>Chế độ: Lưu trữ trình duyệt (LocalStorage)</span>';

    apiKeyInput.disabled = false;
    authDomainInput.disabled = false;
    projectIdInput.disabled = false;
    appIdInput.disabled = false;
    storageBucketInput.disabled = false;

    // Reset rỗng
    apiKeyInput.value = '';
    authDomainInput.value = '';
    projectIdInput.value = '';
    appIdInput.value = '';
    storageBucketInput.value = '';

    beforeActions.style.display = 'flex';
    afterActions.style.display = 'none';
  }

  initLucideIcons();
}

async function handleFirebaseConfigSubmit(e) {
  e.preventDefault();
  
  const config = {
    apiKey: document.getElementById('fb-apiKey').value,
    authDomain: document.getElementById('fb-authDomain').value,
    projectId: document.getElementById('fb-projectId').value,
    appId: document.getElementById('fb-appId').value,
    storageBucket: document.getElementById('fb-storageBucket').value || undefined
  };

  const result = firebaseService.connectCustomConfig(config);
  if (result.success) {
    alert("🔥 Kết nối Firebase cực kì thành công! Bạn hãy Đăng nhập/Đăng ký để đồng bộ dữ liệu ngay lập tức.");
    updateFirebaseSettingsForm();
    showAuthModal();
  } else {
    alert(`❌ Kết nối thất bại: ${result.error}`);
  }
}

function handleFirebaseDisconnect() {
  if (confirm("🔌 Bạn có chắc chắn muốn ngắt kết nối với đám mây Firebase? Ứng dụng sẽ quay trở lại lưu trữ tại LocalStorage cục bộ.")) {
    firebaseService.disconnectConfig();
    updateFirebaseSettingsForm();
    location.reload(); // Reload để làm sạch state Auth cũ hoàn toàn
  }
}

// Sao lưu Xuất tiến trình ra JSON
function exportLocalBackup() {
  const filename = `chinese_learning_backup_${Date.now()}.json`;
  const jsonStr = JSON.stringify(state.progress, null, 2);
  
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Phục hồi Nhập tiến trình từ file JSON
function importLocalBackup() {
  const fileInput = document.getElementById('backup-file-input');
  if (fileInput) fileInput.click();
}

function handleBackupFileChange(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = async (event) => {
    try {
      const parsedData = JSON.parse(event.target.result);
      if (parsedData && (parsedData.xp !== undefined || parsedData.learnedWords)) {
        state.progress = parsedData;
        
        // Lưu
        if (state.user) {
          await firebaseService.saveUserData(state.user.uid, state.progress);
        } else {
          localStorage.setItem('progress_local_guest', JSON.stringify(state.progress));
        }

        updateStatsUI();
        renderDashboardRoadmap();
        alert("🎉 Khôi phục dữ liệu tiến trình học tập của bạn hoàn tất thành công!");
        switchTab('dashboard');
      } else {
        alert("❌ Định dạng tệp sao lưu JSON không hợp lệ.");
      }
    } catch (err) {
      alert("❌ Lỗi khi đọc và khôi phục dữ liệu tệp sao lưu.");
    }
  };
  reader.readAsText(file);
}

// ==========================================================================
// G. HỆ THỐNG XÁC THỰC AUTH MODALS HANDLERS
// ==========================================================================
function showAuthModal(tab = 'login') {
  const overlay = document.getElementById('auth-modal-box');
  overlay.classList.add('active');
  switchAuthTab(tab);
}

function hideAuthModal() {
  document.getElementById('auth-modal-box').classList.remove('active');
  // Reset các ô nhập và lỗi
  document.getElementById('auth-error-box').style.display = 'none';
  document.getElementById('auth-login-form').reset();
  document.getElementById('auth-register-form').reset();
}

function switchAuthTab(tab) {
  const loginTab = document.getElementById('auth-tab-login');
  const registerTab = document.getElementById('auth-tab-register');
  const loginForm = document.getElementById('auth-login-form-container');
  const registerForm = document.getElementById('auth-register-form-container');

  if (tab === 'login') {
    loginTab.classList.add('active');
    registerTab.classList.remove('active');
    loginForm.classList.add('active');
    registerForm.classList.remove('active');
  } else {
    loginTab.classList.remove('active');
    registerTab.classList.add('active');
    loginForm.classList.remove('active');
    registerForm.classList.add('active');
  }
}

// Cập nhật giao diện khi Đăng nhập/Đăng xuất
function updateUIForAuth(user) {
  const avatar = document.getElementById('sidebar-avatar');
  const username = document.getElementById('sidebar-username');
  const status = document.getElementById('sidebar-status');
  const title = document.getElementById('header-title');

  if (user) {
    const initial = (user.displayName || user.email || 'H').charAt(0).toUpperCase();
    avatar.innerText = initial;
    username.innerText = user.displayName || user.email.split('@')[0];
    status.innerText = firebaseService.isConfigured ? 'Đang đồng bộ Đám mây' : 'Chạy Cục bộ';
    status.style.color = 'var(--color-primary)';
    
    if (state.currentTab === 'dashboard') {
      title.innerText = `Chào mừng quay trở lại, ${user.displayName || 'Học viên'}!`;
    }
  } else {
    avatar.innerText = 'G';
    username.innerText = 'Khách ẩn danh';
    status.innerText = 'Bấm để đăng nhập';
    status.style.color = 'var(--text-muted)';
    
    if (state.currentTab === 'dashboard') {
      title.innerText = 'Chào mừng, Học viên!';
    }
  }
}

// Thực hiện gửi đăng ký Auth
async function handleAuthRegisterSubmit(e) {
  e.preventDefault();
  
  const name = document.getElementById('register-name').value;
  const email = document.getElementById('register-email').value;
  const pass = document.getElementById('register-password').value;
  const errBox = document.getElementById('auth-error-box');

  errBox.style.display = 'none';

  const res = await firebaseService.register(email, pass, name);
  if (res.success) {
    triggerConfetti();
    hideAuthModal();
    alert(`🎉 Đăng ký thành công! Chào mừng học viên ${name} đến với Chinese Learning Hub.`);
  } else {
    errBox.innerText = res.error;
    errBox.style.display = 'block';
  }
}

// Thực hiện gửi đăng nhập Auth
async function handleAuthLoginSubmit(e) {
  e.preventDefault();
  
  const email = document.getElementById('login-email').value;
  const pass = document.getElementById('login-password').value;
  const errBox = document.getElementById('auth-error-box');

  errBox.style.display = 'none';

  const res = await firebaseService.login(email, pass);
  if (res.success) {
    hideAuthModal();
  } else {
    errBox.innerText = res.error;
    errBox.style.display = 'block';
  }
}

// Đăng nhập Google
async function handleGoogleLoginClick() {
  const errBox = document.getElementById('auth-error-box');
  errBox.style.display = 'none';

  const res = await firebaseService.loginWithGoogle();
  if (res.success) {
    hideAuthModal();
  } else {
    errBox.innerText = res.error;
    errBox.style.display = 'block';
  }
}

// ==========================================================================
// RÀNG BUỘC SỰ KIỆN (EVENT BINDINGS)
// ==========================================================================
function bindEvents() {
  // Theme Toggle Button
  document.getElementById('theme-toggle-btn').addEventListener('click', toggleTheme);

  // Profile Card click -> trigger login/logout
  document.getElementById('sidebar-profile-card').addEventListener('click', () => {
    if (state.user) {
      if (confirm(`🔌 Bạn đang đăng nhập bằng tài khoản: ${state.user.displayName || state.user.email}. Bạn có muốn đăng xuất?`)) {
        firebaseService.logout();
      }
    } else {
      showAuthModal('login');
    }
  });

  // Auth Modals Tabs & buttons
  document.getElementById('auth-close-btn').addEventListener('click', hideAuthModal);
  document.getElementById('auth-tab-login').addEventListener('click', () => switchAuthTab('login'));
  document.getElementById('auth-tab-register').addEventListener('click', () => switchAuthTab('register'));
  
  // Gửi Form Auth
  document.getElementById('auth-login-form').addEventListener('submit', handleAuthLoginSubmit);
  document.getElementById('auth-register-form').addEventListener('submit', handleAuthRegisterSubmit);
  document.getElementById('auth-google-btn').addEventListener('click', handleGoogleLoginClick);

  // Settings: Firebase Config Form
  document.getElementById('firebase-config-form').addEventListener('submit', handleFirebaseConfigSubmit);
  document.getElementById('fb-disconnect-btn').addEventListener('click', handleFirebaseDisconnect);

  // Backup data
  document.getElementById('backup-export-btn').addEventListener('click', exportLocalBackup);
  document.getElementById('backup-import-btn').addEventListener('click', importLocalBackup);
  document.getElementById('backup-file-input').addEventListener('change', handleBackupFileChange);

  // Pinyin Tab switching
  document.getElementById('btn-tab-initials').addEventListener('click', (e) => {
    document.querySelectorAll('.pinyin-tab-btn').forEach(btn => btn.classList.remove('active'));
    e.target.classList.add('active');
    state.activePinyinType = 'initials';
    renderPinyinGrid();
  });

  document.getElementById('btn-tab-finals').addEventListener('click', (e) => {
    document.querySelectorAll('.pinyin-tab-btn').forEach(btn => btn.classList.remove('active'));
    e.target.classList.add('active');
    state.activePinyinType = 'finals';
    renderPinyinGrid();
  });

  document.getElementById('btn-tab-tones').addEventListener('click', (e) => {
    document.querySelectorAll('.pinyin-tab-btn').forEach(btn => btn.classList.remove('active'));
    e.target.classList.add('active');
    state.activePinyinType = 'tones';
    renderPinyinGrid();
  });

  // Luyện tai nghe Pinyin Game listeners
  document.getElementById('tone-game-play-btn').addEventListener('click', playToneGameQuestion);
  document.querySelectorAll('.game-opt-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const tone = parseInt(btn.getAttribute('data-tone'));
      handleToneGameGuess(e.target, tone);
    });
  });

  // Flashcards UI Listeners
  const cardBox = document.getElementById('flashcard-box');
  cardBox.addEventListener('click', () => {
    cardBox.classList.toggle('flipped');
    state.cardFlipped = !state.cardFlipped;
  });

  document.getElementById('card-favorite-toggle').addEventListener('click', (e) => {
    e.stopPropagation();
    toggleWordFavorite();
  });

  document.getElementById('card-learned-toggle').addEventListener('click', (e) => {
    e.stopPropagation();
    toggleWordLearned();
  });

  document.getElementById('card-prev-btn').addEventListener('click', (e) => {
    e.stopPropagation();
    const topic = VOCABULARY_DATA.find(t => t.topicId === state.activeTopicId);
    if (state.activeVocabIndex > 0) {
      state.activeVocabIndex -= 1;
    } else {
      state.activeVocabIndex = topic.words.length - 1;
    }
    renderFlashcard();
  });

  document.getElementById('card-next-btn').addEventListener('click', (e) => {
    e.stopPropagation();
    const topic = VOCABULARY_DATA.find(t => t.topicId === state.activeTopicId);
    if (state.activeVocabIndex < topic.words.length - 1) {
      state.activeVocabIndex += 1;
    } else {
      state.activeVocabIndex = 0;
    }
    renderFlashcard();
  });

  document.getElementById('vocab-topic-select').addEventListener('change', (e) => {
    state.activeTopicId = e.target.value;
    state.activeVocabIndex = 0;
    renderFlashcard();
  });

  // Hanzi Write Listeners
  document.getElementById('hanzi-play-stroke').addEventListener('click', () => {
    const currentHz = HANZI_WRITING_DATA[state.activeHanziIndex];
    animateHanziStrokes(currentHz);
  });

  document.getElementById('hanzi-clear-canvas').addEventListener('click', clearWritingCanvas);
  document.getElementById('hanzi-submit-writing').addEventListener('click', submitWritingProgress);

  // Quiz Arena listeners
  document.getElementById('quiz-start-btn').addEventListener('click', startQuiz);
  document.getElementById('quiz-next-btn').addEventListener('click', handleQuizNextSubmit);
  document.getElementById('quiz-retry-btn').addEventListener('click', startQuiz);
  document.getElementById('quiz-finish-home-btn').addEventListener('click', () => {
    resetQuizUI();
    switchTab('dashboard');
  });
}
