function dividendParser() {
  
  // params
  sheetID = "Input your Google Spreadsheet ID here";
  label = "yourlabel";

  // use this Gmail filter
  // Matches: subject:{Deviden Dividen}
  // Do this: Skip Inbox, Apply label "yourlabel"
  
  // today date and yesterday date in yyyy-mm-dd (ISO, 7h difference with Indonesia)
  // my job run at 1AM-2AM which means that execution date is yesterday date
  
  d = new Date(); // yesterday
  d1 = new Date();
  d1.setDate(d1.getDate() + 1) // today
  d_string = d.toISOString().slice(0,10);
  d1_string = d1.toISOString().slice(0,10);

  var threads = GmailApp.search("before:" + d1_string + " after:" + d_string + " label:" + label);
  // var threads = GmailApp.search("label:receipt-dividen (before:2020/06/23)"); // backfill
  var threads = threads.slice(0).reverse();
  var sheet = SpreadsheetApp.openById(sheetID);
  var sheet2 = sheet.getSheets()[1]

  for (var i = 0; i < threads.length; i++) {
    
    var messages = threads[i].getMessages();
    
    for (var j = 0; j < messages.length; j++) {
      
      var message = messages[j],
          subject = message.getSubject(),
          time = message.getDate(),
          sender = message.getFrom(),
          content = message.getPlainBody(),
          content_raw = message.getBody();
 
      var emailData = {
        // amount: content.match(/(?<=Hak yang Diterima[\n\s]{0,3}Rp).*/)[0].toString().trim(),
        amount: content.match(/(?<=Hak yang Diterima(\s+|\n+)Rp).*/)[0].toString().trim(),
        recordingDate: content.match(/(?<=Recording Date(\s+|\n+))[A-z0-9]+.*/)[0].toString().trim(),
        dividend: content.match(/(?<=Dividen per Saham(\s+|\n+)Rp)[\s0-9\.]+/)[0].toString().trim(),
        share: content.match(/(?<=Jumlah yang Tercatat(\s+|\n+))[0-9]+/)[0].toString().trim(),
        paymentDate: content.match(/(?<=Tanggal Pembayaran(\s+|\n+))[0-9]+.*/)[0].toString().trim()
      }
      
      // store clean data on the first sheet tab
      sheet.appendRow([time, sender, subject,
                       emailData.paymentDate,
                       emailData.recordingDate,
                       emailData.dividend,
                       emailData.share,
                       emailData.amount
                      ])
      
      // store raw data on the second sheet tab
      sheet2.appendRow([time, sender, subject, content])
      
    }
  }
}
