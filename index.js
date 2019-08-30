const express = require('express');
const chalk = require('chalk');
const indentString = require('indent-string');

const { port, endpoints } = require('./.snitch.json');

const app = express();

const HTTP_METHODS = [
  'GET',
  'POST',
  'PUT',
  'OPTIONS',
  'PATCH',
  'HEAD',
  'DELETE',
  'CONNECT',
  'TRACE'
];

const formatHeaders = headers => {
  return Object.keys(headers)
    .map(name => indentString(chalk`{yellow ${name}:}{blue ${headers[name]}}`, 4))
    .join('\n');
};

const formatQS = qs => {
  return Object.keys(qs)
    .map(name => indentString(chalk`{yellow ${name}:}{blue ${qs[name]}}`, 4))
    .join('\n');
};

const formatOutput = req => {
  return chalk`;
  Headers:
${formatHeaders(req.headers)}
  QueryString:
${formatQS(req.query)}
  Body:
${req.body}
`;
};

endpoints.forEach(({ path }) => {
  HTTP_METHODS.forEach(method => {
    app[method.toLowerCase()](path, (req, res) => {
      console.log(formatOutput(req));
      res.status(200).send(formatOutput(req));
    });
  });
});

app.listen(port, () => console.log(`Snitch ready on ${port}!`));
