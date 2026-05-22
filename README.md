# Chinese Learning Hub 🚀 — Nền Tảng Tự Học Tiếng Trung Đỉnh Cao Cho Người Mới

Chào mừng bạn đến với **Chinese Learning Hub**! Đây là một trang web tự học và ôn luyện tiếng Trung trực quan, sinh động dành cho người mới bắt đầu. Ứng dụng được thiết kế theo phong cách giao diện **Glassmorphism cao cấp**, hiện đại, kết hợp với các hiệu ứng tương tác 3D mượt mà để tối ưu trải nghiệm học tập.

Ứng dụng hỗ trợ cơ chế hoạt động **kép (Hybrid Storage)**:
1.  **Chế độ Cục bộ (Local Mode):** Tự động lưu mọi tiến trình học tập của bạn vào `localStorage` của trình duyệt mà không cần cài đặt phức tạp.
2.  **Chế độ Đám mây (Firebase Cloud Sync):** Đồng bộ hóa tiến trình, điểm số, từ vựng và bảng vẽ chữ Hán lên hệ thống đám mây thời gian thực của Google Firebase khi kết nối.

---

## ✨ Các Module Tính Năng Nổi Bật

1.  **Bảng Phát Âm Pinyin Tương Tác:**
    *   Phân loại trực quan: Thanh mẫu (Initials), Vận mẫu (Finals) và Thanh điệu (Tones).
    *   Click vào để nghe phát âm chuẩn bằng âm thanh bản xứ chất lượng cao.
    *   Mini-game "Luyện tai nghe" đoán thanh điệu cực vui nhộn.
2.  **Sổ Tay Từ Vựng Flashcard 3D:**
    *   Từ vựng HSK 1 phân bổ theo 5 chủ đề: Chào hỏi, Gia đình, Số đếm, Ăn uống, Trường học.
    *   Hiệu ứng lật thẻ 3D mượt mà xem nghĩa, ví dụ, Pinyin và phát âm thanh.
    *   Đánh dấu "Từ yêu thích" hoặc "Đã học" để theo dõi sát sao tiến độ.
3.  **Phòng Thực Hành Viết Chữ Hán (Hanzi Stroke Lab):**
    *   Trực quan hóa thứ tự nét viết (Stroke-by-stroke animation) bằng SVG động.
    *   Bảng vẽ Canvas cảm ứng đa điểm hỗ trợ vẽ bằng chuột hoặc vuốt ngón tay trên điện thoại.
    *   Thanh cọ vẽ phát sáng phong cách neon thời thượng.
4.  **Đấu Trường Quiz Trắc Nghiệm:**
    *   Hệ thống câu hỏi ngẫu nhiên: nghe âm thanh đoán chữ, dịch nghĩa từ vựng, sắp xếp từ thành câu đúng ngữ pháp.
    *   Giải thích đáp án chi tiết và hiệu ứng Confetti pháo hoa ăn mừng khi hoàn thành.
5.  **Cài Đặt Đám Mây & Sao Lưu:**
    *   Xuất nhập dữ liệu tiến trình học tập ra file `.json` để sao lưu offline.
    *   Bảng kết nối Firebase cực kỳ trực quan giúp bạn làm chủ 100% dữ liệu cá nhân.

---

## 🛠️ Hướng Dẫn Từng Bước Cho Bạn (Setup & Deploy)

Vì bạn chưa có sẵn dự án Firebase hay kho lưu trữ GitHub, hãy thực hiện theo hướng dẫn cực kỳ chi tiết dưới đây. Tôi đã code sẵn mọi thứ, bạn chỉ cần làm vài click chuột là trang web sẽ chạy online toàn cầu!

### 🌍 BƯỚC 1: Triển Khai Lên GitHub & Kích Hoạt Trang Web Online (Deploy)

Để đưa trang web lên Internet và có đường link công khai (Ví dụ: `https://ten-github.github.io/chinese-learning-hub`), bạn làm như sau:

1.  **Đăng nhập vào GitHub:** Truy cập [github.com](https://github.com/) và đăng nhập tài khoản của bạn.
2.  **Tạo một Repository mới:**
    *   Click nút **New** (hoặc dấu cộng góc trên bên phải -> *New repository*).
    *   Đặt tên kho lưu trữ chính xác là: `chinese-learning-hub`
    *   Chọn chế độ: **Public** (Công khai).
    *   *Không chọn* thêm file README, .gitignore hay License nào hết (để kho trống).
    *   Nhấn **Create repository**.
3.  **Đẩy code lên GitHub:**
    Mở terminal trên máy tính của bạn tại thư mục dự án này và chạy các lệnh sau (hãy thay thế `TÊN_TÀI_KHOẢN_GITHUB` bằng tên đăng nhập thật của bạn):
    ```bash
    # Khởi tạo git local
    git init
    
    # Đổi tên nhánh mặc định thành main
    git branch -M main
    
    # Kết nối kho local với kho GitHub của bạn
    git remote add origin https://github.com/TÊN_TÀI_KHOẢN_GITHUB/chinese-learning-hub.git
    
    # Thêm toàn bộ các file code vào hàng chờ
    git add .
    
    # Cam kết lưu phiên bản đầu tiên
    git commit -m "Khởi tạo dự án Chinese Learning Hub"
    
    # Đẩy mã nguồn lên GitHub
    git push -u origin main
    ```
4.  **Bật tự động xuất bản (GitHub Pages):**
    *   Ngay khi bạn chạy lệnh `git push` ở trên, hệ thống tự động hóa **GitHub Actions** mà tôi đã thiết lập sẵn trong file `.github/workflows/deploy.yml` sẽ tự động biên dịch dự án Vite và đẩy lên nhánh `gh-pages`.
    *   Bạn truy cập kho lưu trữ của mình trên web GitHub, vào phần **Settings** -> **Pages** (cột bên trái).
    *   Ở mục **Build and deployment** -> **Source**, chọn là **Deploy from a branch**.
    *   Ở phần **Branch**, chọn nhánh là `gh-pages` và thư mục là `/ (root)`. Nhấn **Save**.
    *   Đợi khoảng 1-2 phút, bạn F5 tải lại trang sẽ thấy GitHub cung cấp đường link truy cập trang web online toàn cầu của bạn!

---

### 🔥 BƯỚC 2: Thiết Lập Hệ Thống Đám Mây Firebase (Auth & Database)

Để kích hoạt tính năng Đăng nhập và tự động Lưu tiến trình học lên mây, hãy tạo một database Firebase hoàn toàn miễn phí:

1.  **Tạo dự án Firebase:**
    *   Truy cập [Firebase Console](https://console.firebase.google.com/) và đăng nhập bằng tài khoản Google của bạn.
    *   Nhấn **Add project** (Tạo dự án mới).
    *   Đặt tên dự án (Ví dụ: `chinese-learning-hub`) rồi nhấn **Continue** liên tục để hoàn tất (có thể tắt Google Analytics để tạo nhanh hơn).
2.  **Kích hoạt Đăng nhập (Authentication):**
    *   Tại menu trái của Firebase Console, chọn **Build** -> **Authentication**, nhấn **Get Started**.
    *   Tại tab **Sign-in method**, chọn kích hoạt 2 nhà cung cấp:
        *   **Email/Password:** Gạt nút *Enable* rồi nhấn *Save*.
        *   **Google:** Gạt nút *Enable*, chọn email hỗ trợ dự án rồi nhấn *Save*.
3.  **Kích hoạt Cơ sở dữ liệu (Firestore Database):**
    *   Tại menu trái, chọn **Build** -> **Firestore Database**, nhấn **Create database**.
    *   Chọn vị trí lưu trữ máy chủ (Ví dụ: `asia-southeast1` ở Singapore hoặc Đông Nam Á để tốc độ tải cực nhanh). Nhấn **Next**.
    *   Ở bước chọn Rules bảo mật, hãy chọn **Start in test mode** (Chế độ thử nghiệm) để cho phép ứng dụng đọc ghi dữ liệu dễ dàng trong 30 ngày đầu, rồi nhấn **Create**.
4.  **Lấy khóa cấu hình ứng dụng Web (Firebase Web Config):**
    *   Quay lại trang chủ Firebase Console dự án của bạn (nhấp vào biểu tượng Home hoặc *Project Overview* ở góc trên bên trái).
    *   Nhấp vào biểu tượng **Web** (ký hiệu `</>`) ở giữa màn hình để đăng ký ứng dụng Web.
    *   Đặt tên nickname ứng dụng (Ví dụ: `Web-App`), nhấn **Register app**.
    *   Đợi vài giây, Firebase sẽ hiển thị cho bạn một đoạn mã cấu hình chứa đối tượng JavaScript trông như thế này:
        ```javascript
        const firebaseConfig = {
          apiKey: "AIzaSyA...",
          authDomain: "...",
          projectId: "...",
          storageBucket: "...",
          messagingSenderId: "...",
          appId: "..."
        };
        ```
5.  **Kết nối Đám mây trong Ứng Dụng:**
    *   Mở trang web đã được Deploy của bạn (hoặc chạy thử dưới local).
    *   Truy cập vào menu **Đồng bộ Đám mây** ở Sidebar trái.
    *   Nhập các thông số tương ứng từ Firebase Console vào form: **API Key**, **Auth Domain**, **Project ID**, và **App ID**.
    *   Nhấn **Lưu cấu hình & Kết nối**.
    *   Hệ thống sẽ chuyển bạn sang bảng đăng nhập. Bạn có thể sử dụng Đăng nhập bằng Google hoặc Đăng ký tài khoản Email mới. Ngay khi đăng nhập thành công, dữ liệu tiến độ cũ lưu dưới Local sẽ được tự động đồng bộ hóa an toàn lên Firestore Cloud!

Chúc bạn có những trải nghiệm học tập và ôn luyện tiếng Trung thật vui vẻ và gặt hái được nhiều điểm số XP ấn tượng! 💮
