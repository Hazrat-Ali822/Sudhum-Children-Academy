/**
 * Sudhum Children Academy — form receiver
 * ---------------------------------------------------------------
 * Writes every online admission application, entry test registration
 * and enquiry to a Google Sheet, and emails a copy to the office.
 *
 * Setup instructions are in server/SETUP.md.
 * ---------------------------------------------------------------
 */

// Where submission notifications are sent.
var NOTIFY_EMAIL = 'sudhumsca@gmail.com';

// A separate sheet tab for each submission type.
var TABS = {
  'Admission application'   : 'Admissions',
  'Entry test registration' : 'Entry test',
  'Enquiry'                 : 'Enquiries'
};

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var tab  = TABS[data.type] || 'Other';
    var sheet = getSheet_(tab);

    // New columns appear on their own, so changing the form does not
    // mean changing this script.
    var headers = readHeaders_(sheet);
    var keys = Object.keys(data);
    var added = false;
    for (var i = 0; i < keys.length; i++) {
      if (headers.indexOf(keys[i]) === -1) { headers.push(keys[i]); added = true; }
    }
    if (headers.indexOf('Received at') === -1) { headers.push('Received at'); added = true; }
    if (added) {
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]).setFontWeight('bold');
      sheet.setFrozenRows(1);
    }

    var row = headers.map(function (h) {
      return h === 'Received at' ? new Date() : (data[h] !== undefined ? data[h] : '');
    });
    sheet.appendRow(row);

    notify_(data);
    return json_({ ok: true });
  } catch (err) {
    // Return 200 even on failure: the client only clears its queue
    // once the request goes through. The error is logged here.
    console.error(err);
    return json_({ ok: false, error: String(err) });
  }
}

function doGet() {
  return json_({ ok: true, service: 'Sudhum form receiver' });
}

function getSheet_(name) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  return ss.getSheetByName(name) || ss.insertSheet(name);
}

function readHeaders_(sheet) {
  if (sheet.getLastColumn() === 0) return [];
  return sheet.getRange(1, 1, 1, sheet.getLastColumn())
              .getValues()[0]
              .filter(function (h) { return h !== ''; });
}

function notify_(data) {
  if (!NOTIFY_EMAIL) return;
  var lines = Object.keys(data).map(function (k) { return k + ': ' + data[k]; });
  var who = data['Student name'] || data['Candidate'] || data['name'] || 'someone';
  MailApp.sendEmail({
    to: NOTIFY_EMAIL,
    subject: '[Website] ' + (data.type || 'Submission') + ' — ' + who,
    body: lines.join('\n') + '\n\n— sudhum.edu.pk'
  });
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
                       .setMimeType(ContentService.MimeType.JSON);
}
