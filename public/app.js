//Fetches and displays all tasks from backend
async function seeTaskList() {
    const response = await fetch('/api/tasks');  //Send GET request to backend to fetch tasks
    const tasks = await response.json();  //Convert response to Javascript array
    
    const taskList = document.getElementById('taskList');  //Find the <ul> element in HTML
    taskList.innerHTML = ''; //Empty list first (remove existing <li> elements)
    
    //Loop through each task
    tasks.forEach(task => {
        const li = document.createElement('li');  //Create a <li> element for the task

        //Create <span> for the task text
        const textSpan = document.createElement('span');
        textSpan.textContent = task.text;

        //If task completed, strike through the text
        if (task.completed) {
            textSpan.style.textDecoration = 'line-through';
        }

        //Create delete button with trash can emoji
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = '🗑️';
        //Dynamic event listener (added when the button is created)
        deleteBtn.onclick = () => deleteTask(task.id);  //When clicked, call deleteTask with task's ID

        //Create check button with checkmark emoji
        const checkBtn = document.createElement('button');
        checkBtn.textContent = '✅';
        //Dynamic event listener (added when the button is created)
        checkBtn.onclick = () => toggleTask(task.id); //When clicked, toggle complted status

        //Add all elements to <li>
        li.appendChild(textSpan);  //The text
        li.appendChild(deleteBtn);  //Delete button
        li.appendChild(checkBtn);  //Check button

        //Add <li> to <ul>
        taskList.appendChild(li);
    });
    //Every tiem this function runs all tasks are recreated with freash event listeners
};

//Adds a new task
async function addTask() {
    const inputElement = document.getElementById('taskInput');  //Find hte input field
    const text = inputElement.value;  //Get the text from input field

    //If field is empty (or only whitespace), stop function
    if (text.trim() === '') {
        return;
    }

    //Send POST request to backend with task text
    await fetch('/api/tasks', {
        method: 'POST',  //HTTP methiod
        headers: { 'Content-Type': 'application/json' },  //Tell we're sending JSON
        body: JSON.stringify({ text: text })  //Convert data to JSON string
    });

    inputElement.value = '';  //Clear input field after adding
    seeTaskList();  //Update list so new task is displayed
};

//Deletes a task
async function deleteTask(id) {
    //Send DELETE request with task ID in URL
    await fetch(`/api/tasks/${id}`, {
        method: 'DELETE',
    });

    //Update list so deleted task disappears
    seeTaskList();
};

//Toggle completed status on a task
async function toggleTask(id) {
    //Send PATCH request to change completed status
    await fetch(`/api/tasks/${id}`, {
        method: 'PATCH',
    });

    //Update list so strikethrough text appears/disappears
    seeTaskList();
};

//Event listener: when "add task" button is clicked, call addTask function
//This button exists in HTMl from the start so we can add event listener after page loads
document.getElementById('addTask').addEventListener('click', addTask);

