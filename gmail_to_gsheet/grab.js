function GrabParser() {

  // params
  sheetID = "Input your Google Spreadsheet ID here";
  label = "yourlabel";

  // use this Gmail filter
  // Matches: from:(no-reply@grab.com) subject:(Your Grab E-Receipt)
  // Do this: Skip Inbox, Apply label "yourlabel"
  
  // today date and yesterday date in yyyy-mm-dd (ISO, 7h difference with Indonesia)
  // my job run at 1AM-2AM which means that execution date is yesterday date
  
  d = new Date(); // yesterday
  d1 = new Date();
  d1.setDate(d1.getDate() + 1) // today
  d_string = d.toISOString().slice(0,10);
  d1_string = d1.toISOString().slice(0,10);

  var threads = GmailApp.search("before:" + d1_string + " after:" + d_string + " label:" + label);
  // var threads = GmailApp.search("label:receipt-grab (after:2020/03/05 before:2020/03/16)"); // testing
  // var threads = GmailApp.search("label:receipt-grab (before:2020/05/23)"); // backfill
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
      
      if (content.match(/(?<=\[image: E-receipt\]\s+\n).*/).toString().trim().toLowerCase().includes("makan") ) {
        
        var emailData = {
          bookingTime: content.match(/(?<=WAKTU\n).*/).toString().trim(),
          finalPrice: content.match(/(?<=TOTAL\n).*(?=TANGGAL)/).toString().trim(), 
          serviceType: content.match(/(?<=Jenis Kendaraan:\n).*/).toString().trim(),
          driverName: content.match(/(?<=Pengemudi\s+\n).*/).toString().trim(),
          bookingID: content.match(/ADR-.*/).toString().trim(),
          from: content.match(/(?<=(Lokasi Penjemputan|Pesanan Dari):\n).*/)[0].toString().trim(),
          to: content.match(/(?<=(Lokasi Tujuan|Lokasi Pengantaran):\n).*/)[0].toString().trim(),
          driverPrice: content.match(/(?<=(Tarif Perjalanan|Biaya Pengiriman)).*/)[0].toString().trim(),
          discount: content.match(/(?<=(Rewards|Promo).*- )RP.*/)[0].toString().trim()
        }
        
      } else {
        var emailData = {
          bookingTime: content.match(/(?<=WAKTU\n).*/).toString().trim(),
          finalPrice: content.match(/(?<=TOTAL\n).*(?=TANGGAL)/).toString().trim(), 
          serviceType: content.match(/(?<=Jenis Kendaraan:\n).*/).toString().trim(),
          driverName: content.match(/(?<=Pengemudi\s+\n).*/).toString().trim(),
          bookingID: content.match(/ADR-.*/).toString().trim(),
          from: content.match(/(?<=(Lokasi Penjemputan|Pesanan Dari):\n).*/)[0].toString().trim(),
          to: content.match(/(?<=(Lokasi Tujuan|Lokasi Pengantaran):\n).*/)[0].toString().trim(),
          driverPrice: content.match(/(?<=(Tarif Perjalanan|Biaya Pengiriman)).*/)[0].toString().trim(),
          discount: content.match(/(?<=(Rewards|Promo).*- )RP.*/)[0].toString().trim()
        }
      }
      
      // store clean data on the first sheet tab
      sheet.appendRow([time, sender, subject, 
                       emailData.bookingTime, 
                       emailData.bookingID,
                       emailData.serviceType, 
                       emailData.from,
                       emailData.to,
                       emailData.driverPrice,
                       emailData.discount,
                       emailData.finalPrice, 
                       emailData.driverName
                      ]);

      // store raw data on the second sheet tab
      sheet2.appendRow([time, sender, subject, content])
      
    }
  }
}
