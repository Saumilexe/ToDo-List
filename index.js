import express from "express";
import bodyparser from "body-parser";
import mongoose, { Schema } from "mongoose";
import 'dotenv/config';

const uri = `mongodb+srv://${process.env.N_KEY}:${process.env.N_SECRET}@cluster0.unin1dn.mongodb.net`;
const app = express();
const port = process.env.port || 3000;

async function start() {
    try {
        await mongoose.connect(uri + '/newToDoListDB');
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
}
start();

app.use(bodyparser.urlencoded({extended: true}));

app.use(express.static('public'));

const taskListSchema = new Schema ({
    name: String
});
const Task = mongoose.model("task", taskListSchema);

const workListSchema = new Schema ({
    name: String
});
const WorkTask = mongoose.model("worktask", workListSchema);

const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

app.get("/", (req, res) => {
    let date = new Date();
    let options = { month: 'long' };
    let month = date.toLocaleString('en-US', options); 
    let today = `${weekday[date.getDay()]}, ${month} ${date.getDate()} `;
    
    async function getTask() {
        const taskArray = await Task.find({});
        if (!taskArray) {
            res.render("index.ejs", {taskArray: [], today: today});
        } else {
            res.render("index.ejs", {taskArray: taskArray, today: today})
        }
    }
    getTask();
});

app.get("/work", (req, res) => {
    async function getWorkTask () {
        const workArray = await WorkTask.find({});
        if (!workArray) {
            res.render("work.ejs", { workArray: []});
        } else {
            res.render("work.ejs", {workArray: workArray });
        }
    }
    getWorkTask();
});

app.post("/submit", (req, res) => {
    const newTask = new Task ({
        
        name: req.body["New Task"]
    });
    newTask.save();
    res.redirect("/");
});

app.post("/workSubmit", (req, res) => {
    const newWorkTask = new WorkTask ({
        name: req.body["New Work Task"]
    })
    newWorkTask.save();
    res.redirect("/work");
});

app.post("/delete", async (req, res) => {
    const checkedItemId = req.body.checkbox;
    await Task.findByIdAndDelete({_id: checkedItemId});
    res.redirect("/");
});

app.post("/workDelete", async (req, res) => {
    const checkedItemId = req.body.checkbox;
    await WorkTask.findByIdAndDelete({_id: checkedItemId});
    res.redirect("/work");
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});