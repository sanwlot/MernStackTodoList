require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { Schema } = mongoose;

const taskSchema = new Schema({
  name: String,
  date: { type: Date, default: Date.now },
  completed: { type: Boolean, default: false },
});

const Task = mongoose.model("Task", taskSchema);

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB");
}

const app = express();

app.use(express.static("public"));
app.use(express.json());
app.use(cors());

app.get("/tasks", async (req, res) => {
  const tasks = await Task.find();
  res.send(tasks);
});

app.get("/tasks/:id", async (req, res) => {
  const id = req.params.id;
  const task = await Task.findById(id);
  res.json(task);
});

app.post("/tasks", async (req, res) => {
  const task = Task(req.body);
  try {
    const data = await task.save();
    res.send(data);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

app.patch("/tasks/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const data = await Task.findByIdAndUpdate(id, req.body, { new: true });
    if (!data) {
      return res.status(404).send({ error: "Task not found" });
    }
    res.send(data);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});
app.delete("/tasks/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const task = await Task.findOneAndDelete({ _id: id });
    res.status(201).json(task);
  } catch (err) {
    res.status(500).send(err);
  }
});

//  for client side routing
// app.use("*", (req, res) => {
//   res.sendFile(__dirname + "/dist/index.html");
// });

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
