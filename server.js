//Import necessary modules 
const express = require('express');   //Web framework for building APIS
const path = require('path');   //Helps with file paths
const fs = require('fs-extra');   //File handling (read/write JSON)
const crypto = require('crypto');   //For generating unique IDs

//Create express app and define port
const app = express();
const PORT = 3000;

//Middleware: serves static files from 'public' folder (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));
//Middleware: enables reading JSON data in request body
app.use(express.json());

//Define path to tasks.json file
const tasksFilePath = path.join(__dirname, 'data', 'tasks.json');

//GET endpoint: retrieves all tasks
app.get('/api/tasks', async (req, res) => {
    const tasks = await fs.readJson(tasksFilePath); //Read tasks.json file asyncron
    res.json(tasks); //Send tasks back as JSON to frontend
});

//POST endpoint: adds a new task
app.post('/api/tasks', async (req, res) => {
    const { text } = req.body; //Extract task text from request body
    
    if (!text || text.trim() === '') {
        return res.status(400).json({ error: 'Task text is required '})
    }

    const id = crypto.randomUUID(); //Generate a unique ID using crypto
    const tasks = await fs.readJson(tasksFilePath); //Read existing tasks from file
    
    //Create a new task object
    const newTask = {
        id: id,  //Unique ID
        text: text,  //Task text
        completed: false,  //Starts as not completed
    };

    tasks.push(newTask);  //Add the new task to the array
    await fs.writeJson(tasksFilePath, tasks);  //Save the updated array back to the file
    res.json(newTask);  //Send the new task back to frontend
});

//DELETE endpoint: deletes a task based on ID
app.delete('/api/tasks/:id', async (req, res) => {
    const { id } = req.params; //Extract ID from URL parameter (:id in the route)
    const tasks = await fs.readJson(tasksFilePath);  //Read all tasks
    const updatedTasks = tasks.filter(task => task.id !== id);  //Filter tasks, keep only thos where ID doesnt match
    
    await fs.writeJson(tasksFilePath, updatedTasks);  //Save the updated list (without deleted task)
    res.json({success: true}) //Send success message back
});

//PATCH endpoint: Toggles completed status on a task
app.patch('/api/tasks/:id', async (req, res) => {
    const { id } = req.params;  //Extract ID from URL
    const tasks = await fs.readJson(tasksFilePath);  //Read all tasks

    const task = tasks.find(task => task.id === id);  //Find specific task with the given ID
    
    //If task not found, return 404 error
    if (!task) {
        return res.status(404).json({ error: 'Task not found' });
    }

    //Toggle completed status (true -> false, false -> true)
    task.completed = !task.completed;
    await fs.writeJson(tasksFilePath, tasks);  //Save the updated list
    res.json(task);  //Send updated task back
})

//Start the server and listen on port 3000
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});