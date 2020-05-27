# gascript

Since March 2019, my IFTTT applet to automate data logging from Gmail to Google Spreadsheet has been stopped working. I found out the alternative by using Google App Script to automate this task.

Let's explore the power of Google App Script!

## Google Mail --> Google Sheet

The pipeline is straightforward:

1. Apply filter and create labels on specific mails
2. Create sheet with one or two tabs (the other tab is used to store raw data)
3. Use App Script on this git to parse mail data to a sheet by changing the parameter (sheet ID and mail label), schedule on daily basis

Currently, I have been scheduling three specific scripts to parse my mail data:

- Gojek parser
- Grab parser
- Mirae dividend parser

I use manual regex to parse the data. The drawback is that once the mail format changes, I also need to change the logic from the script.


