function GojekParser() {

  // params
  sheetID = "Input your Google Spreadsheet ID here";
  label = "yourlabel";

  // use this Gmail filter
  // Matches: from:(postmaster@invoices.go-jek.com)
  // Do this: Skip Inbox, Apply label "yourlabel"
  
  // today date and yesterday date in yyyy-mm-dd (ISO, 7h difference with Indonesia)
  // my job run at 1AM-2AM which means that execution date is yesterday date
  
  d = new Date(); // yesterday
  d1 = new Date();
  d1.setDate(d1.getDate() + 1) // today
  d_string = d.toISOString().slice(0,10);
  d1_string = d1.toISOString().slice(0,10);

  var threads = GmailApp.search("before:" + d1_string + " after:" + d_string + " label:" + label);
  // var threads = GmailApp.search('subject:"Your trip with GOJEK on Sunday, 30 June 2019" OR subject:"Your trip with Gojek on Saturday, 25 April 2020" '); // testing
  // var threads = GmailApp.search("label:receipt-gojek (before:2020/05/26)"); // backfill
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
        bookingDate: content.match(/(?<=order details [A-z]+, )[0-9]{1,2} [A-z]+ [0-9]{2,4}/).toString().trim(),
        pickupTime: content.match(/(?<=pick up.*)[0-9:]+/).toString().trim(),
        dropoffTime: content.match(/(?<=destination.*)[0-9:]+/).toString().trim(),
        finalPrice: content.match(/(?<=Amount Paid\n\nRp).*/).toString().replace(".", "").trim(), 
        serviceType: content.match(/(?<=Thank you for using ).*(?=,)/).toString().trim(),
        driverName: content.match(/(?<=Your driver).*/).toString().trim(),
        bookingID: content.match(/(?<=order id: )[A-z0-9\-]+/).toString().trim(),
        from: content.match(/(?<=[0-9:]+\*.*\n\n)(.*\n){0,4}(?=.*drop)/)[0].toString().trim(),
        to: content.match(/(?<=[0-9:]+\*.*\n\n)(.*\n){0,4}(?=.*Driver Image)/)[0].toString().trim(),
        driverPrice: content.match(/(?<=Price.*Rp)[0-9.,]+/)[0].toString().replace(".", "").trim(),
        gopayDiscount: (content.match(/(?<=pay discount.*)[0-9.,]+/i) || [''])[0].toString().replace(".", "").trim(),
        voucherDiscount: (content.match(/(?<=voucher.*-rp)[0-9.,]+/i) || [''])[0].toString().replace(".", "").trim(),
        cashback: (content.match(/(?<=cashback voucher.*)[0-9.,]+/i) || [''])[0].toString().replace(".", "").trim(),
        duration: content.match(/(?<=Travel time )[0-9:]+/).toString().trim(),
        distance: content.match(/(?<=DISTANCE\s+)[0-9.,]+/)[0].toString().trim()
       }
      
      // store clean data on the first sheet tab
      sheet.appendRow([time, sender, subject,
                       emailData.bookingDate,
                       emailData.bookingID,
                       emailData.serviceType,
                       emailData.pickupTime,
                       emailData.dropoffTime,
                       emailData.duration,
                       emailData.from,
                       emailData.to,
                       emailData.distance,
                       emailData.driverPrice,
                       emailData.gopayDiscount,
                       emailData.voucherDiscount,
                       emailData.cashback,
                       emailData.finalPrice,
                       emailData.driverName
                      ])

      // store raw data on the second sheet tab
      sheet2.appendRow([time, sender, subject, content])
      
    }
  }
}
