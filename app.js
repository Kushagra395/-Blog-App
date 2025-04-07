const express = require("express");
const app = express();
const usersmodel = require("../minipro/model/user");
const postmodel = require("./model/post");
const cookieParser = require("cookie-parser");
const path = require("path");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const upload = require("./config/multerconfig");
const { console } = require("inspector");
 
 

app.set("view engine", "ejs");

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

  


app.get("/", (req, res) => {
   res.redirect("./create");
});

app.get("/create/upload", (req, res) => {
  res.render("profileupload");
}); 

app.get("/create", (req, res) => {
  res.render("index");
});
 
  
 

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.redirect("./login");
});

app.post("/login", async (req, res) => {
  let { username, email, password } = req.body;

  let user = await usersmodel.findOne({ email: email });
  if (!user) {
    res.status(500).send("User not found or password is not correct");
  }
  console.log(password);

  bcrypt.compare(password, user.password, function (err, result) {
    if (result) {
      let token = jwt.sign({ email: email, userid: user._id }, "hiddenkey");
      res.cookie("token", token);
     

      res.status(200).redirect("./profile");
    } else {
      res.redirect("/login");
    }
  });
});

app.post("/register", async (req, res) => {
  let { name, username, age, email, password } = req.body;

  let user = await usersmodel.findOne({ email: email });
  if (user) {
    res.status(400).send("user already exist");
  }
  console.log(password);

  const hashedPassword = await bcrypt.hash(password, 10);
  user = await usersmodel.create({
    name: name,
    username: username,
    age: age,
    email: email,
    password: hashedPassword,
  });

  // console.log(user._id)
  let token = jwt.sign({ email: user.email, userid: user._id }, "hiddenkey");

  res.cookie("token", token);
  res.send("register successfully");
});

app.get("/profile", isverifed, async (req, res) => {
  let user = await usersmodel
    .findOne({ email: req.user.email })
    .populate("post");

  res.render("profile", { user });
});

app.get("/edit/:id", isverifed, async (req, res) => {
   let post = await postmodel.findOne({ _id: req.params.id }).populate("user");

   res.render("edit", { post });
    
 });

 app.get("/delete/:id", isverifed, async (req, res) => {
  let post = await postmodel.findOneAndDelete({ _id: req.params.id });
  res.redirect("/profile");
   });
 
 app.post("/update/:id", isverifed, async (req, res) => {
   let post = await postmodel.findOneAndUpdate({ _id: req.params.id },{content:req.body.content});

   res.redirect("/profile");
    
 });


app.get("/like/:id", isverifed, async (req, res) => {
  let post = await postmodel.findOne({ _id: req.params.id }).populate("user");
  console.log(req.user.userid);
  if (post.likes.indexOf(req.user.userid) == -1) {
    post.likes.push(req.user.userid);
  } else {
    post.likes.splice(post.likes.indexOf(req.user.userid), 1); //usmai sai 1 delete karenge like count
  }
  await post.save();
  res.redirect("/profile");
});

app.post("/post", isverifed, async (req, res) => {
  let user = await usersmodel.findOne({ email: req.user.email });
  let { content } = req.body;
  let post = await postmodel.create({
    user: user._id,
    content: content,
  });
  user.post.push(post._id); //isse user ke post mai post id push karenge
  user.save();
  res.redirect("/profile");
});

function isverifed(req, res, next) {
  if (!req.cookies.token || req.cookies.token === "") {
    return res.redirect("/login");
  }
  try {
    let data = jwt.verify(req.cookies.token, "hiddenkey");
    req.user = {
      email: data.email,
      userid: data.userid,
    };
    next();
  } catch (err) {
    return res.redirect("/login");
  }
}

app.listen(3000, () => {
  console.log("server is running on port 3000");
});
