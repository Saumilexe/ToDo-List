import express from "express";
import bodyparser from "body-parser";

const app = express();
const port = "3000";
const taskArray = [];
const workArray =[];
const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

app.use(bodyparser.urlencoded({extended: true}));

app.use(express.static('public'));

app.get("/", (req, res) => {
    let date = new Date();
    let options = { month: 'long' };
    let month = date.toLocaleString('en-US', options); 
    let today = `${weekday[date.getDay()]}, ${month} ${date.getDate()} `;
    
    res.render("index.ejs", {taskArray: taskArray, today: today});
});

app.post("/submit", (req, res) => {
    taskArray.push(req.body["New Task"]);
    res.redirect("/");
});

app.post("/workSubmit", (req, res) => {
    workArray.push(req.body["New Work Task"]);
    res.redirect("/work");
});

app.get("/work", (req, res) => {
    res.render("work.ejs", {workArray: workArray });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});