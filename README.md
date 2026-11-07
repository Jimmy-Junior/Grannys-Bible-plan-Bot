## Gogo Daily Bible Reading - WhatsApp Automation ##

Sends my grandmother a daily Bible reading on WhatsApp at 7am, automatically.

Built for my gran in South Africa. She gets one message every morning with that day's reading from John. No app to install, no link to click, just a WhatsApp message.

## How It Works
Google Sheet (47-day plan) 
  → Google Apps Script (runs at 7am SAST) 
  → Whatabot API 
  → WhatsApp message to Gogojavascript
No server. No laptop left on. Google runs it in the cloud.

- **47 days:** 8 Nov 2026 → 24 Dec 2026
- **Book:** John
- **Time:** 7am - 8am, Africa/Johannesburg
- **Message:** "Good morning Gogo ❤️ / Today you can read - [reading] / Take your time..."

## Why Not CallMeBot?

Started with CallMeBot, but it failed:
1. Old number showed as an "Invite" link, not a chat
2. New number replied: "This Bot is full / I am working to create a new bot..."

Switched to **Whatabot** — same idea, same free setup, not full.

## 1. Google Sheet Setup

Create a Google Sheet with 2 columns:

| A - Date | B - Reading |
| --- | --- |
| 08/11/2026 | John 3:21-36 |
| 09/11/2026 | John 4:1-26 |
| 10/11/2026 | John 4:27-42 |
| ... | ... |
| 24/12/2026 | John 21:15-25 |

Tab name: `Sheet1` (or update `getSheetByName()` in the script to match).

Full plan is in `plan.csv` / this Sheet. It covers John 3 → John 21.

## 2. Get a Whatabot API Key

Do this **on the recipient's phone first** for testing, then on Gogo's phone for deployment.

1. Go to **whatabot.net** → Get API Key
2. Message the Whatabot number it gives you:I allow whatabot to send me messagesjavascript3. It replies with your API key. Save it.
   - The key is tied to that phone number only. My key won't work for Gogo's number.

## 3. Apps Script

In the Sheet: **Extensions → Apps Script**

Paste this in `Code.gs`:

```javascript
// --- CONFIG: Change these 2 lines ---
const GRANDMA_PHONE = "27XXXXXXXXX"; // Recipient number, no +, no leading 0. e.g. 27821234567
const APIKEY = "PASTE_WHATABOT_APIKEY_HERE";

function sendDailyReading() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Sheet1");
  const today = new Date();
  const data = sheet.getRange("A2:B100").getValues();

  for (let i = 0; i < data.length; i++) {
    const sheetDate = new Date(data[i][0]);
    if (sheetDate.toDateString() === today.toDateString()) {
      const reading = data[i][1];
      const message = "Good morning Gogo ❤️\n\nToday you can read - " + reading + "\n\nTake your time with it, I will check in tonight. Love you!";
      const url = "http://api.whatabot.net/whatsapp/sendMessage?text=" + encodeURIComponent(message) + "&apikey=" + APIKEY + "&phone=" + GRANDMA_PHONE;
      UrlFetchApp.fetch(url);
      break;
    }
  }
}
```
How it picks the row
It does not remember "last row sent". Every run it:
Gets all rows A2:B100Loops row by rowChecks if (rowDate == today)Sends that one row, then stops (break)If a day is missed, it skips it — it won't double-send the next day to catch up.

## 4. Test On My Own Phone First

Never test on Gogo first.

Set GRANDMA_PHONE + APIKEY to MY number + MY keyIn Apps Script, click Run → sendDailyReadingAllow permissions on first run (Review permissions → Allow)Click Run againCheck WhatsApp — should arrive in ∼10 seconds with today's reading5. Deployment — Set The Timer
Switch GRANDMA_PHONE + APIKEY back to Gogo's number + Gogo's keySave (Ctrl+S)In Apps Script left sidebar → Triggers (clock icon) → + Add TriggerFunction to run: sendDailyReadingDeployment: HeadEvent source: Time-drivenType: Day timerTime of day: 7am to 8amSave → Allow permissionsTimezone Check (Important for SA)
Apps Script → Project Settings (gear icon) → Time zone must be :javascriptAfrica/Johannesburg (GMT+02:00)Otherwise it will send at 7am US time, not SA time.
Verify It Ran
Apps Script → Executions → Should show sendDailyReading - Completed around 7am each day.

Troubleshooting Problem Fix Message never arrives, log says CompletedAPI key is wrong or belongs to a different numberScript failsPhone format wrong — must be 27..., no +, no leading 0Sends at wrong timeTimezone is not Africa/JohannesburgNo message on a day That date is missing / misspelled in Column A Tab renamedUpdate getSheetByName("Sheet1") to match new tab nameFilesjavascript/README.md
/Code.gs
/plan.csv

## Future Improvements
Add Column C Sent — script writes "Sent" + timestamp after sending, so you can see in the Sheet which days were delivered without asking Gogo.Move to official WhatsApp Cloud API if Whatabot ever fills up like CallMeBot did.Built With
Google SheetsGoogle Apps ScriptWhatabot APIWhatsApp
