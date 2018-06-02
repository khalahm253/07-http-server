'use strict';

const http = require('http');
const fs = require('fs');
const cowsay = require('cowsay');

const requestParser = require('./lib/parse-request.js');
const bodyParser = require('./lib/parse-body.js');

const requestHandler = (req,res) => {

  requestParser.execute(req);

  if (req.method === 'GET' && req.url.pathname === '/') {
    fs.readFile('./index.html', (err, data) => {
      if (err) throw err;

      let result = data.toString().replace(/Change Content/, req.url.query.that);

      res.setHeader('Content-Type', 'text/html');
      res.statusCode = 200;
      res.statusMessage = 'Ok';
      res.write(result);
      res.end();
      return;
    });
  }

  if (req.method === 'GET' && req.url.pathname === '/cowsay') {
    fs.readFile('./index.html', (err, data) => {
      if (err) throw err;

      let cowtalk = null;

      if (req.url.query.text) {
        cowtalk = cowsay.say({
          text: req.url.query.text
        });
      } else {
        cowtalk = cowsay.say({
          text: 'I need somtheing good to say.'
        });
      }

      let result = data.toString().replace(/Cowsay Content/, cowtalk);

      res.setHeader('Content-Type', 'text/html');
      res.statusCode = 200;
      res.statusMessage = 'Ok';
      res.write(result);
      res.end();
      return;
    });

  }


};

const app = http.createServer(requestHandler);

module.exports = {
  start: (port, callback) => app.listen(port, callback),
  stop: (callback) => app.close(callback)
}