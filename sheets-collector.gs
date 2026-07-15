// ══════════════════════════════════════════════════════
// KHOZNA — Waitlist Google Sheets Collector
// Deploy this as a Google Apps Script Web App
//
// SETUP STEPS:
// 1. Open sheets.google.com → create a new spreadsheet
// 2. Name it "Khozna Waitlist"
// 3. Go to Extensions → Apps Script
// 4. Delete the default code and paste this entire file
// 5. Click Save, then Deploy → New deployment
// 6. Type: Web app
//    Execute as: Me
//    Who has access: Anyone
// 7. Click Deploy → copy the Web App URL
// 8. Paste that URL into main.js as SHEETS_WEBHOOK_URL
// ══════════════════════════════════════════════════════

function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    // Add headers if sheet is empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['Timestamp', 'Email', 'Source', 'User Agent']);
      sheet.getRange(1, 1, 1, 4).setFontWeight('bold').setBackground('#00A3E1').setFontColor('#ffffff');
      sheet.setColumnWidth(1, 180);
      sheet.setColumnWidth(2, 260);
      sheet.setColumnWidth(3, 120);
      sheet.setColumnWidth(4, 300);
    }

    const data = JSON.parse(e.postData.contents);
    const email     = data.email     || '';
    const source    = data.source    || 'unknown';
    const userAgent = data.userAgent || '';
    const timestamp = new Date().toLocaleString('en-NP', { timeZone: 'Asia/Kathmandu' });

    // Append the new row
    sheet.appendRow([timestamp, email, source, userAgent]);

    // Return success
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'ok', email: email }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Test function — run this manually in Apps Script editor to verify setup
function testSetup() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  Logger.log('Sheet name: ' + sheet.getName());
  Logger.log('Setup is working ✓');
}
