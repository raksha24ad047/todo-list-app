// ========================================
// TO-DO LIST APPLICATION
// ========================================


// ========================================
// 1. GET HTML ELEMENTS
// ========================================

const taskForm = document.getElementById("task-form");

const taskInput = document.getElementById("task-input");

const taskList = document.getElementById("task-list");

const emptyMessage = document.getElementById("empty-message");

const taskCount = document.getElementById("task-count");

const filterButtons = document.querySelectorAll(".filter-btn");


// ========================================
// 2. APPLICATION STATE
// ========================================

// Load tasks from localStorage.
// If there are no saved tasks, use an empty array.

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];


// Current filter

let currentFilter = "all";


// ========================================
// 3. SAVE TASKS TO LOCAL STORAGE
// ========================================

function saveTasks() {

    localStorage.setItem("tasks", JSON.stringify(tasks));

}


// ========================================
// 4. DISPLAY TASKS
// ========================================

function displayTasks() {

    // Clear the current list

    taskList.innerHTML = "";


    // Filter tasks based on selected filter

    let filteredTasks = tasks;

    if (currentFilter === "active") {

        filteredTasks = tasks.filter(function(task) {
            return !task.completed;
        });

    }

    if (currentFilter === "completed") {

        filteredTasks = tasks.filter(function(task) {
            return task.completed;
        });

    }


    // Show or hide empty message

    if (filteredTasks.length === 0) {

        emptyMessage.style.display = "block";

    } else {

        emptyMessage.style.display = "none";

    }


    // Create HTML elements for each task

    filteredTasks.forEach(function(task) {

        const listItem = document.createElement("li");

        listItem.className = "task-item";

        if (task.completed) {

            listItem.classList.add("completed");

        }


        // Checkbox

        const checkbox = document.createElement("input");

        checkbox.type = "checkbox";

        checkbox.className = "task-checkbox";

        checkbox.checked = task.completed;

        checkbox.dataset.id = task.id;


        // Task text

        const taskText = document.createElement("span");

        taskText.className = "task-text";

        taskText.textContent = task.text;


        // Action buttons container

        const actions = document.createElement("div");

        actions.className = "task-actions";


        // Edit button

        const editButton = document.createElement("button");

        editButton.type = "button";

        editButton.className = "edit-btn";

        editButton.textContent = "Edit";

        editButton.dataset.action = "edit";

        editButton.dataset.id = task.id;


        // Delete button

        const deleteButton = document.createElement("button");

        deleteButton.type = "button";

        deleteButton.className = "delete-btn";

        deleteButton.textContent = "Delete";

        deleteButton.dataset.action = "delete";

        deleteButton.dataset.id = task.id;


        // Put buttons inside actions

        actions.appendChild(editButton);

        actions.appendChild(deleteButton);


        // Put everything inside list item

        listItem.appendChild(checkbox);

        listItem.appendChild(taskText);

        listItem.appendChild(actions);


        // Put list item inside task list

        taskList.appendChild(listItem);

    });


    // Update task count

    updateTaskCount();

}


// ========================================
// 5. UPDATE TASK COUNT
// ========================================

function updateTaskCount() {

    const total = tasks.length;

    const completed = tasks.filter(function(task) {
        return task.completed;
    }).length;

    const active = total - completed;


    taskCount.textContent =
        total + " total • " +
        active + " active • " +
        completed + " completed";

}


// ========================================
// 6. CREATE TASK
// ========================================

taskForm.addEventListener("submit", function(event) {

    event.preventDefault();


    const taskText = taskInput.value.trim();


    // Don't create an empty task

    if (taskText === "") {

        return;

    }


    // Create new task object

    const newTask = {

        id: Date.now(),

        text: taskText,

        completed: false

    };


    // Add task to state

    tasks.push(newTask);


    // Save to localStorage

    saveTasks();


    // Display updated tasks

    displayTasks();


    // Clear input

    taskInput.value = "";

    taskInput.focus();

});


// ========================================
// 7. EVENT DELEGATION
// ========================================

taskList.addEventListener("click", function(event) {

    const action = event.target.dataset.action;

    const id = Number(event.target.dataset.id);


    // Edit task

    if (action === "edit") {

        editTask(id);

    }


    // Delete task

    if (action === "delete") {

        deleteTask(id);

    }

});


// ========================================
// 8. COMPLETE / UNCOMPLETE TASK
// ========================================

taskList.addEventListener("change", function(event) {

    if (!event.target.classList.contains("task-checkbox")) {

        return;

    }


    const id = Number(event.target.dataset.id);


    const task = tasks.find(function(task) {

        return task.id === id;

    });


    if (task) {

        task.completed = event.target.checked;

        saveTasks();

        displayTasks();

    }

});


// ========================================
// 9. UPDATE TASK
// ========================================

function editTask(id) {

    const task = tasks.find(function(task) {

        return task.id === id;

    });


    if (!task) {

        return;

    }


    const updatedText = prompt(
        "Edit your task:",
        task.text
    );


    if (updatedText === null) {

        return;

    }


    const trimmedText = updatedText.trim();


    if (trimmedText === "") {

        return;

    }


    task.text = trimmedText;


    saveTasks();

    displayTasks();

}


// ========================================
// 10. DELETE TASK
// ========================================

function deleteTask(id) {

    const confirmed = confirm(
        "Are you sure you want to delete this task?"
    );


    if (!confirmed) {

        return;

    }


    tasks = tasks.filter(function(task) {

        return task.id !== id;

    });


    saveTasks();

    displayTasks();

}


// ========================================
// 11. FILTER TASKS
// ========================================

filterButtons.forEach(function(button) {

    button.addEventListener("click", function() {

        // Remove active class from all buttons

        filterButtons.forEach(function(btn) {

            btn.classList.remove("active");

        });


        // Add active class to clicked button

        button.classList.add("active");


        // Change current filter

        currentFilter = button.dataset.filter;


        // Display filtered tasks

        displayTasks();

    });

});


// ========================================
// 12. INITIAL DISPLAY
// ========================================

displayTasks();
