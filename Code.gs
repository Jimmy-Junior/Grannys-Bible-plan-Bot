// Gogo Daily Bible Reading - WhatsApp Automation
// Google Sheet -> Apps Script -> Whatabot API -> WhatsApp

// --- CONFIG: Change these 2 lines ---
const GRANDMA_PHONE = "27XXXXXXXXX"; // Recipient number, no +, no leading 0. e.g. 27821234567
const APIKEY = "PASTE_WHATABOT_APIKEY_HERE"; // Key from Whatabot - tied to that phone number only

function sendDailyReading() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Sheet1");
  const today = new Date();
  const data = sheet.getRange("A2:C100").getValues();

  for (let i = 0; i < data.length; i++) {
    const sheetDate = new Date(data[i][0]);
    if (sheetDate.toDateString() === today.toDateString()) {
      const reading = data[i][1];
      const message = "Good morning Gogo ❤️\n\nToday you can read - " + reading + "\n\nTake your time with it, I will check in tonight. Love you!";
      const url = "http://api.whatabot.net/whatsapp/sendMessage?text=" + encodeURIComponent(message) + "&apikey=" + APIKEY + "&phone=" + GRANDMA_PHONE;
      
      UrlFetchApp.fetch(url);
      
      // Mark as sent in Column C so you can check delivery in the Sheet
      sheet.getRange(i + 2, 3).setValue("Sent - " + new Date().toLocaleString("en-ZA", { timeZone: "Africa/Johannesburg" }));
      break;
    }
  }
}
