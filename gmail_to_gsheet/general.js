// code docs
// https://developers.google.com/apps-script/reference/gmail/

// filter by date in search
// https://it.fitnyc.edu/2014/05/23/gmail-tip-filter-mail-older-than-a-certain-date/

// function
function GmailtoGsheet() {

  // params
  sheetID = "Input your Google Spreadsheet ID here";
  email = "Input email address here";
  
  // today date and yesterday date in yyyy-mm-dd (ISO, 7h difference with Indonesia)
  // my job run at 1AM-2AM which means that execution date is yesterday date
  d = new Date(); // yesterday
  d1 = new Date();
  d1.setDate(d1.getDate() + 1) // today
  d_string = d.toISOString().slice(0,10);
  d1_string = d1.toISOString().slice(0,10);

  var threads = GmailApp.search("before:" + d1_string + " after:" + d_string + " " + email);
  var threads = threads.slice(0).reverse();
  var sheet = SpreadsheetApp.openById(sheetID);

  for (var i = 0; i < threads.length; i++) {
    
    var messages = threads[i].getMessages();
    
    for (var j = 0; j < messages.length; j++) {
      
      var message = messages[j],
          subject = message.getSubject(),
          time = message.getDate(),
          sender = message.getFrom(),
          content = message.getPlainBody(),
          content_raw = message.getBody();
          
      sheet.appendRow([time, sender, subject, content_raw, content]);
      
    }
  }
}

