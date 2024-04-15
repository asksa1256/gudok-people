// 라이브러리 불러오기
const express = require("express");
const path = require("path");
const app = express();
const http = require("http").createServer(app);
const cron = require("node-cron");
const admin = require("firebase-admin");

// CORS 이슈 방지
app.use(express.json());
const cors = require("cors");
app.use(cors());

app.use(express.static(path.join(__dirname, "/build")));

// 메인페이지 접속 시 build 폴더의 index.html 전송
app.get("/", (res, req) => {
  req.sendFile(path.join(__dirname, "/build/index.html"));
});

app.get("*", (res, req) => {
  req.sendFile(path.join(__dirname, "/build/index.html"));
});

// 서버에서 설정한 시간에 웹 푸시 알림
// function sayHello() {
//   console.log("Hello, world!");
// }

// cron.schedule("* * * * *", function() {
//   sayHello();
// });
