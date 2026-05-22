import { initializeApp, getApps, getApp } from "firebase/app";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged, 
  GoogleAuthProvider, 
  signInWithPopup,
  updateProfile
} from "firebase/auth";
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc,
  enableIndexedDbPersistence
} from "firebase/firestore";

class FirebaseService {
  constructor() {
    this.app = null;
    this.auth = null;
    this.db = null;
    this.isConfigured = false;
    this.user = null;
    this.onAuthStateChangedCallback = null;

    // Khởi động
    this.init();
  }

  // Khởi tạo Firebase động
  init() {
    try {
      const storedConfig = localStorage.getItem("chinese_learning_firebase_config");
      if (storedConfig) {
        const config = JSON.parse(storedConfig);
        if (config && config.apiKey && config.projectId) {
          // Initialize App
          if (getApps().length === 0) {
            this.app = initializeApp(config);
          } else {
            this.app = getApp();
          }
          this.auth = getAuth(this.app);
          this.db = getFirestore(this.app);
          this.isConfigured = true;

          // Thiết lập lắng nghe thay đổi Auth
          onAuthStateChanged(this.auth, async (firebaseUser) => {
            this.user = firebaseUser;
            if (this.onAuthStateChangedCallback) {
              this.onAuthStateChangedCallback(firebaseUser);
            }
          });
          
          console.log("🔥 Firebase đã được khởi tạo thành công từ cấu hình đã lưu!");
          return true;
        }
      }
    } catch (error) {
      console.warn("⚠️ Lỗi cấu hình Firebase hoặc chưa có cấu hình:", error);
    }
    
    // Nếu chưa cấu hình, thiết lập trạng thái offline
    this.isConfigured = false;
    this.app = null;
    this.auth = null;
    this.db = null;
    this.user = null;
    console.log("📴 Chạy ứng dụng ở chế độ Offline (Dữ liệu lưu tại LocalStorage)");
    return false;
  }

  // Kết nối cấu hình mới
  connectCustomConfig(config) {
    try {
      // Validate đơn giản
      if (!config.apiKey || !config.authDomain || !config.projectId || !config.appId) {
        throw new Error("Thông tin cấu hình Firebase thiếu các trường bắt buộc.");
      }

      localStorage.setItem("chinese_learning_firebase_config", JSON.stringify(config));
      
      // Reset app nếu đã tồn tại
      const initialized = this.init();
      if (!initialized) {
        throw new Error("Thông số cấu hình không hợp lệ.");
      }
      return { success: true };
    } catch (error) {
      console.error("❌ Lỗi cấu hình Firebase:", error);
      return { success: false, error: error.message };
    }
  }

  // Ngắt kết nối Firebase
  disconnectConfig() {
    localStorage.removeItem("chinese_learning_firebase_config");
    if (this.auth) {
      signOut(this.auth).catch(() => {});
    }
    this.app = null;
    this.auth = null;
    this.db = null;
    this.user = null;
    this.isConfigured = false;
    console.log("🔌 Đã xóa cấu hình Firebase. Trở về chế độ Local Storage.");
  }

  // Đăng ký tài khoản
  async register(email, password, displayName) {
    if (!this.isConfigured) {
      return this.localRegister(email, password, displayName);
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      await updateProfile(userCredential.user, { displayName });
      this.user = userCredential.user;
      
      // Tạo bản ghi dữ liệu ban đầu trên Firestore
      await this.saveUserData(userCredential.user.uid, this.getDefaultProgress(displayName));
      return { success: true, user: userCredential.user };
    } catch (error) {
      return { success: false, error: this.translateAuthError(error.code) };
    }
  }

  // Đăng nhập tài khoản
  async login(email, password) {
    if (!this.isConfigured) {
      return this.localLogin(email, password);
    }
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      this.user = userCredential.user;
      return { success: true, user: userCredential.user };
    } catch (error) {
      return { success: false, error: this.translateAuthError(error.code) };
    }
  }

  // Đăng nhập Google
  async loginWithGoogle() {
    if (!this.isConfigured) {
      return { success: false, error: "Vui lòng cấu hình Firebase trước khi sử dụng đăng nhập Google." };
    }
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(this.auth, provider);
      this.user = userCredential.user;

      // Kiểm tra xem đã có dữ liệu chưa, nếu chưa tạo mới
      const existingData = await this.getUserData(userCredential.user.uid);
      if (!existingData) {
        await this.saveUserData(userCredential.user.uid, this.getDefaultProgress(userCredential.user.displayName || "Học viên"));
      }
      return { success: true, user: userCredential.user };
    } catch (error) {
      return { success: false, error: this.translateAuthError(error.code) };
    }
  }

  // Đăng xuất
  async logout() {
    if (!this.isConfigured) {
      localStorage.removeItem("chinese_local_current_user");
      if (this.onAuthStateChangedCallback) this.onAuthStateChangedCallback(null);
      return { success: true };
    }
    try {
      await signOut(this.auth);
      this.user = null;
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Đăng ký cục bộ (Local Mode)
  localRegister(email, password, displayName) {
    const users = JSON.parse(localStorage.getItem("chinese_local_users") || "[]");
    if (users.some(u => u.email === email)) {
      return { success: false, error: "Email này đã được đăng ký cục bộ trên trình duyệt." };
    }
    const newUser = { uid: "local_" + Date.now(), email, password, displayName };
    users.push(newUser);
    localStorage.setItem("chinese_local_users", JSON.stringify(users));
    localStorage.setItem("chinese_local_current_user", JSON.stringify(newUser));
    
    // Khởi tạo tiến trình học cục bộ
    const initialProgress = this.getDefaultProgress(displayName);
    localStorage.setItem(`progress_${newUser.uid}`, JSON.stringify(initialProgress));
    
    if (this.onAuthStateChangedCallback) {
      this.onAuthStateChangedCallback(newUser);
    }
    return { success: true, user: newUser };
  }

  // Đăng nhập cục bộ (Local Mode)
  localLogin(email, password) {
    const users = JSON.parse(localStorage.getItem("chinese_local_users") || "[]");
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) {
      return { success: false, error: "Email hoặc mật khẩu không chính xác." };
    }
    localStorage.setItem("chinese_local_current_user", JSON.stringify(user));
    if (this.onAuthStateChangedCallback) {
      this.onAuthStateChangedCallback(user);
    }
    return { success: true, user };
  }

  // Đăng nhập tự động khi load trang ở Local Mode
  autoLoginLocal() {
    if (!this.isConfigured) {
      const currentUser = localStorage.getItem("chinese_local_current_user");
      if (currentUser) {
        const user = JSON.parse(currentUser);
        if (this.onAuthStateChangedCallback) {
          this.onAuthStateChangedCallback(user);
        }
        return user;
      }
    }
    return null;
  }

  // Lấy dữ liệu học tập
  async getUserData(uid) {
    if (!this.isConfigured) {
      const data = localStorage.getItem(`progress_${uid}`);
      return data ? JSON.parse(data) : this.getDefaultProgress("Học viên");
    }
    try {
      const docRef = doc(this.db, "users_progress", uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data();
      }
      return null;
    } catch (error) {
      console.error("Lỗi lấy dữ liệu từ Firestore:", error);
      const localData = localStorage.getItem(`progress_${uid}`);
      return localData ? JSON.parse(localData) : null;
    }
  }

  // Lưu dữ liệu tiến độ học tập
  async saveUserData(uid, data) {
    // Luôn lưu vào LocalStorage làm backup dự phòng
    localStorage.setItem(`progress_${uid}`, JSON.stringify(data));

    if (!this.isConfigured) {
      return { success: true };
    }
    try {
      const docRef = doc(this.db, "users_progress", uid);
      await setDoc(docRef, data, { merge: true });
      return { success: true };
    } catch (error) {
      console.error("Lỗi đồng bộ Firestore:", error);
      return { success: false, error: error.message };
    }
  }

  // Đồng bộ hóa dữ liệu từ Local lên Firestore khi kết nối Firebase thành công
  async syncLocalToCloud(uid) {
    if (!this.isConfigured) return;
    try {
      const localData = localStorage.getItem(`progress_local_guest`) || localStorage.getItem(`progress_${uid}`);
      if (localData) {
        const data = JSON.parse(localData);
        // Cập nhật lại một số trường
        data.lastSynced = new Date().toISOString();
        await this.saveUserData(uid, data);
        console.log("☁️ Dữ liệu local đã được đồng bộ lên đám mây thành công!");
      }
    } catch (error) {
      console.error("Lỗi đồng bộ hóa dữ liệu:", error);
    }
  }

  // Dữ liệu học tập mặc định
  getDefaultProgress(name) {
    return {
      displayName: name,
      xp: 0,
      streak: 0,
      lastActiveDate: null,
      level: 1,
      unlockedLessons: ["greetings"], // Bắt đầu với bài Chào hỏi
      learnedWords: [], // Lưu các id từ đã thuộc
      favoriteWords: [], // Lưu các id từ yêu thích
      quizHistory: [], // Lưu kết quả thi trắc nghiệm
      canvasFavorites: [], // Lưu chữ Hán yêu thích khi viết
      lastSynced: new Date().toISOString()
    };
  }

  // Đăng ký bộ lắng nghe thay đổi Auth từ main.js
  subscribeAuth(callback) {
    this.onAuthStateChangedCallback = callback;
    // Phát sự kiện ban đầu nếu chạy cục bộ
    if (!this.isConfigured) {
      const localUser = this.autoLoginLocal();
      if (localUser) {
        callback(localUser);
      } else {
        callback(null);
      }
    } else if (this.auth && this.auth.currentUser) {
      callback(this.auth.currentUser);
    }
  }

  // Dịch các lỗi Firebase Auth sang tiếng Việt
  translateAuthError(code) {
    switch (code) {
      case "auth/invalid-email":
        return "Địa chỉ email không hợp lệ.";
      case "auth/user-disabled":
        return "Tài khoản này đã bị vô hiệu hóa.";
      case "auth/user-not-found":
        return "Không tìm thấy người dùng này.";
      case "auth/wrong-password":
        return "Mật khẩu không chính xác.";
      case "auth/email-already-in-use":
        return "Email này đã được đăng ký bởi một tài khoản khác.";
      case "auth/weak-password":
        return "Mật khẩu quá yếu (yêu cầu ít nhất 6 ký tự).";
      case "auth/popup-closed-by-user":
        return "Cửa sổ đăng nhập Google đã bị đóng trước khi hoàn tất.";
      default:
        return "Đã xảy ra lỗi hệ thống. Vui lòng thử lại sau.";
    }
  }
}

export const firebaseService = new FirebaseService();
