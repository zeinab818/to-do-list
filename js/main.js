'use strict';

let textInput = document.getElementById('taskInput');
let add = document.getElementById('addBtn');
let  searchInput= document.getElementById('searchInput');

let tasks = {
    today: [],
    week: [],
    month: []
};

let currentTab = 'today';
let currentUpdateIndex = null;

// Load from localStorage
if (localStorage.getItem('tasks')) {
    const stored = JSON.parse(localStorage.getItem('tasks'));
    if (stored.today && stored.week && stored.month) {
        tasks = stored;
    }
}
else {
    tasks = { today: [], week: [], month: [] };
}

// Handle tab switching
document.querySelectorAll('.nav-link').forEach(btn => {
    btn.addEventListener('click', () => {
        currentTab = btn.dataset.filter;
        display(tasks[currentTab]);
        resetForm();
    });
});

function addTask() {
    let text = textInput.value.trim();
    if (text === '') return;

    tasks[currentTab].push(text);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    display(tasks[currentTab]);
    textInput.value = '';
}

function display(arr) {
    let activeTabList = document.getElementById(`${currentTab}Tasks`);
 
    let cartoona = "";

    for (let i = 0; i < arr.length; i++) {
        cartoona += `
        <li class="text-dark list-group-item d-flex justify-content-between align-items-center">
            ${arr[i]}
            <div class="icons">
                <i class="fa-solid fa-pen-to-square" onclick="updateForm(${i})"></i>
                <i class="fa-solid fa-xmark" onclick="deleteTask(${i})"></i>
            </div>
        </li>`;
    }

    activeTabList.innerHTML = cartoona;
}

function deleteTask(index) {
    tasks[currentTab].splice(index, 1);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    display(tasks[currentTab]);
}

function updateForm(index) {
    textInput.value = tasks[currentTab][index];
    currentUpdateIndex = index;
    add.innerText = "Update Task";
    add.onclick = getUpdate;
}

function getUpdate() {
    let updatedText = textInput.value.trim();
    if (updatedText === '') return;

    tasks[currentTab][currentUpdateIndex] = updatedText;
    localStorage.setItem('tasks', JSON.stringify(tasks));
    resetForm();
    display(tasks[currentTab]);
}

function resetForm() {
    textInput.value = '';
    currentUpdateIndex = null;
    add.innerText = "Add";
    add.onclick = addTask;
}

searchInput.addEventListener('input', function () {
    const searchValue = this.value.toLowerCase();
    const filtered = tasks[currentTab].filter(task => task.toLowerCase().includes(searchValue));

    display(filtered);
});

// Display current tab tasks on load
display(tasks[currentTab]);

