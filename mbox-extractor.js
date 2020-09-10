/*jshint esversion: 6 */
const Mbox = require('node-mbox');
const MailParser  = require('mailparser').MailParser;
const mbox = new Mbox('./Payslips.mbox', { /* options */ });
const fs = require("fs");


function extractAttachments() {
  mbox.on('message', function(msg) {
    let parser = new MailParser({ streamAttachments : true });
    parser.on('data', data => {
      if (data.type === 'attachment') {
          data.content.pipe(fs.createWriteStream(data.filename));
          data.content.on('end', () => data.release());
      }
    });
    parser.write(msg);
    parser.end();
  });
}

extractAttachments();
