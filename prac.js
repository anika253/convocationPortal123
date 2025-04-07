//asyn await >> promise-chain>>callback hell
function hello() {
  console.log("hello");
}
setTimeout(hello, 2000);

setTimeout(() => {
  console.log("hey");
}, 4000);
setTimeout(() => {});

//nesting

const fs = require("fs");
console.log("top of file");
fs.readFile("a.txt", "utf-8", function (err, data) {
  sendTheFinalHere(data);
});

function readFile(filename) {
  return new Promise(readTheFile);
}
/*
ile System Module Import:
Code fs module ko use kar raha hai jo file operations handle karta hai, jaise file ko read karna.

Callback-based Function readTheFile:
Ek function readTheFile define kiya gaya hai jo asynchronously file "a.txt" ka content read karta hai aur ek callback function ke zariye data ko pass karta hai.

Promise-based Function readFile:
readFile ek wrapper function hai jo ek Promise return karta hai aur asynchronous file-reading ko Promise-based approach mein convert karta hai.

Promise Instance Create Karna:
readFile ko call karke ek Promise banayi gayi hai jo tab resolve hoti hai jab file ka content read ho jata hai.

Callback on Promise Resolution:
Jab Promise resolve hoti hai (file ka content successfully read ho jata hai), tab .then(callback) ke zariye content ko console mein print kar diya jata hai.

Overall:
Yeh code ek callback-based asynchronous operation ko Promise-based model mein convert kar raha hai. File ka content read hota hai aur Promise resolve hone ke baad callback function us content ko handle karta hai.


*/

function readTheFile(resolve) {
  setTimeout(function () {
    console.log("done");
    resolve();
  }, 2000);
}
const fs = require("fs");
function readThefile(sendTheFinalValueHere) {
  fs.readFile("a.txt", "utf-8", function (err, data) {
    sendTheFinalValueHere(data);
  });
}
function readFile(filename) {
  return new Promise(readTheFile);
}
const p = readFile();
function callback() {
  console.log("iam done");
}
p.then(callback);

function doasync(resolve) {
  setTimeout(resolve, 2000);
}
const ppi = new Promise(doasync);
function callback() {
  console.log("3 sec have passed dudude");
}
ppi.then(callback);
// async cortex-32

/// APNA COLLEGE ASYNC
for (let i = 0; i < 5; i++) {
  let str = "";
  for (let j = 0; j < 5; j++) {
    str = str + j;
  }
  console.log(i, str);
}
// CALLBACK HELL

function getData(dataId) {
  console.log("data", dataId);
}

function etData(dataId) {
  setTimeout(() => {
    console.log("data", dataId);
  }, 5000);
}

// data1->data2->data3 should be the order of data;
async function database() {}

function getData(dataId, getNextData) {
  setTimeout(() => {
    console.log("data", dataId);
    if (getNextData) {
      getNextData();
    }
  }, 2000);
}
getData(1, () => {
  getData(2, () => {
    getData(3, () => {});
  });
});

// using it  using promsis;

function geData2(dataId, getNextData) {
  return new Promise();
}

getData2.then(() => {
  getData2().then;
});
// let promise = new Promise((resolve, reject)=>{

let x = new Promise((resolve, reject) => {
  console.log("hii iam a promise");
  reject("some err occured");
});

let y = new Promise((resolve, reject) => {
  console.log("youo");
  resolve("success");
});
//promise.then((res)=>{});
// promise.catch((Err)=>{ })

const z = () => {
  return new Promise((resolve, reject) => {
    console.log("iam a promise");
    resolve("success");
  });
};
let promise = z();
promise.then(() => {
  console.log("yes, fulfiled");
});
promise.catch(() => {
  console.log("khtam");
});

//async-await

async function hello() {
  console.log("hello");
}
// returns a promise by default here

function api() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log("data");
      resolve(200);
    }, 2000);
  });
}

async function getWeatherData() {
  await api;
  console.log("hii");
  await api();
  console.log("hello");
}

// CALLBACK HELL ->PROMISES ->LAST

const URL = "https://cat-fact.herokuapp.com/facts";
let pro = fetch(URL);
console.log(pro);

const getFacts = async () => {
  let response = await fetch(URL);
  console.log(response);
  console.log(response.status);
};
