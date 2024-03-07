//window.localStorage.setItem("taskList", [])
console.log("Loaded page")
if (window.localStorage.getItem("taskList")) {
    let retrieval = window.localStorage.getItem("taskList");

    // Check if the retrieved value is not null before parsing
    if (retrieval) {
        console.log("Local storage data found");
        var task_list = JSON.parse(retrieval);
        updateUI();
    } else {
        console.log("Local storage data is null");
        var task_list = [];
    }
} else {
    console.log("No local storage data found");
    var task_list = [];
}
timer_time_in_seconds = 0



function addNewList() {
    new_list_name = document.getElementById("add-list-name-input").value
    //Add new list with list name as new_list_name
    const newList = {name: new_list_name, tasks:[]};
    task_list.push(newList);
}

function removeList() {
    list_to_remove = document.getElementById("rem-list-name-input").value    
    var idx = task_list.findIndex(list => list.name === list_to_remove);
    task_list.splice(idx,1) //remove that item
}

function addNewTask() {
    new_task_name = document.getElementById("add-task-name-input").value
    new_task_prio = document.getElementById("add-task-priority-input").value
    new_task_date = document.getElementById("add-task-date-input").value
    new_task_list = document.getElementById("add-task-list-input").value
    let task = {"name" : new_task_name,
                "priority" : new_task_prio,
                "date" : new_task_date,
                "list" : new_task_list             
    }
    var idx = task_list.findIndex(list => list.name === new_task_list);

    if (idx !== -1) {
        // Add the task to the tasks array of the corresponding list
        task_list[idx].tasks.push(task);
    }
}
function removeTask() {
    task_to_remove = document.getElementById("rem-task-name-input").value   
    from_list = document.getElementById("rem-task-list-input").value   
    var listidx = task_list.findIndex(list => list.name === from_list); //get idx of list

    var taskidx = task_list[listidx].tasks.findIndex(task => task.name === task_to_remove); //get idx of task
    task_list[listidx].tasks.splice(taskidx,1) //remove that item
}

function updateUI(Listchange=true) {

    //First, add the task list below
    const listsContainer = document.getElementById('lists-container');
    listsContainer.innerHTML = '';
  
    task_list.forEach((list, index) => { //for each item in the list
      const listElement = document.createElement('div');
      listElement.innerHTML = `<h2 class='font-bold'>${list.name}</h2><hr>`;
  
      const tasksElement = document.createElement('ul');
      tasksElement.classList = "text-center" 
      
      list.tasks.forEach(task => { //for each task in that list
        const taskItem = document.createElement('li');
        taskItem.classList = "flex justify-center"; // Use flex container to align items horizontally
    
        const priocircle = document.createElement('div');
        priocircle.innerHTML = `<span>${task.priority}</span>`;
        if (task.priority > 7) {
            priocircle.classList = "w-5 h-5 bg-red-500 inline text-center rounded-full mr-2 flex justify-center items-center my-auto"; // Add flex utilities for centering
        } else if (task.priority > 3) {
            priocircle.classList = "w-5 h-5 bg-orange-500 inline text-center rounded-full mr-2 flex justify-center items-center my-auto"; // Add mr-2 for margin-right
        } else {
            priocircle.classList = "w-5 h-5 bg-green-500 inline text-center rounded-full mr-2 flex justify-center items-center my-auto"; // Add mr-2 for margin-right
        }
        taskItem.appendChild(priocircle);
    
        const taskText = document.createElement('span'); // Use a <span> for the text content
        taskText.textContent = task.name;
        taskItem.appendChild(taskText);
    
        tasksElement.appendChild(taskItem);
    });
    
    listElement.classList = "text-center flex-item bg-pink-300 flex-grow w-full sm:w-1/2 md:w-1/5 lg:w-1/5 xl:w-1/5 text-white rounded-md border-2 border-pink-500";
    listElement.appendChild(tasksElement);
    listsContainer.appendChild(listElement);

    });

    //Next, refresh all lists
    const addTaskListContainer = document.getElementById('add-task-list-input');
    const remTaskListContainer = document.getElementById('rem-task-list-input');
    const remTaskNameContainer = document.getElementById('rem-task-name-input');
    const RemListNameContainer = document.getElementById('rem-list-name-input');
    addTaskListContainer.innerHTML = '';
    if (Listchange == true) {
        remTaskListContainer.innerHTML = '';
    }
    remTaskNameContainer.innerHTML = '';
    RemListNameContainer.innerHTML = '';
    //all lists are reset now.
  
    //Now handle the list selectors. RemTask will be a little more complicated and handled after.
    
    task_list.forEach((list, index) => { //for each item in the list, add an option to the list select bars
      const listElement = document.createElement('option');
      listElement.innerHTML = `${list.name}`;
      const listElement2 = document.createElement('option');
      listElement2.innerHTML = `${list.name}`;
      const listElement3 = document.createElement('option');
      listElement3.innerHTML = `${list.name}`;
      addTaskListContainer.appendChild(listElement);
      RemListNameContainer.appendChild(listElement2);
      if (Listchange == true) {
        remTaskListContainer.appendChild(listElement3);
      }
    });

    //Handle remtask below, it's dependent on selected list

    const selected_remtaskvalue = document.getElementById("rem-task-list-input").value
    selectedlist = task_list.find(list => list.name === selected_remtaskvalue)
    if (selectedlist && selectedlist.tasks) {
        selectedlist.tasks.forEach(task => { //for each task in that list
            const listElement4 = document.createElement('option');
            listElement4.innerHTML = `${task.name}`;
            remTaskNameContainer.appendChild(listElement4);
          });
    }

      updateLocalStorage()

}


function timerStart() {
    startTime = new Date();
    var timeRemaining = document.getElementById("timer").value;
    timeRemainingArray = timeRemaining.split(":");
    mins = timeRemainingArray[0];
    secs = timeRemainingArray[1];
    timer_time_in_seconds = parseInt(secs) + parseInt(mins) * 60;
    console.log("time left:" + timer_time_in_seconds);
    if (timer_time_in_seconds > 3600) {
        timer_time_in_seconds = 3600;
    }
    
    timerInterval = setInterval(updateTimerDisplay, 1000, timer_time_in_seconds); // update every second
}

function timerPause() {
    clearTimeout(timerEnd);
    clearTimeout(timerInterval);
    console.log("timer stopped!");
}

function timeIsUp() {
    console.log("timer done!");
    timerPause();
}

function setTimeLeft(diff) {
    timer_time_in_seconds -= diff; // Subtract the difference from the remaining time
    timerEnd = setTimeout(timeIsUp, timer_time_in_seconds * 1000);
}

function updateTimerDisplay() {
    setTimeLeft(1); // Subtract 1 second in each update
    console.log("time updated: " + timer_time_in_seconds);
    seconds = timer_time_in_seconds % 60;
    mins = Math.floor(timer_time_in_seconds / 60); // integer division
    document.getElementById("timer").value = mins + ":" + seconds;
}


function updateLocalStorage() {
    console.log("updating local storage...")
    //console.log("Before: "+ JSON.parse(task_list))
    window.localStorage.setItem("taskList", JSON.stringify(task_list));

    let retrieval = window.localStorage.getItem("taskList")
    task_list = JSON.parse(retrieval)
    //console.log("After: "+ JSON.parse(task_list))
}


//event listeners

const addListButton = document.getElementById('add-list-btn');
addListButton.addEventListener('click', () => {
    addNewList();
    updateUI();
});

const remListButton = document.getElementById('rem-list-btn');
remListButton.addEventListener('click', () => {
    removeList();
    updateUI();
});

const addTaskButton = document.getElementById('add-task-btn');
addTaskButton.addEventListener('click', () => {
    addNewTask();
    updateUI();
});

const RemTaskButton = document.getElementById('rem-task-btn');
RemTaskButton.addEventListener('click', () => {
    removeTask();
    updateUI();
});

const remListChanged = document.getElementById('rem-task-list-input');
remListChanged.addEventListener('change', () => {
    updateUI(false);
});

const timerStarted = document.getElementById('start-timer-btn');
timerStarted.addEventListener('click', () => {
    timerStart();
});

const timerPaused = document.getElementById('pause-timer-btn');
timerPaused.addEventListener('click', () => {
    timerPause();
});




//add pomodoro and AI?