import http from 'http';
import fs from 'fs';
import path from 'path';
import {TEXT_PLAIN_UTF8} from "../data/statics";

const host = '127.0.0.1';
const port = Number(process.env.PORT) || 3003;

const usersFilePath = path.join(process.cwd(), 'data', 'users.json');

const server = http.createServer((req, res) => {
  const url = new URL(req.url ?? '/', `http://${host}`);
  const params = url.searchParams;

  const hasHello = params.has('hello');
  const hasUsers = params.has('users');
  const paramsCount = Array.from(params.keys()).length;

  if (paramsCount === 0) {
    res.statusCode = 200;
    res.setHeader(...TEXT_PLAIN_UTF8);
    res.end('Hello, World!');
    return;
  }

  if (hasHello && paramsCount === 1) {
    const name = params.get('hello')?.trim() ?? '';
    if (!name) {
      res.statusCode = 400;
      res.setHeader(...TEXT_PLAIN_UTF8);
      res.end('Enter a name');
      return;
    }
    res.statusCode = 200;
    res.setHeader(...TEXT_PLAIN_UTF8);
    res.end(`Hello, ${name}.`);
    return;
  }

  if (hasUsers && paramsCount === 1) {
    fs.readFile(usersFilePath, 'utf8', (err, data) => {
      if (err) {
        res.statusCode = 500;
        res.end();
        return;
      }
      res.statusCode = 200;
      res.setHeader(...TEXT_PLAIN_UTF8);
      res.end(data);
    });
    return;
  }

  res.statusCode = 500;
  res.end();
});

server.listen(port, host, () => {
  console.log(`Server is running at http://${host}:${port}`);
});