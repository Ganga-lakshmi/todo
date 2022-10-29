const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const TodoTask = require("./models/todotask");

dotenv.config();

app.use("/static" , express.static("public"));
app.use(express.urlencoded({ extended: true }));

//connection to db
//  mongoose.set("useFindAndModify", false);
// mongoose.connect(process.env.DB_CONNECT, 
//     { useNewUrlParser: true
//     }, () => {
// console.log("Connected to db!");

// app.listen(3000, () => console.log("Server running"));
// });

mongoose.connect(process.env.DB_CONNECT, {useNewUrlParser :true, 
    useUnifiedTopology:true
})
.then(() => app.listen(3000, () => console.log("arjun is running on port 3000")))
.catch((error) => 
    console.log(error));
//view engine
app.set("view engine", "ejs");

// app.get('/',(req, res) => {
//     res.render('todo.ejs');
//     });


// app.post('/',(req, res) => {
//         console.log(req.body);
//         });

app.get("/", (req, res) => {
    TodoTask.find({}, (err, tasks) => {
    res.render("todo.ejs", { todoTasks: tasks });
    });
    });



app.post('/',async (req, res) => {
    const todoTask = new TodoTask({
    content: req.body.content
    });
    try {
    await todoTask.save();
    res.redirect("/");
    } catch (err) {
    res.redirect("/");
    }
    });


//todo update
app.route("/edit/:id").get((req, res) => {
const id = req.params.id;
TodoTask.find({}, (err, tasks) => {
res.render("todoEdit.ejs", { todoTasks: tasks, idTask: id });
});
})
.post((req, res) => {
const id = req.params.id;
TodoTask.findByIdAndUpdate(id, { content: req.body.content }, err => {
if (err) return res.send(500, err);
res.redirect("/");
});
});

//delete
app.route("/remove/:id").get((req, res) => {
    const id = req.params.id;
    TodoTask.findByIdAndRemove(id, err => {
    if (err) return res.send(500, err);
    res.redirect("/");
    });
    });
