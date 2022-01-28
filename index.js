(function () {
  //creating tasks storage and saving it in localStorage
  let tasks = [];
  let tasksFromls = JSON.parse(localStorage.getItem('goals'));
  if (tasksFromls !== null) {
    tasks = tasksFromls;
  } else {
    localStorage.setItem('goals', JSON.stringify(tasks));
  }

  const objOfTasks = tasks.reduce((acc, task) => {
    acc[task._id] = task;
    return acc;
  }, {});

  // Elemnts UI
  const listContainer = document.querySelector('.list-group');
  const form = document.forms['addTask'];
  const inputBody = form.elements['body'];

  // Events
  renderAllTasks(objOfTasks);
  form.addEventListener('submit', onFormSubmitHandler);
  listContainer.addEventListener('click', onDeletehandler);
  listContainer.addEventListener('click', onDoneBtnHandler);
  listContainer.addEventListener('click', onChangeBtnHandler);
  listContainer.addEventListener('keypress', function (e) {
    if (e.target.tagName === 'INPUT' && e.key === 'Enter') {
      renderTasksAfterChange(e)
    }
  })
  listContainer.addEventListener('focusout', function (e) {
    if (e.target.tagName === 'INPUT') {
      renderTasksAfterChange(e);
    }
  })

  function renderAllTasks(tasksList) {
    const fragment = document.createDocumentFragment();
    Object.values(tasksList).forEach(task => {
      const li = listItemTemplate(task);
      fragment.appendChild(li);
    });
    listContainer.appendChild(fragment);
  }

  function listItemTemplate({ _id, body } = {}) {
    const li = document.createElement('li');
    li.classList.add(
      'list-group-item',
      'd-flex',
      'align-items-center',
      'flex-wrap',
      'mt-2',
    );
    li.setAttribute('data-task-id', _id);

    const changeBtn = document.createElement('button');
    changeBtn.textContent = 'done';
    changeBtn.classList.add("btn", "btn-secondary", "done-btn");

    const correctBtn = document.createElement('button');
    correctBtn.classList.add("btn", "btn-secondary", "change-btn", "ml-1");
    correctBtn.textContent = 'change';

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete task';
    deleteBtn.classList.add('btn', 'btn-danger', 'ml-auto', 'delete-btn');

    const article = document.createElement('p');
    article.textContent = body;
    article.classList.add('mt-2', 'w-100');

    li.appendChild(article);
    li.appendChild(changeBtn);
    li.appendChild(correctBtn);
    li.appendChild(deleteBtn);

    return li;
  }

  function onFormSubmitHandler(e) {
    e.preventDefault();
    const bodyValue = inputBody.value;

    if (!bodyValue) {
      alert('Please enter a body');
      return;
    }

    const task = createNewTask(bodyValue);
    const listItem = listItemTemplate(task);
    listContainer.insertAdjacentElement('afterbegin', listItem);
    form.reset();
  }

  function createNewTask(body) {
    const newTask = {
      body,
      _id: `task-${Math.random()}`,
      done: false,
    };

    objOfTasks[newTask._id] = newTask;
    tasks.unshift(newTask);
    localStorage.setItem('goals', JSON.stringify(tasks));

    return { ...newTask };
  }

  function deleteTask(id) {
    const { body } = objOfTasks[id];
    const isConfirm = confirm(`Are you sure you want to delete: ${body} ?`);
    if (!isConfirm) return isConfirm;
    delete objOfTasks[id];
    return isConfirm;
  }

  function deleteTaskFromHtml(confirmed, el, id) {
    if (!confirmed) return;
    let currentTaskIndex = tasksFromls.findIndex(el => el._id === id);
    tasktasksFromls = tasksFromls.splice(currentTaskIndex, 1);
    localStorage.setItem('goals', JSON.stringify(tasks));
    el.remove();
  }

  function onDeletehandler({ target }) {
    if (target.classList.contains('delete-btn')) {
      const parent = target.closest('[data-task-id]');
      const id = parent.dataset.taskId;
      const confirmed = deleteTask(id);
      deleteTaskFromHtml(confirmed, parent, id);
    }
  }

  function onDoneBtnHandler(e) {
    if (e.target.classList.contains("done-btn")) {
      const parent = e.target.closest('[data-task-id]');
      const id = parent.getAttribute('data-task-id');
      const currentIndexTask = tasksFromls.findIndex(el => el._id === id);
      if (tasksFromls[currentIndexTask].done === true) {
        tasksFromls[currentIndexTask].done = false;
        localStorage.setItem('goals', JSON.stringify(tasks));
      } else if (tasksFromls[currentIndexTask].done === false) {
        tasksFromls[currentIndexTask].done = true;
        localStorage.setItem('goals', JSON.stringify(tasks));
      }
      getStyle()
    }
  }

  function onChangeBtnHandler(e) {
    if (e.target.classList.contains("change-btn")) {
      const parent = e.target.closest('[data-task-id]');
      const childrens = Array.from(parent.children);
      const [text] = childrens;
      parent.innerHTML = "";
      const input = document.createElement("input");
      input.classList.add("width")
      input.value = text.textContent;
      parent.appendChild(input);

      input.focus();
    }
  }

  function renderTasksAfterChange(e) {
    const parent = e.target.closest('[data-task-id]');
    const id = parent.getAttribute('data-task-id');
    const input = parent.firstChild;
    const currentIndexTask = tasksFromls.findIndex(el => el._id === id);
    tasksFromls[currentIndexTask].body = input.value;
    localStorage.setItem('goals', JSON.stringify(tasks));
    listContainer.innerHTML = "";
    renderAllTasks(objOfTasks);
    getStyle();
  };

  // rendering "done" styles on tasks
  function getStyle() {
    const taskStyle = [...listContainer.children];

    for (let i = 0; i < tasksFromls.length; i++) {
      if (tasksFromls[i].done === true) {
        if (taskStyle[i].dataset.taskId === tasksFromls[i]._id) {
          taskStyle[i].classList.add("bg-color-done");
          taskStyle[i].firstChild.classList.add("text-through");
        }
      } else {
        if (taskStyle[i].dataset.taskId === tasksFromls[i]._id) {
          taskStyle[i].classList.remove("bg-color-done");
          taskStyle[i].firstChild.classList.remove("text-through");
        }
      }
    }
  }
  if (tasksFromls !== null) {
    getStyle();
  }
})();