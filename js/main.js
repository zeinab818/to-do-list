
'use strict';

let textInput = document.getElementById('taskInput');
let add = document.getElementById('addBtn');
let searchInput = document.getElementById('searchInput');
const taskDate = document.getElementById("taskDate").value;

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

  tasks[currentTab].push({ text: text, checked: false });
  saveTasks();
  display(tasks[currentTab]);
  textInput.value = '';
}

function display(arr) {
  let activeTabList = document.getElementById(`${currentTab}Tasks`);
  let cartoona = "";

  for (let i = 0; i < arr.length; i++) {
    const task = arr[i];
    cartoona += `
      <li class="text-dark list-group-item d-flex justify-content-between align-items-center" style="background-color: ${task.checked ? 'rgba(162, 89, 255, 0.3)' : ''}">
        <input type="checkbox" class="check" onchange="toggleChecked(${i})" ${task.checked ? 'checked' : ''} style="background-color: ${task.checked ? '#FF99CC' : ''}">
        <span class="task-text" style="text-decoration: ${task.checked ? 'line-through' : 'none'}">${task.text}</span>
        <div class="icons">
            <i class="fa-solid fa-pen-to-square ${task.checked ? 'afterCheck' : 'beforeCheck'}" onclick="updateForm(${i})"></i>
            <i class="fa-solid fa-xmark ${task.checked ? 'afterCheck' : 'beforeCheck'}" onclick="deleteTask(${i})"></i>
        </div>
      </li>`;
  }

  activeTabList.innerHTML = cartoona;
}

function toggleChecked(index) {
  tasks[currentTab][index].checked = !tasks[currentTab][index].checked;
  saveTasks();
  display(tasks[currentTab]);
}

function deleteTask(index) {
  tasks[currentTab].splice(index, 1);
  saveTasks();
  display(tasks[currentTab]);
}

function updateForm(index) {
  textInput.value = tasks[currentTab][index].text;
  currentUpdateIndex = index;
  add.innerText = "Update Task";
  add.onclick = getUpdate;
}

function getUpdate() {
  let updatedText = textInput.value.trim();
  if (updatedText === '') return;

  tasks[currentTab][currentUpdateIndex].text = updatedText;
  saveTasks();
  resetForm();
  display(tasks[currentTab]);
}

function resetForm() {
  textInput.value = '';
  currentUpdateIndex = null;
  add.innerText = "Add";
  add.onclick = addTask;
}

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

searchInput.addEventListener('input', function () {
  const searchValue = this.value.toLowerCase();
  const filtered = tasks[currentTab].filter(task => task.text.toLowerCase().includes(searchValue));
  display(filtered);
});

// Display current tab tasks on load
display(tasks[currentTab]);
