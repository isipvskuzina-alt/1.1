
let tasks = [];
let selectedDate = '';
let editingId = null;

// DOM 
const dateInput = document.getElementById('dateInput');
const dateDisplay = document.getElementById('dateDisplay');
const dateTitle = document.getElementById('dateTitle');
const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const taskCount = document.getElementById('taskCount');
const datesList = document.getElementById('datesList');

// LOCALSTORAGE
function loadTasks() {
    const saved = localStorage.getItem('tasks');
    if (saved) {
        tasks = JSON.parse(saved);
    }
}

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

//ДАТЫ
function formatDate(dateStr) {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
}

function getTasksByDate(date) {
    return tasks.filter(t => t.date === date);
}

function getUniqueDates() {
    const dates = tasks.map(t => t.date);
    return [...new Set(dates)].sort();
}

// РЕНДЕРИНГ
function render() {
    // Показываем дату
    if (selectedDate) {
        const formatted = formatDate(selectedDate);
        dateDisplay.textContent = formatted;
        dateTitle.textContent = formatted;
    }

    // Получаем задачи на выбранную дату
    const dayTasks = getTasksByDate(selectedDate);
    taskCount.textContent = dayTasks.length;

    // Рисуем задачи
    if (dayTasks.length === 0) {
        taskList.innerHTML = '<li class="empty">Нет задач</li>';
    } else {
        taskList.innerHTML = dayTasks.map(task => `
            <li class="task-item ${task.completed ? 'completed' : ''}">
                <div class="task-left">
                    <input type="checkbox" ${task.completed ? 'checked' : ''} 
                        onchange="toggleTask('${task.id}')">
                    <span class="task-text">${task.text}</span>
                    <span class="task-time">${new Date(task.createdAt).toLocaleTimeString('ru-RU', {hour:'2-digit', minute:'2-digit'})}</span>
                </div>
                <div class="task-actions">
                    <button class="edit-btn" onclick="startEdit('${task.id}')">✏️</button>
                    <button class="delete-btn" onclick="deleteTask('${task.id}')">✖</button>
                </div>
            </li>
        `).join('');
    }

    // Рисуем другие даты
    const uniqueDates = getUniqueDates();
    if (uniqueDates.length === 0) {
        datesList.innerHTML = '<p style="color:#999;font-size:14px;">Нет задач на другие дни</p>';
    } else {
        datesList.innerHTML = uniqueDates.map(date => `
            <button class="date-btn ${date === selectedDate ? 'active' : ''}" 
                    onclick="selectDate('${date}')">
                ${formatDate(date)}
                <span class="count">(${getTasksByDate(date).length})</span>
            </button>
        `).join('');
    }
}

// ДОБАВИТЬ ЗАДАЧУ
function addTask() {
    const text = taskInput.value.trim();
    if (!text) return;

    if (editingId) {
        // Редактируем
        tasks = tasks.map(t => t.id === editingId ? { ...t, text } : t);
        editingId = null;
        addBtn.textContent = 'Добавить';
    } else {
        // Новая задача
        tasks.push({
            id: Date.now().toString(),
            text: text,
            date: selectedDate,
            completed: false,
            createdAt: new Date().toISOString()
        });
    }

    taskInput.value = '';
    saveTasks();
    render();
}

// УДАЛИТЬ
function deleteTask(id) {
    if (!confirm('Удалить задачу?')) return;
    tasks = tasks.filter(t => t.id !== id);
    saveTasks();
    render();
}

//ПЕРЕКЛЮЧИТЬ СТАТУС
function toggleTask(id) {
    tasks = tasks.map(t =>
        t.id === id ? { ...t, completed: !t.completed } : t
    );
    saveTasks();
    render();
}

// РЕДАКТИРОВАТЬ
function startEdit(id) {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    taskInput.value = task.text;
    editingId = id;
    addBtn.textContent = 'Сохранить';
    taskInput.focus();
}

// ВЫБРАТЬ ДАТУ
function selectDate(date) {
    selectedDate = date;
    dateInput.value = date;
    render();
}

// ИНИЦИАЛИЗАЦИЯ
function init() {
    loadTasks();
    
    // Сегодняшняя дата
    const today = new Date().toISOString().split('T')[0];
    selectedDate = today;
    dateInput.value = today;
    
    render();

    // События
    dateInput.addEventListener('change', function() {
        selectedDate = this.value;
        render();
    });

    taskInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') addTask();
    });

    addBtn.addEventListener('click', addTask);
}

// Запускаем
init();