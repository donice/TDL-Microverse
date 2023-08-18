class Task {
  constructor(description, completed, index) {
    this.description = description;
    this.completed = completed;
    this.index = index;
  }
}

function restoreOriginalIcons() {
  const iconDiv = document.querySelectorAll('.icon');
  iconDiv.forEach((icon) => {
    icon.innerHTML = '&#8942';
  });
}

function restoreBackgroundWhite() {
  const labelTasks = document.querySelectorAll('li');
  labelTasks.forEach((label) => {
    label.style['background-color'] = '#fff';
  });
}

function scrapeAndSave() {
  const tasksArray = [];
  const tasks = document.querySelectorAll('.task');
  tasks.forEach((label, index) => {
    const task = new Task(label.innerHTML, false, index + 1);
    tasksArray.push(task);
  });
  localStorage.removeItem('tasksList');
  localStorage.setItem('tasksList', JSON.stringify(tasksArray));
}

function setValueTextArea(textArea, labelTask) {
  labelTask.innerHTML = textArea.value;
  textArea.style.display = 'none';
  labelTask.style.display = 'block';
  // restore original icons
  restoreOriginalIcons();
  // change background to white
  restoreBackgroundWhite();
  // Save to local storage
  scrapeAndSave();
}

function setValueTextAreaAlls() {
  const textAreas = document.querySelectorAll('.textArea');
  textAreas.forEach((textArea) => {
    const parentDivTaskCont = textArea.parentNode;
    const labelTask = parentDivTaskCont.querySelector('.task');
    if (textArea.style.display === 'block') {
      setValueTextArea(textArea, labelTask);
    }
  });
}

export function addEventclearAllButton() {
  const buttonClearAll = document.querySelector('.clearAll');
  buttonClearAll.addEventListener('click', () => {
    setValueTextAreaAlls();
    const liElements = document.querySelectorAll('li');
    liElements.forEach((liElem) => {
      const checkboxElem = liElem.querySelector('.checkBoxesTasks');
      if (checkboxElem.checked) {
        liElem.remove();
      }
    });
    scrapeAndSave();
  });
}

export function manageBoxes(checkboxElem) {
  setValueTextAreaAlls();
  const parentDiv = checkboxElem.parentNode;
  const textChild = parentDiv.querySelector('.task');
  if (checkboxElem.checked) {
    const strike = textChild.getElementsByTagName('strike')[0];
    if (strike) {
      textChild.innerHTML = strike.innerHTML;
    }
    textChild.innerHTML = textChild.innerHTML.strike();
  } else {
    const strike = textChild.getElementsByTagName('strike')[0].innerHTML;
    textChild.innerHTML = strike;
    // restore visual
    const textArea = parentDiv.querySelector('.textArea');
    textArea.style.display = 'none';
    const labelText = parentDiv.querySelector('.task');
    labelText.style.display = 'block';
    // restore original icons
    restoreOriginalIcons();
    // change background to white
    restoreBackgroundWhite();
  }
}

export function addEventsCheckBoxes() {
  const checkBoxes = document.querySelectorAll('.checkBoxesTasks');
  checkBoxes.forEach((box) => {
    box.addEventListener('change', () => {
      manageBoxes(box);
    });
  });
}

function restoreDataTExtArea(lilElem, labelTask, textArea) {
  lilElem.style['background-color'] = '#fffee4';
  labelTask.style.display = 'none';
  textArea.style.display = 'block';
  textArea.value = labelTask.innerHTML;
  // Change Icon to Trash
  const iconDiv = lilElem.querySelector('.icon');
  iconDiv.innerHTML = '&#x1F5D1';
  textArea.focus();
  textArea.addEventListener('keypress', (event) => {
    if (event.keyCode === 13) {
      if (textArea.value !== '') {
        setValueTextArea(textArea, labelTask);
      }
    }
  });
}

export function deleteFromIcons() {
  const iconDiv = document.querySelectorAll('.icon');
  iconDiv.forEach((icon) => {
    icon.addEventListener('click', () => {
      const parentLi = icon.parentNode;
      const task = parentLi.querySelector('.task');
      if (task.style.display === 'none') {
        parentLi.remove();
        scrapeAndSave();
      }
    });
  });
}

export function manageLabels(labelTask) {
  setValueTextAreaAlls();
  const parentDivTaskCont = labelTask.parentNode;
  const liElem = parentDivTaskCont.parentNode;
  labelTask.style.display = 'none';
  const textAreaExist = parentDivTaskCont.querySelector('.textArea');
  restoreDataTExtArea(liElem, labelTask, textAreaExist);
}

export function addEventsToLabels() {
  const labelTasks = document.querySelectorAll('.task');
  labelTasks.forEach((label) => {
    label.addEventListener('click', () => {
      manageLabels(label);
    });
  });
}

export function createTask(tasksArray, obj) {
  let myindex;
  if (tasksArray.length === 0) {
    myindex = 0;
  } else {
    myindex = tasksArray.length;
  }

  const task = new Task(obj, false, myindex);
  tasksArray.push(task);

  const contenedor = document.querySelector('#contenedorTasks');
  contenedor.innerHTML += `<li>
      <div class='taskCont'>
        <input type='checkbox' class='checkBoxesTasks'>
        <div class='task'>${task.description}</div>
        <textarea class='textArea' maxlength='255'></textarea>
      </div>
      <div class='icon'>&#8942</div>
    </li>
    `;
  const inputText = document.querySelector('#inputNewTask');
  inputText.value = '';

  scrapeAndSave();
  addEventsToLabels();
  addEventsCheckBoxes();
  deleteFromIcons();
}

export function addEventsNewTasks(tasksArray) {
  const inputText = document.querySelector('#inputNewTask');
  inputText.addEventListener('focus', () => {
    setValueTextAreaAlls();
  });

  inputText.addEventListener('keypress', (event) => {
    if (event.keyCode === 13) {
      if (inputText.value !== '') {
        createTask(tasksArray, inputText.value);
      }
    }
  });
}
