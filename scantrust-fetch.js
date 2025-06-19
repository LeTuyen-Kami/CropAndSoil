const puppeteer = require("puppeteer");
const fs = require("fs");

const links = ["HTTPS://ST4.CH/Q/U5GBPNASSL0918MPOG2GA0R78YZE4UK5"];

(async () => {
  const browser = await puppeteer.launch({ headless: "new" }); // hoặc false nếu muốn xem browser chạy
  const page = await browser.newPage();

  const results = [];

  for (const link of links) {
    try {
      console.log(`🌐 Đang mở: ${link}`);
      await page.goto(link, { waitUntil: "networkidle2" });

      const finalUrl = page.url();
      console.log(`➡️  Redirect tới: ${finalUrl}`);

      const full = new URL(finalUrl);
      const hash = full.hash.substring(1); // bỏ dấu #
      const hashUrl = new URL(hash, full.origin);

      const uid = hashUrl.searchParams.get("uid");
      const key = hashUrl.searchParams.get("key");

      if (!uid || !key) {
        throw new Error("Không tìm thấy uid hoặc key");
      }

      const apiUrl = `https://api.scantrust.com/api/v2/consumer/scan/${uid}/combined-info/`;

      const res = await fetch(apiUrl, {
        headers: {
          "X-ScanTrust-Consumer-Api-Key": key,
        },
      });

      if (!res.ok) throw new Error(`Lỗi API: ${res.status}`);

      const data = await res.json();

      results.push({ link, uid, key, data });
      console.log(`✅ Thành công với: ${link}`);
    } catch (err) {
      console.error(`💥 Lỗi với ${link}: ${err.message}`);
    }
  }

  await browser.close();

  fs.writeFileSync(
    "scantrust_puppeteer_results.json",
    JSON.stringify(results, null, 2)
  );
  console.log("📁 Đã lưu kết quả vào scantrust_puppeteer_results.json");
})();
