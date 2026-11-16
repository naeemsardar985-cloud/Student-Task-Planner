const taskForm = document.getElementById("taskForm")
const taskInput = document.getElementById("taskInput");
const priorityInput = document.getElementById("priority");
const taskDate = document.getElementById("taskDate");
const taskList = document.getElementById("taskList");

const totalTasks = document.getElementById("totalTasks");
const completedTasks = document.getElementById("completedTasks");
const pendingTasks = document.getElementById("pendingTasks");

const searchInput = document.getElementById("searchInput");
const filterTasks = document.getElementById("filterTasks");

const progressFill = document.getElementById("progressFill");
const progressText = document.getElementById("progressText");

const submitBtn = document.getElementById("submitBtn");
const themeToggle = document.getElementById("themeToggle");
let tasks = [];

try {
    tasks = JSON.parse(localStorage.getItem("studentTasks")) || [];

    if (!Array.isArray(tasks)) {
        tasks = [];
    }
} catch (error) {
    tasks = [];
}

let editingTaskId = null;
function saveTasks() {

    localStorage.setItem(
        "studentTasks",
        JSON.stringify(tasks)
    );

}
function escapeHTML(value) {

    return String(value).replace(/[&<>"']/g, function(char) {

        const entities = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"
        };

        return entities[char];

    });

}
taskForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const title = taskInput.value.trim();
    const priority = priorityInput.value;
    const date = taskDate.value;

    if (title === "" || date === "") {
        alert("Please enter task name and date!");
        return;
    }

    if (editingTaskId !== null) {

        const task = tasks.find(
            item => item.id === editingTaskId
        );

        if (task) {
            task.title = title;
            task.priority = priority;
            task.date = date;
        }

        editingTaskId = null;
        submitBtn.textContent = "Add Task";

    } else {

        const newTask = {
            id: Date.now().toString() + Math.random().toString(16).slice(2),
            title: title,
            priority: priority,
            date: date,
            completed: false
        };

        tasks.push(newTask);

    }

    saveTasks();
    renderTasks();

    taskForm.reset();

});
function renderTasks() {

    taskList.innerHTML = "";

    const searchText = searchInput.value.toLowerCase();
    const filterValue = filterTasks.value;

    const filteredTasks = tasks.filter(function (task) {

        const matchesSearch = task.title
            .toLowerCase()
            .includes(searchText);

        const matchesFilter =
            filterValue === "All" ||
            (filterValue === "Completed" && task.completed) ||
            (filterValue === "Pending" && !task.completed);

        return matchesSearch && matchesFilter;

    });


    if (filteredTasks.length === 0) {

        const message = document.createElement("p");

        message.className = "empty-message";

        message.textContent = tasks.length === 0
            ? "No tasks yet. Add your first task!"
            : "No matching tasks found.";

        taskList.appendChild(message);

    }


    filteredTasks.forEach(function (task) {

        const card = document.createElement("div");

        card.className = "task-card";

        if (task.completed) {
            card.classList.add("completed-task");
        }

        const safeTitle = escapeHTML(task.title);
        const safePriority = escapeHTML(task.priority);
        const safeDate = escapeHTML(task.date);

        card.innerHTML = `

            <div class="task-info">

                <h3>${safeTitle}</h3>

                <p>
                    Priority:
                    <span class="priority-${safePriority.toLowerCase()}">
                        ${safePriority}
                    </span>
                </p>

                <p>Due Date: ${safeDate}</p>

                <p>
                    Status:
                    ${task.completed ? "Completed" : "Pending"}
                </p>

            </div>

            <div class="task-actions">

                <button class="complete-btn" data-action="complete">
                    ${task.completed ? "Undo" : "Complete"}
                </button>

                <button class="edit-btn" data-action="edit">
                    Edit
                </button>

                <button class="delete-btn" data-action="delete">
                    Delete
                </button>

            </div>

        `;

        card.querySelectorAll("button").forEach(function (button) {

            button.addEventListener("click", function () {

                handleTaskAction(task.id, button.dataset.action);

            });

        });

        taskList.appendChild(card);

    });


    updateStatistics();
}
function handleTaskAction(id, action) {

        const task = tasks.find(item => item.id === id);

        if (!task) return;


        if (action === "complete") {

            task.completed = !task.completed;

        } else if (action === "delete") {

            const confirmDelete = confirm(
                "Are you sure you want to delete this task?"
            );

            if (!confirmDelete) return;

            tasks = tasks.filter(item => item.id !== id);

            if (editingTaskId === id) {
                editingTaskId = null;
                taskForm.reset();
                submitBtn.textContent = "Add Task";
            }

        } else if (action === "edit") {

            editingTaskId = id;

            taskInput.value = task.title;
            priorityInput.value = task.priority;
            taskDate.value = task.date;

            submitBtn.textContent = "Update Task";

            taskInput.focus();

        }


        saveTasks();
        renderTasks();

    }

    function updateStatistics() {

        const total = tasks.length;

        const completed = tasks.filter(
            task => task.completed
        ).length;

        const pending = total - completed;

        totalTasks.textContent = total;

        completedTasks.textContent = completed;

        pendingTasks.textContent = pending;

        let percentage = 0;

        if (total > 0) {
            percentage = Math.round((completed / total) * 100);
        }

        progressFill.style.width = percentage + "%";

        progressText.textContent = percentage + "% Completed";

    }

    searchInput.addEventListener("input", function () {

        renderTasks();

    });
    filterTasks.addEventListener("change", function () {

        renderTasks();

    });

    themeToggle.addEventListener("click", function () {

        document.body.classList.toggle("dark-mode");

        const darkModeActive =
            document.body.classList.contains("dark-mode");

        themeToggle.textContent = darkModeActive
            ? "Light Mode"
            : "Dark Mode";

        localStorage.setItem(
            "plannerTheme",
            darkModeActive ? "dark" : "light"
        );

    });
    const savedTheme = localStorage.getItem("plannerTheme");

    if (savedTheme === "dark") {

        document.body.classList.add("dark-mode");

        themeToggle.textContent = "Light Mode";

    } else {

        themeToggle.textContent = "Dark Mode";

    }
    renderTasks();
    console.log("JavaScript Connected Successfully!");


