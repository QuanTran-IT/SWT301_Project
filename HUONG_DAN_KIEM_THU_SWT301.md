# TÀI LIỆU HƯỚNG DẪN KIỂM THỬ TỰ ĐỘNG
### MÔN SWT301: DATE TIME CHECKER (PLAYWRIGHT & PERCY)

---

## I. TỔNG QUAN VỀ 2 LOẠI KIỂM THỬ TRONG DỰ ÁN

| Loại Kiểm Thử | File Test | Nhiệm Vụ | Đặc Điểm Báo Lỗi |
| :--- | :--- | :--- | :--- |
| **1. Visual Regression (Giao diện trực quan)** | `tests/visual.spec.js` | Chụp ảnh màn hình, so pixel với ảnh chuẩn (Baseline), gửi lên đám mây Percy để phát hiện vỡ layout, lệch lề, sai màu/font. | Báo lỗi ngay khi **chữ bị xô lệch, đổi màu, sai vị trí**, dù chức năng logic vẫn chạy bình thường. |
| **2. Functional Test (Logic chức năng)** | `tests/datetime-checker.spec.js` | Tự động điền dữ liệu (Day, Month, Year), bấm nút Check/Clear và kiểm tra nội dung text thông báo theo 27 Test Cases. | **Chỉ quan tâm text đúng/sai**. Giao diện bị lệch, méo hay đổi màu test này **vẫn báo Passed** nếu text vẫn khớp. |

---

## II. PHẦN 1: THIẾT LẬP BAN ĐẦU (Chỉ cần làm 1 lần)

### 1. Lấy Token từ Percy.io
1. Đăng nhập trang [https://percy.io](https://percy.io).
2. Tạo dự án mới nền tảng **Web** (hoặc mở project có sẵn `DateTimeChecker`).
3. Vào **Project Settings** $\rightarrow$ Tìm mục **Project Token** $\rightarrow$ Bấm **Copy**.
   *(Mã token của bạn có dạng: `web_d4667fd4923f35149ce947936d9946b...`)*

### 2. Chuẩn bị môi trường trên máy tính
Mở **Command Prompt (cmd)** tại thư mục `WebApp`:
```cmd
cd d:\SWT301_Project\WebApp
npm install
npx playwright install
```

---

## III. PHẦN 2: QUY TRÌNH CHẠY KIỂM THỬ CHI TIẾT

> **Quy tắc 2 Cửa Sổ cmd:**
> - **cmd 1:** Luôn dùng để bật máy chủ web tĩnh (Port 3000).
> - **cmd 2:** Dùng để gõ lệnh chạy các bài test.

---

### Bước 1: Khởi động Web Server (cmd 1)
Mở cửa sổ **cmd 1** tại thư mục `WebApp`:
```cmd
cd d:\SWT301_Project\WebApp
npx serve -l 3000
```
> *Giữ nguyên cửa sổ này luôn mở trong suốt quá trình chạy test.*

---

### Bước 2: Nạp Token Percy (cmd 2)
Mở thêm **cmd 2** tại thư mục `WebApp`. Chạy lệnh sau để gán biến môi trường:

```cmd
set PERCY_TOKEN=web_d4667fd4923f35149ce947936d9946b052002135feb6f9640a6f24a32e1dce3d
```

---

### Bước 3: Chạy Kiểm Thử Hồi Quy Giao Diện (Visual Regression)

#### Trường hợp A: Chạy test và đẩy ảnh lên Percy Cloud
Tại **cmd 2**, chạy lệnh:
```cmd
npx percy exec -- npx playwright test tests/visual.spec.js
```
* Playwright mở trình duyệt, chụp ảnh 3 trạng thái (Form mặc định, Nhập ngày đúng, Nhập ngày sai).
* Percy gom ảnh và đẩy lên đám mây, sau đó in ra link kết quả:
  `[percy] Finalized build #X: https://percy.io/...`
* Bấm vào link để xem so sánh song song giữa ảnh chuẩn và ảnh hiện tại.

#### Trường hợp B: Kiểm tra nhanh giao diện cục bộ (Local Playwright)
Nếu chỉ muốn máy tự so sánh pixel với ảnh baseline offline:
```cmd
npx playwright test tests/visual.spec.js
```
* Nếu có bất kỳ điểm nào xô lệch so với ảnh gốc, test sẽ báo `FAILED` và sinh ra ảnh so sánh `diff.png` chỉ ra đúng chỗ bị lệch.

#### Trường hợp C: Cập nhật lại ảnh gốc mốc (Update Baseline)
> **Chỉ chạy lệnh này khi bạn CHỦ ĐỘNG thay đổi giao diện** và muốn lưu giao diện mới này làm mốc chuẩn cho các lần test tiếp theo:
```cmd
npx playwright test tests/visual.spec.js --update-snapshots
```

---

### Bước 4: Chạy Kiểm Thử Chức Năng (Bộ 27 Test Cases Logic)

Tại **cmd 2**, chạy lệnh kiểm tra logic nghiệp vụ (không cần token Percy):
```cmd
npx playwright test tests/datetime-checker.spec.js
```

* Hoặc mở chế độ giao diện đồ họa trực quan (Playwright UI Mode) để xem robot tự động gõ phím:
```cmd
npx playwright test tests/datetime-checker.spec.js --ui
```

---

## IV. BẢNG TỔNG HỢP 27 TEST CASES ĐẶC TẢ ĐÃ HOÀN THIỆN

| Mã TC | Phân Loại | Dữ Liệu Đầu Vào | Kết Quả Mong Đợi |
| :--- | :--- | :--- | :--- |
| **TC_UI_01** | Giao diện | Mở form | Không có nút Maximize / Minimize, có nút Đóng (✕) |
| **TC_UI_02** | Giao diện | Mở form | Logo trường hiển thị góc trên |
| **TC_UI_03** | Giao diện | Mở form | Tiêu đề "Date Time Checker" màu xanh, font Arial, cỡ 26px |
| **TC_UI_04** | Giao diện | Mở form | Các nhãn "Day", "Month", "Year" được canh lề trái |
| **TC_UI_05** | Giao diện | Mở form | Đủ 3 ô Textbox và 2 nút (Clear, Check) |
| **TC_CL_06** | Nút Clear | Day="15", Month="8", Year="2023" $\rightarrow$ Bấm Clear | Cả 3 ô Textbox bị xóa trắng |
| **TC_CS_07** | Hộp thoại Close | Bấm "✕" $\rightarrow$ Chọn "No" | Đóng hộp thoại, form vẫn mở |
| **TC_CS_08** | Hộp thoại Close | Bấm "✕" $\rightarrow$ Chọn "Yes" | Ứng dụng đóng/ẩn hoàn toàn |
| **TC_NF_01** | Định dạng số | Day="abc", Month="5", Year="2020" | `Input data for Day is incorrect format!` |
| **TC_NF_02** | Định dạng số | Day="15", Month="xyz", Year="2020" | `Input data for Month is incorrect format!` |
| **TC_NF_03** | Định dạng số | Day="15", Month="5", Year="abcd" | `Input data for Year is incorrect format!` |
| **TC_RV_04** | Giới hạn (Range) | Day="0", Month="5", Year="2020" | `Input data for Day is out of range!` |
| **TC_RV_05** | Giới hạn (Range) | Day="32", Month="5", Year="2020" | `Input data for Day is out of range!` |
| **TC_RV_06** | Giới hạn (Range) | Day="15", Month="0", Year="2020" | `Input data for Month is out of range!` |
| **TC_RV_07** | Giới hạn (Range) | Day="15", Month="13", Year="2020" | `Input data for Month is out of range!` |
| **TC_RV_08** | Giới hạn (Range) | Day="15", Month="5", Year="999" | `Input data for Year is out of range!` |
| **TC_RV_09** | Giới hạn (Range) | Day="15", Month="5", Year="3001" | `Input data for Year is out of range!` |
| **TC_VD_01** | Ngày hợp lệ | Day="31", Month="1", Year="2023" | `31/1/2023 is correct date time!` |
| **TC_VD_02** | Ngày hợp lệ | Day="30", Month="4", Year="2023" | `30/4/2023 is correct date time!` |
| **TC_VD_03** | Ngày hợp lệ | Day="28", Month="2", Year="2023" (Năm thường) | `28/2/2023 is correct date time!` |
| **TC_VD_04** | Ngày hợp lệ | Day="29", Month="2", Year="2024" (Năm nhuận) | `29/2/2024 is correct date time!` |
| **TC_VD_05** | Ngày hợp lệ | Day="1", Month="1", Year="1000" (Min) | `1/1/1000 is correct date time!` |
| **TC_VD_06** | Ngày hợp lệ | Day="31", Month="12", Year="3000" (Max) | `31/12/3000 is correct date time!` |
| **TC_IVD_07**| Ngày sai | Day="31", Month="4", Year="2023" (Tháng 4 có 30 ngày) | `31/4/2023 is NOT correct date time!` |
| **TC_IVD_08**| Ngày sai | Day="29", Month="2", Year="2023" (2023 ko nhuận) | `29/2/2023 is NOT correct date time!` |
| **TC_IVD_09**| Ngày sai | Day="30", Month="2", Year="2024" | `30/2/2024 is NOT correct date time!` |
| **TC_IVD_10**| Ngày sai | Day="31", Month="2", Year="2024" | `31/2/2024 is NOT correct date time!` |

---

## V. BẢNG XỬ LÝ LỖI THƯỜNG GẶP (TROUBLESHOOTING)

| Lỗi gặp phải | Nguyên nhân | Cách khắc phục |
| :--- | :--- | :--- |
| **`[percy] Error: Missing Percy token`** | Đóng cửa sổ cmd hoặc mở cửa sổ mới nên bị mất biến môi trường. | Chạy lại lệnh: <br>`set PERCY_TOKEN=web_d4667fd49...` ngay tại cửa sổ cmd đang chạy test (hoặc gộp chung lệnh: `set PERCY_TOKEN=... && npx percy exec ...`). |
| **`net::ERR_CONNECTION_REFUSED at http://localhost:3000`** | Chưa bật máy chủ Web hoặc đã vô tình tắt cmd 1. | Mở cmd 1 riêng biệt và chạy: <br>`npx serve -l 3000` (giữ nguyên không tắt). |
| **`Error: expect(page).toHaveScreenshot() failed (pixels are different)`** | Giao diện web đã có sự thay đổi (CSS/HTML) so với ảnh gốc mốc. | - Nếu là **lỗi ngoài ý muốn**: Sửa lại CSS.<br>- Nếu là **chủ ý thay đổi UI**: Chạy lệnh `npx playwright test tests/visual.spec.js --update-snapshots` để lưu mốc mới. |
| **`Heads up! It looks like @percy/cli is not installed!`** | Bạn đang đứng ở thư mục gốc `SWT301_Project` thay vì `WebApp`. | Gõ lệnh: `cd d:\SWT301_Project\WebApp` rồi mới chạy lệnh test. |
