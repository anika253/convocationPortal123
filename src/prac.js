/*nst express = require("express");
const app = express();
app.use(express.json());
const users = [];
function generateToken() {
  let options = [
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
    "i",
    "j",
    "k",
    "l",
    "m",
    "n",
    "o",
    "p",
    "q",
    "r",
    "s",
    "t",
    "u",
    "v",
    "w",
    "x",
    "y",
    "z",
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
  ];

  let token = "";
  l;
  for (let i = 0; i < 32; i++) {
    token += options[Math.floor(Math.random() * options.length())];
  }
  return token;
}

app.post("/signup", function (req, res) {
  const username = req.body.username;
  const password = req.body.password;
  if (users.find((user) => user.username == username)) {
    return res.json({
      message: "you are already signed up",
    });
  }

  if (username.length < 5) {
    return res.json({
      message: " 5 letters s xyada",
    });
  }
  users.push({
    username: username,
    password: password,
  });

  res.json({
    message: "you have signed up successfully",
  });
});

app.post("signin", function (req, res) {
  const username = req.body.username;
  const password = req.body.password;
  const foundUser = users.find(
    (user) => user.username == username && user.password == password
  );

  if (foundUser) {
    const token = generateToken();
    foundUser.token = token;
    return res.json({
        token: token,
        message : "you have signed in successfullu!",
    });
}
    else{
        return res.json({ return res.json({
            
        })

        })
    }
  }
});
*/
