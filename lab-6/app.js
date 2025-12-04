import Ajax from './ajax_lb.js';
const ajax = new Ajax({
    baseURL: 'https://jsonplaceholder.typicode.com',
    timeout: 5000,
});

const loadDataBtn = document.getElementById('loadDataBtn');
const loadUsersBtn = document.getElementById('loadUsersBtn');
const loadErrorBtn = document.getElementById('loadErrorBtn');
const resetBtn = document.getElementById('resetBtn');
const dataList = document.getElementById('dataList');
const userList = document.getElementById('userList');
const loader = document.getElementById('loader');
const errorMessage = document.getElementById('errorMessage');

function toggleLoader(isLoading) {
    if (isLoading) {
        loader.style.display = 'block';
    } else {
        loader.style.display = 'none';
    }
}

function showError(message) {
    errorMessage.textContent = message;
}

function resetView() {
    dataList.innerHTML = '';
    userList.innerHTML = '';
    errorMessage.textContent = '';
}

async function loadData() {
    toggleLoader(true);
    resetView();

    try {
        const data = await ajax.get('/posts');
        toggleLoader(false);
        data.forEach((item) => {
            const li = document.createElement('li');
            li.textContent = item.title;
            dataList.appendChild(li);
        });
    } catch (error) {
        toggleLoader(false);
        showError(`Błąd: ${error.message}`);
    }
}

async function loadUsers() {
    toggleLoader(true);
    resetView();

    try {
        const data = await ajax.get('/users');
        toggleLoader(false);
        data.forEach((user) => {
            const li = document.createElement('li');
            li.innerHTML = `<strong>${user.name}</strong><br> Email: ${user.email}`;
            userList.appendChild(li);
        });
    } catch (error) {
        toggleLoader(false);
        showError(`Błąd: ${error.message}`);
    }
}

async function loadErrorData() {
    toggleLoader(true);
    resetView();

    try {
        const data = await ajax.get('/invalid-endpoint');
        data.forEach((item) => {
            const li = document.createElement('li');
            li.textContent = item.title;
            dataList.appendChild(li);
        });
    } catch (error) {
        toggleLoader(false);
        showError(`Błąd: ${error.message}`);
    }
}

loadDataBtn.addEventListener('click', loadData);
loadUsersBtn.addEventListener('click', loadUsers);
loadErrorBtn.addEventListener('click', loadErrorData);
resetBtn.addEventListener('click', resetView);
