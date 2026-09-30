const fs = require('fs');
const path = require('path');
const {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  AlignmentType,
  ShadingType
} = require('docx');

function createHeading1(text) {
  return new Paragraph({
    text: text,
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 320, after: 160 },
    run: {
      color: "0033A0",
      bold: true,
      size: 30,
      font: "Arial"
    }
  });
}

function createHeading2(text) {
  return new Paragraph({
    text: text,
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 220, after: 110 },
    run: {
      color: "2563EB",
      bold: true,
      size: 25,
      font: "Arial"
    }
  });
}

function createHeading3(text) {
  return new Paragraph({
    text: text,
    heading: HeadingLevel.HEADING_3,
    spacing: { before: 160, after: 80 },
    run: {
      color: "1E293B",
      bold: true,
      size: 22,
      font: "Arial"
    }
  });
}

function createParagraph(text, options = {}) {
  return new Paragraph({
    spacing: { before: 60, after: 60 },
    children: [
      new TextRun({
        text: text,
        font: "Arial",
        size: 22,
        bold: options.bold || false,
        italics: options.italics || false,
        color: options.color || "333333"
      })
    ]
  });
}

function createBullet(text, boldPrefix = "") {
  const children = [];
  if (boldPrefix) {
    children.push(new TextRun({
      text: boldPrefix + " ",
      bold: true,
      font: "Arial",
      size: 22,
      color: "1E293B"
    }));
  }
  children.push(new TextRun({
    text: text,
    font: "Arial",
    size: 22,
    color: "333333"
  }));

  return new Paragraph({
    bullet: { level: 0 },
    spacing: { before: 40, after: 40 },
    children: children
  });
}

function createQuoteBox(quoteText, title = "LỜI THOẠI QUAY VIDEO") {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            shading: { type: ShadingType.CLEAR, fill: "F0FDF4" },
            margins: { top: 120, bottom: 120, left: 160, right: 160 },
            borders: {
              top: { style: BorderStyle.SINGLE, size: 4, color: "BBF7D0" },
              bottom: { style: BorderStyle.SINGLE, size: 4, color: "BBF7D0" },
              left: { style: BorderStyle.SINGLE, size: 16, color: "16A34A" },
              right: { style: BorderStyle.SINGLE, size: 4, color: "BBF7D0" }
            },
            children: [
              new Paragraph({
                spacing: { before: 0, after: 60 },
                children: [
                  new TextRun({
                    text: "🎙️ " + title + ":",
                    bold: true,
                    font: "Arial",
                    size: 20,
                    color: "15803D"
                  })
                ]
              }),
              new Paragraph({
                spacing: { before: 40, after: 40 },
                children: [
                  new TextRun({
                    text: quoteText,
                    italics: true,
                    font: "Arial",
                    size: 21,
                    color: "1E293B"
                  })
                ]
              })
            ]
          })
        ]
      })
    ]
  });
}

function createCodeBlock(code) {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            shading: { type: ShadingType.CLEAR, fill: "F8FAFC" },
            margins: { top: 100, bottom: 100, left: 140, right: 140 },
            borders: {
              top: { style: BorderStyle.SINGLE, size: 4, color: "E2E8F0" },
              bottom: { style: BorderStyle.SINGLE, size: 4, color: "E2E8F0" },
              left: { style: BorderStyle.SINGLE, size: 12, color: "3B82F6" },
              right: { style: BorderStyle.SINGLE, size: 4, color: "E2E8F0" }
            },
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: code,
                    font: "Consolas",
                    size: 20,
                    color: "0F172A"
                  })
                ]
              })
            ]
          })
        ]
      })
    ]
  });
}

function createTable(headers, rowsData) {
  const headerRow = new TableRow({
    tableHeader: true,
    children: headers.map(h => new TableCell({
      shading: { type: ShadingType.CLEAR, fill: "0033A0" },
      margins: { top: 100, bottom: 100, left: 100, right: 100 },
      children: [
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({
              text: h,
              bold: true,
              color: "FFFFFF",
              font: "Arial",
              size: 20
            })
          ]
        })
      ]
    }))
  });

  const bodyRows = rowsData.map((row, idx) => new TableRow({
    children: row.map((cellText) => new TableCell({
      shading: { type: ShadingType.CLEAR, fill: idx % 2 === 0 ? "FFFFFF" : "F8FAFC" },
      margins: { top: 80, bottom: 80, left: 90, right: 90 },
      borders: {
        top: { style: BorderStyle.SINGLE, size: 2, color: "E2E8F0" },
        bottom: { style: BorderStyle.SINGLE, size: 2, color: "E2E8F0" },
        left: { style: BorderStyle.SINGLE, size: 2, color: "E2E8F0" },
        right: { style: BorderStyle.SINGLE, size: 2, color: "E2E8F0" }
      },
      children: [
        new Paragraph({
          children: [
            new TextRun({
              text: cellText,
              font: "Arial",
              size: 19,
              color: "333333"
            })
          ]
        })
      ]
    }))
  }));

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [headerRow, ...bodyRows]
  });
}

async function generateDocx() {
  const doc = new Document({
    sections: [{
      properties: {},
      children: [
        // Title Cover
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 100, after: 80 },
          children: [
            new TextRun({
              text: "TÀI LIỆU HƯỚNG DẪN DỰ ÁN & KỊCH BẢN YOUTUBE",
              bold: true,
              size: 34,
              color: "0033A0",
              font: "Arial"
            })
          ]
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 0, after: 260 },
          children: [
            new TextRun({
              text: "DÀNH CHO TEAMATE - MÔN HỌC SWT301 (DATE TIME CHECKER)",
              bold: true,
              size: 23,
              color: "F26522",
              font: "Arial"
            })
          ]
        }),

        // =========================================================================
        // PHẦN I
        // =========================================================================
        createHeading1("I. TỔNG QUAN CÔNG NGHỆ & KIẾN TRÚC TEST"),
        createBullet("Ứng dụng Date Time Checker được xây dựng bằng HTML5, CSS3 và JavaScript thuần. Thực hiện nhiệm vụ kiểm tra tính hợp lệ của ngày, tháng, năm với đầy đủ logic năm nhuận, số ngày từng tháng và kiểm tra định dạng.", "1. Ứng dụng nguồn (SUT - System Under Test):"),
        createBullet("Framework kiểm thử tự động End-to-End hàng đầu của Microsoft. Đảm nhận việc mở trình duyệt ảo Chromium, tự động điền form, click nút và kiểm tra thông báo phản hồi (Assert) siêu nhanh với cơ chế Auto-wait thông minh.", "2. Playwright:"),
        createBullet("Nền tảng kiểm thử hồi quy trực quan (Visual Regression Testing) thuộc BrowserStack. Percy nhận diện giao diện của trang web, chụp snapshot, đưa lên đám mây và soi từng pixel để phát hiện bất kỳ sự thay đổi ngoài ý muốn nào (lệch vị trí nút, vỡ layout, sai font, sai màu).", "3. Percy:"),
        
        createHeading2("Kiến trúc hệ thống 3 tầng (3-Tier Test Architecture)"),
        createBullet("Ứng dụng web chạy trên máy chủ Node.js cục bộ (cổng 3000) phục vụ index.html.", "Tầng 1 (SUT):"),
        createBullet("Bộ runner Playwright kết hợp file kịch bản datetime-checker.spec.js đóng vai trò người dùng robot thao tác trực tiếp trên DOM.", "Tầng 2 (Test Runner):"),
        createBullet("Client Agent của Percy gom DOM snapshot đẩy qua API lên máy chủ Percy Cloud để so sánh trực quan với bản chuẩn Baseline.", "Tầng 3 (Cloud Agent):"),

        // =========================================================================
        // PHẦN II
        // =========================================================================
        createHeading1("II. HƯỚNG DẪN SETUP & CHẠY TEST (DÀNH CHO TEAMATE)"),
        createHeading2("1. Chuẩn bị lần đầu trên máy tính"),
        createBullet("Đảm bảo máy đã cài đặt Node.js LTS (https://nodejs.org). Kiểm tra bằng lệnh: node -v."),
        createBullet("Đăng nhập tài khoản trên https://percy.io (Sign in with GitHub) -> Tạo Project mới tên 'DateTimeChecker' -> Vào Project Settings copy mã 'Project Token' lưu lại."),
        createBullet("Mở Command Prompt (cmd) tại thư mục WebApp và cài đặt các thư viện:"),
        createCodeBlock("cd d:\\SWT301_Project\\WebApp\nnpm install\nnpx playwright install"),

        createHeading2("2. Quy trình chạy kiểm thử hằng ngày (Dùng lại nhiều lần)"),
        createParagraph("Quy trình gồm 4 bước đơn giản:"),
        createBullet("Mở cmd 1 tại WebApp và gõ lệnh chạy web cục bộ (giữ cửa sổ này không tắt):", "Bước 2.1 (Bật Server 3000):"),
        createCodeBlock("npx serve -l 3000"),
        createBullet("Mở cmd 2 tại WebApp và nạp mã Token dự án:", "Bước 2.2 (Nạp Token):"),
        createCodeBlock("set PERCY_TOKEN=dan_token_cua_ban_vao_day"),
        createBullet("Tại cmd 2, chạy lệnh kết hợp Percy và Playwright:", "Bước 2.3 (Chạy Visual Test):"),
        createCodeBlock("npx percy exec -- npx playwright test tests/visual.spec.js"),
        createBullet("Click vào đường link https://percy.io/... xuất hiện ở cuối Terminal để xem kết quả so sánh từng pixel và bấm nút Approve All (với bản đầu) hoặc xem vùng màu đỏ (Visual Diff).", "Bước 2.4 (Duyệt kết quả Percy):"),

        createHeading2("3. Lệnh chạy 27 Test Case chức năng (Playwright)"),
        createParagraph("Chạy nhanh 27 test case logic trên cmd 2:"),
        createCodeBlock("npx playwright test tests/datetime-checker.spec.js"),
        createParagraph("Chạy với giao diện Playwright UI trực quan (xem robot gõ phím và click nút):"),
        createCodeBlock("npx playwright test tests/datetime-checker.spec.js --ui"),
        createParagraph("Xem trang báo cáo HTML chi tiết sau khi chạy xong:"),
        createCodeBlock("npx playwright show-report"),

        // =========================================================================
        // PHẦN III
        // =========================================================================
        createHeading1("III. BẢNG CHI TIẾT 27 TEST CASES ĐẶC TẢ HOÀN THIỆN"),
        createTable(
          ["Mã TC", "Nhóm Chức Năng", "Dữ Liệu Đầu Vào", "Kết Quả Mong Đợi (Expected Message)"],
          [
            ["TC_UI_01", "Giao diện (Layout)", "Mở ứng dụng", "Form không có nút Maximize và Minimize, có nút Đóng"],
            ["TC_UI_02", "Giao diện (Layout)", "Mở ứng dụng", "Logo FPT University hiển thị ở góc trên bên trái"],
            ["TC_UI_03", "Giao diện (Layout)", "Mở ứng dụng", 'Tiêu đề "Date Time Checker" màu xanh, font Arial, size 26'],
            ["TC_UI_04", "Giao diện (Layout)", "Mở ứng dụng", 'Labels "Day", "Month", "Year" canh lề trái'],
            ["TC_UI_05", "Giao diện (Layout)", "Mở ứng dụng", "3 ô Textbox và 2 Nút (Clear, Check) hiển thị đầy đủ"],
            ["TC_CL_06", 'Nút "Clear"', 'Nhập Day="15", Month="8", Year="2023" -> Bấm Clear', "Tất cả 3 ô Textbox được xóa trắng"],
            ["TC_CS_07", 'Nút "Close"', 'Bấm nút "X" -> Chọn "No" trong hộp thoại', "Hộp thoại đóng và ứng dụng vẫn mở"],
            ["TC_CS_08", 'Nút "Close"', 'Bấm nút "X" -> Chọn "Yes" trong hộp thoại', "Ứng dụng đóng/ẩn hoàn toàn"],
            ["TC_NF_01", "Định dạng số", 'Day="abc", Month="5", Year="2020"', "Input data for Day is incorrect format!"],
            ["TC_NF_02", "Định dạng số", 'Day="15", Month="xyz", Year="2020"', "Input data for Month is incorrect format!"],
            ["TC_NF_03", "Định dạng số", 'Day="15", Month="5", Year="abcd"', "Input data for Year is incorrect format!"],
            ["TC_RV_04", "Giới hạn (Range)", 'Day="0", Month="5", Year="2020"', "Input data for Day is out of range!"],
            ["TC_RV_05", "Giới hạn (Range)", 'Day="32", Month="5", Year="2020"', "Input data for Day is out of range!"],
            ["TC_RV_06", "Giới hạn (Range)", 'Day="15", Month="0", Year="2020"', "Input data for Month is out of range!"],
            ["TC_RV_07", "Giới hạn (Range)", 'Day="15", Month="13", Year="2020"', "Input data for Month is out of range!"],
            ["TC_RV_08", "Giới hạn (Range)", 'Day="15", Month="5", Year="999"', "Input data for Year is out of range!"],
            ["TC_RV_09", "Giới hạn (Range)", 'Day="15", Month="5", Year="3001"', "Input data for Year is out of range!"],
            ["TC_VD_01", "Ngày hợp lệ", 'Day="31", Month="1", Year="2023"', "31/1/2023 is correct date time!"],
            ["TC_VD_02", "Ngày hợp lệ", 'Day="30", Month="4", Year="2023"', "30/4/2023 is correct date time!"],
            ["TC_VD_03", "Ngày hợp lệ", 'Day="28", Month="2", Year="2023" (Năm thường)', "28/2/2023 is correct date time!"],
            ["TC_VD_04", "Ngày hợp lệ", 'Day="29", Month="2", Year="2024" (Năm nhuận)', "29/2/2024 is correct date time!"],
            ["TC_VD_05", "Ngày hợp lệ", 'Day="1", Month="1", Year="1000" (Min)', "1/1/1000 is correct date time!"],
            ["TC_VD_06", "Ngày hợp lệ", 'Day="31", Month="12", Year="3000" (Max)', "31/12/3000 is correct date time!"],
            ["TC_IVD_07", "Ngày không hợp lệ", 'Day="31", Month="4", Year="2023" (Tháng 30 ngày)', "31/4/2023 is NOT correct date time!"],
            ["TC_IVD_08", "Ngày không hợp lệ", 'Day="29", Month="2", Year="2023" (Năm thường)', "29/2/2023 is NOT correct date time!"],
            ["TC_IVD_09", "Ngày không hợp lệ", 'Day="30", Month="2", Year="2024"', "30/2/2024 is NOT correct date time!"],
            ["TC_IVD_10", "Ngày không hợp lệ", 'Day="31", Month="2", Year="2024"', "31/2/2024 is NOT correct date time!"]
          ]
        ),

        // =========================================================================
        // PHẦN IV
        // =========================================================================
        createHeading1("IV. KỊCH BẢN QUAY VIDEO YOUTUBE DÀNH CHO 5 THÀNH VIÊN"),
        createParagraph("Kịch bản được thiết kế theo phong cách YouTube công nghệ (Tech / Tutorial) sôi nổi, tự nhiên và chuyên nghiệp."),
        
        createTable(
          ["Thành Viên", "Phân Đoạn", "Nội Dung Phụ Trách", "Thời Lượng"],
          [
            ["Speaker 1", "Hook & Giới thiệu Tech Stack", "Mở đầu cuốn hút, đặt vấn đề lỗi CSS và giới thiệu Playwright + Percy", "0:00 - 1:15"],
            ["Speaker 2", "Kiến trúc & Thiết kế Test", "Kiến trúc 3 tầng và tư duy thiết kế 27 test cases (EP, BVA)", "1:15 - 2:30"],
            ["Speaker 3", "Live Demo: Test Chức Năng", "Demo Playwright UI Mode tự động hóa điền form & HTML Report", "2:30 - 4:00"],
            ["Speaker 4", "Live Demo: Test Giao Diện", "Demo Percy Cloud soi pixel, bắt lỗi lệch CSS (Visual Diff)", "4:00 - 5:30"],
            ["Speaker 5", "Phân tích Nghiệp vụ QA & Outro", "Phân tích Test Coverage, Decision Coverage, Edge cases & ROI", "5:30 - 6:45"]
          ]
        ),

        createHeading2("SPEAKER 1: HOOK & GIỚI THIỆU CÔNG NGHỆ (0:00 - 1:15)"),
        createBullet("B-roll Playwright gõ dữ liệu thần tốc -> Quay mặt Speaker 1 hoặc trang chủ Playwright & Percy.", "Thao tác trên video:"),
        createQuoteBox(
          '\"Bạn đã bao giờ gặp trường hợp: Code logic chức năng thì chạy chuẩn 100%, nhưng chỉ vì sửa một dòng CSS mà nút bấm bị lệch, vỡ cả giao diện trên điện thoại chưa?\n\n' +
          'Chào mừng các bạn đã quay trở lại với kênh của tụi mình! Trong video ngày hôm nay, team mình gồm 5 thành viên sẽ cùng các bạn xây dựng một giải pháp Kiểm thử tự động (Automation Testing) toàn diện từ A đến Z cho một ứng dụng Web mang tên Date Time Checker.\n\n' +
          'Để giải quyết trọn vẹn cả 2 bài toán: \\\"Chức năng có đúng không?\\\" và \\\"Giao diện có đẹp, có bị vỡ không?\\\", tụi mình kết hợp 2 công cụ cực kỳ xịn sò:\n' +
          '- Thứ nhất là Playwright – Framework test E2E nhanh nhất hiện nay từ Microsoft, giúp tự động thao tác trình duyệt và kiểm tra logic.\n' +
          '- Thứ hai là Percy của BrowserStack – Công cụ Visual Regression Testing hàng đầu, chụp ảnh màn hình và tự động soi từng pixel để phát hiện bug giao diện.\n\n' +
          'Ngay bây giờ, hãy cùng bạn Speaker 2 tìm hiểu xem kiến trúc của hệ thống test này hoạt động như thế nào nhé!\"',
          "LỜI THOẠI SPEAKER 1"
        ),

        createHeading2("SPEAKER 2: KIẾN TRÚC TEST & THIẾT KẾ KỊCH BẢN (1:15 - 2:30)"),
        createBullet("Show sơ đồ kiến trúc 3 tầng -> Lướt cấu trúc thư mục project VS Code -> Mở bảng 27 Test Cases.", "Thao tác trên video:"),
        createQuoteBox(
          '\"Hello các bạn, mình là Speaker 2! Trước khi bắt tay vào chạy demo, tụi mình cùng nhìn nhanh qua Kiến trúc hệ thống (Test Architecture) nhé.\n\n' +
          'Mô hình của tụi mình gồm 3 tầng chính:\n' +
          '1. Tầng dưới cùng là SUT (System Under Test) – Ứng dụng web Date Time Checker chạy trên Local Server Node.js cổng 3000.\n' +
          '2. Tầng ở giữa là Playwright Test Runner – Đóng vai trò như một người dùng robot. Playwright sẽ dùng các bộ Selector để tìm ô Day, Month, Year, tự động gõ phím, click nút Check và kiểm tra thông báo phản hồi.\n' +
          '3. Tầng thứ ba là Percy Agent – Mỗi khi Playwright đổi trạng thái giao diện, Percy sẽ chụp lại một DOM Snapshot, mã hóa và đẩy lên Percy Cloud để so sánh với bản gốc Baseline.\n\n' +
          'Về mặt thiết kế kịch bản test, tụi mình áp dụng 2 kỹ thuật tiêu chuẩn là Phân vùng tương đương (Equivalence Partitioning) và Phân tích giá trị biên (Boundary Value Analysis), chia thành 27 test case bao quát từ kiểm tra ký tự chữ, năm nhuận ngày 29/2, tháng 30-31 ngày, cho tới chức năng xóa và đóng ứng dụng.\n\n' +
          'Và không để các bạn chờ lâu nữa, xin mời Speaker 3 mang tới màn Live Demo kiểm thử chức năng cực kỳ mãn nhãn!\"',
          "LỜI THOẠI SPEAKER 2"
        ),

        createHeading2("SPEAKER 3: LIVE DEMO KIỂM THỬ CHỨC NĂNG (2:30 - 4:00)"),
        createBullet("Mở cmd gõ: npx playwright test tests/datetime-checker.spec.js --ui -> Bấm Run -> Zoom màn hình tự điền -> Mở show-report.", "Thao tác trên video:"),
        createQuoteBox(
          '\"Chào các bạn, mình là Speaker 3! Mình sẽ trực tiếp demo quá trình Playwright chạy tự động.\n\n' +
          'Thay vì chạy dòng lệnh nhàm chán, mình sẽ bật chế độ Playwright UI Mode bằng lệnh --ui.\n\n' +
          '[Bấm nút Run] Các bạn hãy nhìn góc bên phải màn hình: Trình duyệt Chromium ảo đang tự động gõ \\\'abc\\\' để test lỗi định dạng, thử ngày 31 tháng 4 để bắt lỗi tháng 30 ngày, và kiểm tra năm 2024 ngày 29 tháng 2.\n' +
          'Tất cả 27 test case chạy vèo một cái chỉ mất đúng 6.3 giây, và kết quả là 27 passed – xanh mướt 100%!\n\n' +
          'Đặc biệt, nếu bấm vào từng test case, các bạn có thể xem lại \\\'dòng thời gian\\\' (Time Travel Debugging): Trước khi click nút ô input trông như thế nào, sau khi click ra sao.\n' +
          'Playwright còn tự động xuất cho chúng ta một trang HTML Report cực kỳ chuyên nghiệp, liệt kê chi tiết từng mili-giây thực thi.\n\n' +
          'Chức năng thì ngon rồi, nhưng liệu giao diện có bị lỗi hiển thị không? Xin mời Speaker 4 giải đáp với Percy!\"',
          "LỜI THOẠI SPEAKER 3"
        ),

        createHeading2("SPEAKER 4: LIVE DEMO VISUAL TESTING VỚI PERCY (4:00 - 5:30)"),
        createBullet("Nạp token và chạy lệnh: npx percy exec -- npx playwright test tests/visual.spec.js -> Mở link Percy Dashboard -> So sánh ảnh pixel-by-pixel.", "Thao tác trên video:"),
        createQuoteBox(
          '\"Hi mọi người, mình là Speaker 4! Bây giờ chúng ta sẽ đến với \\\'vũ khí bí mật\\\' mang tên Percy.\n\n' +
          'Bình thường, nếu ai đó lỡ tay sửa CSS làm tiêu đề bị lệch hay chữ bị đổi màu, test chức năng vẫn sẽ báo PASS vì chữ vẫn còn đó. Nhưng Percy thì không dễ bị qua mặt như vậy!\n\n' +
          'Mình đã tích hợp lệnh percy exec bọc ngoài Playwright. Khi chạy, Playwright điều hướng qua các trạng thái form, còn Percy sẽ chụp ảnh và đẩy thẳng lên Cloud.\n\n' +
          '[Chuyển sang trang Percy Dashboard]\n' +
          'Và đây là Dashboard của Percy! Các bạn có thể thấy ở đây:\n' +
          '- Ảnh bên trái là bản chuẩn (Baseline) của lần chạy trước.\n' +
          '- Ảnh bên phải là bản hiện tại.\n' +
          '- Nếu có bất kỳ sự xô lệch nào dù chỉ 1 pixel hay lệch mã màu, Percy sẽ tô viền đỏ rực (Visual Diff) ngay lập tức để cảnh báo cho chúng ta.\n' +
          '- Nó còn hỗ trợ test hiển thị trên cả Chrome, Firefox và chế độ màn hình Mobile nữa! Cực kỳ tiện lợi cho các dự án thực tế.\n\n' +
          'Tiếp theo, xin nhường lại cho Speaker 5 với góc nhìn chuyên sâu về nghiệp vụ QA!\"',
          "LỜI THOẠI SPEAKER 4"
        ),

        createHeading2("SPEAKER 5: PHÂN TÍCH NGHIỆP VỤ QA & OUTRO (5:30 - 6:45)"),
        createBullet("Chỉ chuột vào logic isLeapYear trong script.js -> Mở bảng so sánh thời gian Manual vs Automation -> Quay mặt Speaker 5 hoặc màn hình GitHub repo.", "Thao tác trên video:"),
        createQuoteBox(
          '\"Chào các bạn, mình là Speaker 5! Ở góc độ của một QA/Tester, sau khi đã chạy xong cả Functional và Visual Test, mình muốn cùng các bạn phân tích sâu hơn về giá trị nghiệp vụ mà giải pháp này mang lại.\n\n' +
          'Đầu tiên là về Độ phủ kiểm thử (Test Coverage):\n' +
          '- Trong bài toán kiểm tra ngày tháng, rủi ro lớn nhất luôn nằm ở Năm nhuận và Biên của các tháng ngắn ngày.\n' +
          '- Khi nhìn vào đoạn code logic isLeapYear: (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0). Nếu chỉ test năm 2024 chia hết cho 4 thì chưa đủ! Trong bộ 27 test case, tụi mình đã bao phủ cả trường hợp biên đặc biệt: Năm 1900 chia hết cho 4 nhưng là năm thế kỷ không nhuận, hay năm 2000 chia hết cho 400 lại là năm nhuận. Điều này giúp đảm bảo độ phủ nhánh điều kiện (Decision Coverage) đạt mức tối đa và không để lọt bug nghiệp vụ.\n\n' +
          'Thứ hai là bài toán Hiệu quả thực thi (ROI - Return on Investment):\n' +
          '- Nếu thực hiện Manual Testing: Để một tester nhập đi nhập lại 27 kịch bản này trên nhiều trình duyệt, kiểm tra từng câu chữ thông báo, bạn sẽ mất ít nhất từ 15 đến 20 phút, chưa kể rất dễ mỏi mắt và nhập sai dữ liệu.\n' +
          '- Nhưng với Playwright Automation, toàn bộ 27 test case được thực thi chỉ trong đúng 6.3 giây! Nhanh gấp gần 200 lần, và có thể chạy lặp lại hàng nghìn lần trong quy trình CI/CD mỗi khi có commit mới mà không tốn thêm nhân lực.\n\n' +
          'Cuối cùng là sự bổ trợ giữa Logic và Visual: Playwright chịu trách nhiệm bảo vệ \\\'bộ não\\\' của ứng dụng (Logic đúng), còn Percy bảo vệ \\\'bộ mặt\\\' của ứng dụng (Giao diện không xô lệch). Sự kết hợp này tạo nên một tấm khiên chất lượng toàn diện trước khi đưa sản phẩm tới tay người dùng cuối.\n\n' +
          'Toàn bộ mã nguồn, cấu hình test và tài liệu đặc tả tụi mình đã public tại link GitHub bên dưới mô tả. Cảm ơn các bạn đã theo dõi video, hẹn gặp lại các bạn trong các chủ đề tiếp theo về Software Quality Assurance! Bye bye!\"',
          "LỜI THOẠI SPEAKER 5"
        ),

        // =========================================================================
        // PHẦN V
        // =========================================================================
        createHeading1("V. BẢNG KHẮC PHỤC SỰ CỐ THƯỜNG GẶP (FAQ)"),
        createTable(
          ["Hiện Tượng Lỗi", "Nguyên Nhân", "Cách Khắc Phục Chuẩn"],
          [
            [
              "[percy] Error: Missing PERCY_TOKEN",
              "Đóng cửa sổ cmd hoặc mở cửa sổ cmd mới nên bị mất biến môi trường.",
              "Gõ lại lệnh gán: set PERCY_TOKEN=token_cua_ban trước khi chạy percy exec."
            ],
            [
              "net::ERR_CONNECTION_REFUSED at http://localhost:3000",
              "Chưa bật Web Server phục vụ file index.html hoặc đã tắt cmd 1.",
              "Mở 1 cmd riêng và chạy lệnh: npx serve -l 3000 (giữ nguyên không tắt)."
            ],
            [
              "Heads up! It looks like @percy/cli is not installed!",
              "Bạn đang đứng ở thư mục gốc SWT301_Project thay vì WebApp.",
              "Gõ lệnh: cd d:\\SWT301_Project\\WebApp rồi mới chạy lệnh test."
            ]
          ]
        )
      ]
    }]
  });

  const buffer = await Packer.toBuffer(doc);
  const outputPath = path.resolve(__dirname, '../HUONG_DAN_KIEM_THU_SWT301.docx');
  fs.writeFileSync(outputPath, buffer);
  console.log('Document successfully created at:', outputPath);
}

generateDocx().catch(err => {
  console.error('Error generating document:', err);
  process.exit(1);
});
