function addNewList(id = -1) { //Add a new list
    if (id == -1) { //Create a list if one isn't provided (one will be provided if it's modified.)
        random_id = uid(16)
    } else {
        random_id = id
    }
    //set parameters from input
    new_list_name = document.getElementById("add-list-name-input").value

    //Add new list with given parameters and ID

    const newList = {name: new_list_name, tasks:[], "id" : random_id};
    task_list.push(newList);
}

function removeList(id = -1) { //Remove a list
    if (id == -1) { // if list ID not provided, we will get the ID from the user input and remove that list.
        list_to_remove = document.getElementById("rem-list-name-input").value //This gives list ID 
        var idx = task_list.findIndex(list => list.id == list_to_remove); 
        task_list.splice(idx,1)
    } else { //If list ID is provided (from modify function) remove that specific list.
        var idx = task_list.findIndex(list => list.id == id); 
        task_list.splice(idx,1)
    }
}

function addNewTask(id = -1, listid = -1, prevTask) { //Add a new task to a list
    //Get parameters from user input
    new_task_name = document.getElementById("add-task-name-input").value
    new_task_prio = document.getElementById("add-task-priority-input").value
    new_task_date = document.getElementById("add-task-date-input").value // due date
    new_task_recur = document.getElementById("add-task-recur-input").value 
    new_task_completed_date = document.getElementById("add-task-completed-input").value 
    new_task_note = document.getElementById("add-task-comment-input").value
    is_completed = document.getElementById("completed-bool").checked
    is_recurring = document.getElementById("recurring-bool").checked
    is_persistent = document.getElementById("persistent-bool").checked
    new_task_color = document.getElementById("add-task-color-input").value
    is_task = document.getElementById("task-bool").checked
    if (is_task && listid == -1) { //if its a task and list ID isn't given, set the list and ID to the to-do list ID
        new_task_list_id = task_list.find(list => list.name == 'to-do list').id
        new_task_list = 'to-do list'
    } else if (listid == -1) {
        new_task_list_id = document.getElementById("add-task-list-input").value
        new_task_list = task_list.find(list => list.id == new_task_list_id).name
    } else {// list ID is given - in case of moving item
        new_task_list_id = listid
        new_task_list = prevTask.list
        new_task_name = prevTask.name
        new_task_prio = prevTask.priority
        new_task_date = prevTask.date
        new_task_recur = prevTask.recur_days
        new_task_completed_date = prevTask.completed_date
        new_task_note = prevTask.note
        is_completed = prevTask.is_completed
        is_recurring = prevTask.is_recurring
        is_persistent = prevTask.is_persistent
        new_task_color = prevTask.color
    }

    if (id == -1) { //Generate ID if not provided. Otherwise (in case of modification) set ID to provided ID
        random_id = uid(16)
    } else {
        random_id = id
    }

    //set task parameters

    let task = {"id" : random_id, //both
                "name" : new_task_name, //both
                "priority" : new_task_prio, //both - priority for to-do, rating for list
                "date" : new_task_date, //todo only; due date
                "list" : new_task_list, //list only
                "listid" : new_task_list_id, //list only
                "color" : new_task_color, //task only
                "recur_days" : new_task_recur, //todo only
                "completed_date": new_task_completed_date, //both
                "note":new_task_note, //both
                "is_completed": is_completed, //both
                "is_recurring": is_recurring, //todo only
                "is_persistent": is_persistent,  //todo only           
    }

    //Find index of the list inside the task_list function

    var idx = task_list.findIndex(list => list.id == new_task_list_id);
    
    //console.log("Adding task: " + JSON.stringify(task))
    if (idx !== -1) { // If there were no errors with ID generation, add the list to the task_list array
        task_list[idx].tasks.push(task);
    }
}

function removeTask(id = -1,listid = -1) { //Remove a task from a list
    console.log("removing ID: " + id + " and list ID: " + listid)
    if (id == -1 && listid == -1) { // If ID is not provided, we get the task ID and the list ID then remove that task.
        task_to_remove = document.getElementById("rem-task-name-input").value   
        from_list = document.getElementById("rem-task-list-input").value   //This gives ID
        var listidx = task_list.findIndex(list => list.id == from_list); //get idx of list
    
        var taskidx = task_list[listidx].tasks.findIndex(task => task.id == task_to_remove); //get idx of task
        task_list[listidx].tasks.splice(taskidx,1) //remove that item

    } else if (listid == -1) { // If ID is provided (as in a modification), we get the list ID then remove that task.
        task = getItemById(id)
        listid = task.listid
        var listidx = task_list.findIndex(list => list.id == selected.listid); //get idx of list
        var taskidx = task_list[listidx].tasks.findIndex(task => task.id == id); //get idx of task
        task_list[listidx].tasks.splice(taskidx,1) //remove that item
    } else {
        var listidx = task_list.findIndex(list => list.id == listid); //get idx of list
        var taskidx = task_list[listidx].tasks.findIndex(task => task.id == id); //get idx of task
        task_list[listidx].tasks.splice(taskidx,1) //remove that item
    }

}

function updateUI(Listchange=true) { //Update the lists and tasks

    //First, add the task list below
    const listsContainer = document.getElementById('lists-container');
    listsContainer.innerHTML = '';
    document.getElementById('to-do-list-div').innerHTML = ''
    task_list.forEach((list, index) => { //for each list in the array, set the list div/sort buttons etc.

        if (list.id == task_list.find(list => list.name == 'to-do list').id) { //if the list in question is the to-do list specifically, we will set that page here.
            if (currentTDLPage == 0) {
                //set as to-do list (default)
                document.getElementById("todolist-container-title").innerHTML = "Today's To-Do List"
                const TDLElement = document.createElement('ul');
                TDLElement.classList = "text-center w-full" 
                
                list.tasks.forEach(task => { //for each task in the to-do list, create div and content area.
                    if (((task.date == new Date().toLocaleDateString("en-CA", {year:"numeric", month: "2-digit", day:"2-digit"})) && !task.is_completed) || (task.is_persistent && (task.date < new Date().toLocaleDateString("en-CA", {year:"numeric", month: "2-digit", day:"2-digit"})) && !task.is_completed)) {
                        //If it's the same date or it's persistent from an older date, and not completed, it goes here.
                        const TDLItem = document.createElement('li');
                        TDLItem.title = `${task.name} (${task.priority}) - ${task.is_completed ?  ("Completed: " + task.completed_date) : ("Due "+task.date)}.` 
                        TDLItem.title += `${task.note}. ${task.is_recurring ? "recurring every: "+task.recur_days+" days." : ""} - ${task.is_persistent ? "Persistent" : ""} (${task.id})` //update for context menu on hover. Esp. comments
                        
                        TDLItem.classList = "hover:border-2 hover:rounded-md hover:bg-pink-400 hover:border-pink-500 flex justify-center"; // Use flex container to align items horizontally
                        TDLItem.id = `${task.id}-TDL-item-div`
                        const priocircle = document.createElement('div');
                        priocircle.innerHTML = `<span>${task.priority}</span>`;
                        if (task.priority > 7) {
                            priocircle.classList = "bg-red-500"; // Add flex utilities for centering
                        } else if (task.priority > 3) {
                            priocircle.classList = "bg-orange-500"; // Add mr-2 for margin-right
                        } else {
                            priocircle.classList = "bg-green-500"; // Add mr-2 for margin-right
                        }
                        priocircle.classList += " w-5 pointer-events-none h-5 inline text-center rounded-full mr-2 flex justify-center items-center my-auto"
                        TDLItem.appendChild(priocircle);
                        const TDLText = document.createElement('span'); // Use a <span> for the text content
                        TDLText.classList = 'pointer-events-none mr-3 '
                        TDLText.textContent = task.name;
                        TDLText.style.color = task.color;
                        TDLItem.appendChild(TDLText);

                        if (task.is_persistent) {
                            const persistentCircle = document.createElement('div');
                            persistentCircle.innerHTML = `<span>P</span>`;
                            persistentCircle.classList += "bg-violet-400 w-5 pointer-events-none h-5 inline text-center rounded-full mr-2 flex justify-center items-center my-auto"
                            TDLItem.appendChild(persistentCircle);
                        }
                        if (task.is_recurring) {
                            const persistentCircle = document.createElement('div');
                            persistentCircle.innerHTML = `<span>R${task.recur_days}</span>`;
                            persistentCircle.classList += "bg-rose-400 text-xs w-5 pointer-events-none h-5 inline text-center rounded-full mr-2 flex justify-center items-center my-auto"
                            TDLItem.appendChild(persistentCircle);
                        }

                        const completedlabel = document.createElement('label') //add completed checkbox
                        const completedCheck = document.createElement('input')
                        completedCheck.type = "checkbox"
                        completedCheck.checked = false
                        completedCheck.classList = "sr-only peer"
                        completedCheck.id =  `${task.id}-TDL-completed-checkbox`
                        const completedCheckDiv = document.createElement('div')
                        completedCheckDiv.classList = "relative w-10 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-3 peer-focus:ring-pink-300 dark:peer-focus:ring-pink-800 rounded-full peer dark:bg-pink-900 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[3px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-pink-600"
                        completedlabel.appendChild(completedCheck)
                        completedlabel.appendChild(completedCheckDiv)
                        completedlabel.classList = 'ml-auto'
                        TDLItem.appendChild(completedlabel)
                        

                        TDLElement.appendChild(TDLItem);
                        document.getElementById('to-do-list-div').appendChild(TDLElement)
                    }
                });
            } else if (currentTDLPage == 1) {
                //set as upcoming to-do
                document.getElementById("todolist-container-title").innerHTML = 'Upcoming'
                const TDLElement = document.createElement('ul');
                TDLElement.classList = "text-center w-full" 
                
                list.tasks.forEach(task => { //for each task in the to-do list, create div and content area.
                    if (task.date > (new Date().toLocaleDateString("en-CA", {year:"numeric", month: "2-digit", day:"2-digit"})) && !task.is_completed) {
                        //If the date is greater and it's not completed, it goes here.
                        const TDLItem = document.createElement('li');

                        TDLItem.title = `${task.name} (${task.priority}) - ${task.is_completed ?  ("Completed: " + task.completed_date) : ("Due "+task.date)}.` 
                        TDLItem.title += `${task.note}. ${task.is_recurring ? "recurring every: "+task.recur_days+" days." : ""} - ${task.is_persistent ? "Persistent" : ""} (${task.id})` //update for context menu on hover. Esp. comments
                        
                        TDLItem.classList = "hover:border-2 hover:rounded-md hover:bg-pink-400 hover:border-pink-500 flex justify-center"; // Use flex container to align items horizontally
                        TDLItem.id = `${task.id}-TDL-item-div`
                        const priocircle = document.createElement('div');
                        priocircle.innerHTML = `<span>${task.priority}</span>`;
                        if (task.priority > 7) {
                            priocircle.classList = "bg-red-500";
                        } else if (task.priority > 3) {
                            priocircle.classList = "bg-orange-500";
                        } else {
                            priocircle.classList = "bg-green-500";
                        }
                        priocircle.classList += " w-5 pointer-events-none h-5 inline text-center rounded-full mr-2 flex justify-center items-center my-auto"
                        TDLItem.appendChild(priocircle);
                    
                        const TDLText = document.createElement('span');
                        TDLText.classList = 'pointer-events-none mr-3'
                        TDLText.textContent = task.name + " - ";
                        TDLText.style.color = task.color;
                        TDLItem.appendChild(TDLText);
                        
                        
                        const TDLTextDate = document.createElement('span');
                        TDLTextDate.classList = 'pointer-events-none mr-3 text-gray-500 font-normal italic'
                        TDLTextDate.textContent = task.date;
                        TDLItem.appendChild(TDLTextDate);
                    
                        if (task.is_persistent) { //add persistence circle
                            const persistentCircle = document.createElement('div');
                            persistentCircle.innerHTML = `<span>P</span>`;
                            persistentCircle.classList += "bg-violet-400 w-5 pointer-events-none h-5 inline text-center rounded-full mr-2 flex justify-center items-center my-auto"
                            TDLItem.appendChild(persistentCircle);
                        }
                        if (task.is_recurring) { //add recurring circle
                            const persistentCircle = document.createElement('div');
                            persistentCircle.innerHTML = `<span>R${task.recur_days}</span>`;
                            persistentCircle.classList += "bg-rose-400 text-xs w-5 pointer-events-none h-5 inline text-center rounded-full mr-2 flex justify-center items-center my-auto"
                            TDLItem.appendChild(persistentCircle);
                        }

                        const completedlabel = document.createElement('label') //add completed checkbox
                        const completedCheck = document.createElement('input')
                        completedCheck.type = "checkbox"
                        completedCheck.checked = false
                        completedCheck.classList = "sr-only peer"
                        completedCheck.id =  `${task.id}-TDL-completed-checkbox`
                        const completedCheckDiv = document.createElement('div')
                        completedCheckDiv.classList = "relative w-10 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-3 peer-focus:ring-pink-300 dark:peer-focus:ring-pink-800 rounded-full peer dark:bg-pink-900 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[3px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-pink-600"
                        completedlabel.appendChild(completedCheck)
                        completedlabel.appendChild(completedCheckDiv)
                        completedlabel.classList = 'ml-auto'
                        TDLItem.appendChild(completedlabel)

                        TDLElement.appendChild(TDLItem);
                        document.getElementById('to-do-list-div').appendChild(TDLElement)
                    }
                });
            } else if (currentTDLPage == 2) {
                //set as recurring to-do
                document.getElementById("todolist-container-title").innerHTML = 'Recurring'
                const TDLElement = document.createElement('ul');
                TDLElement.classList = "text-center w-full" 
                
                list.tasks.forEach(task => { //for each task in the to-do list, create div and content area.
                    if (task.is_recurring && (new Date(task.date)).toDateString() != (new Date()).toDateString() ) {
                        //If task recurs and isn't for today it goes here.
                        const TDLItem = document.createElement('li');

                        TDLItem.title = `${task.name} (${task.priority}) - ${task.is_completed ?  ("Completed: " + task.completed_date) : ("Due "+task.date)}.` 
                        TDLItem.title += `${task.note}. ${task.is_recurring ? "recurring every: "+task.recur_days+" days." : ""} - ${task.is_persistent ? "Persistent" : ""} (${task.id})` //update for context menu on hover. Esp. comments
                        
                        TDLItem.classList = "hover:border-2 hover:rounded-md hover:bg-pink-400 hover:border-pink-500 flex justify-center"; // Use flex container to align items horizontally
                        TDLItem.id = `${task.id}-TDL-item-div`
                        const priocircle = document.createElement('div');
                        priocircle.innerHTML = `<span>${task.priority}</span>`;
                        if (task.priority > 7) {
                            priocircle.classList = "bg-red-500"; // Add flex utilities for centering
                        } else if (task.priority > 3) {
                            priocircle.classList = "bg-orange-500"; // Add mr-2 for margin-right
                        } else {
                            priocircle.classList = "bg-green-500"; // Add mr-2 for margin-right
                        }
                        priocircle.classList += " w-5 pointer-events-none h-5 inline text-center rounded-full mr-2 flex justify-center items-center my-auto"
                        TDLItem.appendChild(priocircle);
                    
                        const TDLText = document.createElement('span'); // Use a <span> for the text content
                        TDLText.classList = 'pointer-events-none mr-3'
                        TDLText.textContent = task.name;
                        TDLText.style.color = task.color;
                        TDLItem.appendChild(TDLText);
                    
                        if (task.is_persistent) { //add persistence circle
                            const persistentCircle = document.createElement('div');
                            persistentCircle.innerHTML = `<span>P</span>`;
                            persistentCircle.classList += "bg-violet-400 w-5 pointer-events-none h-5 inline text-center rounded-full mr-2 flex justify-center items-center my-auto"
                            TDLItem.appendChild(persistentCircle);
                        }
                        if (task.is_recurring) { //add recurring circle
                            const persistentCircle = document.createElement('div');
                            persistentCircle.innerHTML = `<span>R${task.recur_days}</span>`;
                            persistentCircle.classList += "bg-rose-400 text-xs w-5 pointer-events-none h-5 inline text-center rounded-full mr-2 flex justify-center items-center my-auto"
                            TDLItem.appendChild(persistentCircle);

                            
                            nextDateRaw = new Date((new Date(task.date)).setDate((new Date(task.date)).getDate() + parseInt(task.recur_days)+1))
                            currentDateRaw = new Date()
                            if ((compareDateObjects(nextDateRaw,currentDateRaw)) > 0) { //if date is after today, we add it to the recurring list
                                console.log("They are more: " + task.name)
                                const TDLNextDate = document.createElement('span');
                                TDLNextDate.classList = 'pointer-events-none mr-3 text-gray-500 text-xs font-normal italic'
                                TDLNextDate.textContent = getDateString(nextDateRaw)
                                TDLItem.appendChild(TDLNextDate);
                            } else if ((compareDateObjects(nextDateRaw,currentDateRaw) == 0)) { //If it is exactly today then it shouldn't appear in this list
                                console.log("They are equal: " + task.name + "nd: " + getDateString(nextDateRaw) + " - cd: " + getDateString(currentDateRaw))
                                //So do nothing
                                task.date = getDateString(nextDateRaw)
                                task.is_completed = false
                            } else { //Otherwise the date is less; now we recycle it by setting the date to the new date, setting completed to false, and finally re-doing the UI update.
                                console.log("They are less: " + task.name)
                                task.date = getDateString(nextDateRaw)
                                task.is_completed = false
                                //updateUI(false);
                            }
                        }
                        
                        const deleteRecurring = document.createElement('button') //add delete button
                        deleteRecurring.id = `${task.id}-TDL-delete-btn`
                        deleteRecurring.classList = 'ml-auto text-center bg-pink-400 text-white font-bold rounded-md p-0.5 mb-0.5 pl-2 pr-2 text-xs border-2 border-pink-500'
                        deleteRecurring.innerHTML = 'X'
                        deleteRecurring.type = 'button'
                        TDLItem.appendChild(deleteRecurring)

                        
                        TDLElement.appendChild(TDLItem);
                        document.getElementById('to-do-list-div').appendChild(TDLElement)
                    }
                });
            } else { //== 3 
                //set as stats/suggestions
                document.getElementById("todolist-container-title").innerHTML = 'Statistics'
                //do later
            }
            
        return
        }
      
      //Now we create the list's div, specifically the title element

      const listElement = document.createElement('div');
      listElement.id = `${list.id}-div`
      const titlediv = document.createElement('div')
      titlediv.classList = "flex justify-center hover:rounded-md hover:bg-pink-400 hover:border-pink-500  hover:border-2"
      titlediv.id = `${list.id}-tdiv`
      const titleElement = document.createElement('h2');
      titleElement.id = `${list.id}-title`
      titleElement.classList = "text-center font-bold inline pointer-events-none";
      titlediv.title = `${list.name} (${list.id})`
      titleElement.innerHTML=list.name
      titlediv.draggable = true;
      titlediv.appendChild(titleElement)

      //And the sort buttons

      const sortAlpha = makeButton("alpha","fa-a");
      const sortRating = makeButton("rate","fa-star");
      const sortDate = makeButton("sort","fa-clock");

      function makeButton(type,icon) {
        btn = document.createElement('button')
        btn.type = "button"
        btn.id = `${list.id}-${type}-sort-btn`
        btn.classList = "w-5 h-5 hover:bg-pink-500 hover:text-gray-400 text-center justify-self-end self-center m-0.5 bg-pink-400 text-white font-bold rounded-full border-2 border-pink-500 flex justify-center items-center my-auto"
        if (type == "alpha") {btn.classList += " ml-4"}
        btn.innerHTML = `<span class='pointer-events-none text-xs'><i class="pointer-events-none fa-solid ${icon}"></i></span>`
        titlediv.appendChild(btn);
      }

      listElement.appendChild(titlediv)

      listElement.innerHTML += `<hr class="clear-right mb-2 mt-2">`
      

      //Now we make the unordered list containing the li of each task in that list.

      const tasksElement = document.createElement('ul');
      tasksElement.classList = "text-center" 
      
      list.tasks.forEach(task => { //for each task in that list, create div and content area.
        const taskItem = document.createElement('li');

        taskItem.title=`${task.name} (${task.priority}) - ${task.completed_date}. ${task.note} (${task.id})` //update for context menu on hover. Esp. comments
        taskItem.classList = "hover:border-2 hover:rounded-md hover:bg-pink-400 hover:border-pink-500 flex justify-center"; // Use flex container to align items horizontally
        taskItem.id = `${task.id}-list-item-div`
        taskItem.draggable = true;
    
        const priocircle = document.createElement('div');
        priocircle.innerHTML = `<span>${task.priority}</span>`;
        if (task.priority > 7) {
            priocircle.classList = "w-5 pointer-events-none h-5 bg-red-500 inline text-center rounded-full mr-2 flex justify-center items-center my-auto"; // Add flex utilities for centering
        } else if (task.priority > 3) {
            priocircle.classList = "w-5 pointer-events-none h-5 bg-orange-500 inline text-center rounded-full mr-2 flex justify-center items-center my-auto"; // Add mr-2 for margin-right
        } else {
            priocircle.classList = "w-5 pointer-events-none h-5 bg-green-500 inline text-center rounded-full mr-2 flex justify-center items-center my-auto"; // Add mr-2 for margin-right
        }
        taskItem.appendChild(priocircle);
    
        const taskText = document.createElement('span'); // Use a <span> for the text content
        taskText.classList = 'pointer-events-none'
        taskText.style.color = task.color
        taskText.textContent = task.name;
        taskItem.appendChild(taskText);
    
        tasksElement.appendChild(taskItem);
    });
    
    listElement.classList = "hover:border-4 m-1 p-2 hover:border-pink-500 hover:rounded-md text-center flex-item bg-pink-300 flex-grow w-full sm:w-1/2 md:w-1/5 lg:w-1/5 xl:w-1/5 text-white rounded-md border-2 border-pink-500";
    listElement.appendChild(tasksElement);
    listsContainer.appendChild(listElement);

    });

    //Next, refresh all list selectors/inputs

    const addTaskListContainer = document.getElementById('add-task-list-input');
    const remTaskListContainer = document.getElementById('rem-task-list-input');
    const remTaskNameContainer = document.getElementById('rem-task-name-input');
    const RemListNameContainer = document.getElementById('rem-list-name-input');
    if (Listchange == true) {
        addTaskListContainer.innerHTML = '';
        remTaskListContainer.innerHTML = '';
        RemListNameContainer.innerHTML = '';
    }
    remTaskNameContainer.innerHTML = '';
  
    //Now fill the list selectors.
    
    task_list.forEach((list, index) => { //for each item in the list, add an option to the list select bars

      function makeListElement() {
      listElement = document.createElement('option');
      listElement.label = `${list.name}`;
      listElement.value = `${list.id}`;
      return listElement
      }
      if (Listchange == true) {

        if (list.id != task_list.find(list => list.name == 'to-do list').id) { //if it's not to-do list
            RemListNameContainer.appendChild(makeListElement());
            addTaskListContainer.appendChild(makeListElement());
        }
        remTaskListContainer.appendChild(makeListElement());
      }
    });

    //Fill remove task input, it's dependent on the selected list.

    const selected_remtaskvalue = document.getElementById("rem-task-list-input").value
    selectedlist = task_list.find(list => list.id == selected_remtaskvalue)
    if (selectedlist && selectedlist.tasks) {
        selectedlist.tasks.forEach(task => { //for each task in that list
            const listElement4 = document.createElement('option');
            listElement4.label = `${task.name}`;
            listElement4.value = `${task.id}`;
            remTaskNameContainer.appendChild(listElement4);
          });
    }

      updateLocalStorage() //Finally update the storage.
}

function setModifyStateTask(task) { //When a task is selected, fill in the form and change to "save changes"/"cancel"

    //Set all the user-input values to the task's values
    document.getElementById("add-task-name-input").value = task.name // Name needed here b/c it's a textbox
    if (getItemById(task.listid) != null) {
        document.getElementById("add-task-list-input").label = getItemById(task.listid).name
    } else {
    }
    document.getElementById("add-task-list-input").value = task.listid
    document.getElementById("add-task-priority-input").value = task.priority
    document.getElementById("add-task-recur-input").value  = task.recur_days
    document.getElementById("add-task-completed-input").value  = task.completed_date
    document.getElementById("add-task-comment-input").value = task.note
    document.getElementById("rem-task-list-input").label = task.list
    document.getElementById("rem-task-list-input").value = task.listid
    document.getElementById("completed-bool").checked = task.is_completed
    if (!task.color) {
        document.getElementById("add-task-color-input").value = "#FFFFFF"
    } else {
        document.getElementById("add-task-color-input").value = task.color
    }

    //No need to set the ID because ModifyTask and ModifyList handle the ID.

    //todo-list specifics
    document.getElementById("add-task-recur-input").value = task.recur_days
    document.getElementById("add-task-date-input").value = task.date
    
    
    //Show the save changes/cancel changes button, hide the 'add task' button
    document.getElementById("add-task-btn").hidden = true;
    document.getElementById("save-changes-task-btn").hidden = false;
    document.getElementById("cancel-changes-task-btn").hidden = false;


    //force change to task list or to-do list depending on whether the task is part of the to-do list or a regular list.
    const completedswitched = document.getElementById('completed-bool');
    const recurringswitched = document.getElementById('recurring-bool');
    const isTaskSwitched = document.getElementById('task-bool');
    if (task.listid == task_list.find(list => list.name == 'to-do list').id) {
        isTaskSwitched.checked = true //sets task? to true
        document.getElementById("priority-label").innerHTML = "Priority: "
        document.getElementById("persistent-bool").checked = false //sets persistent to false
        document.getElementById("date-completed-span").style.display = "none"; //for completed
        document.getElementById('recurring-period-span').style.display = "none";//for recurring
        document.getElementById('persistent-label').style.display = "inline-flex"; //shows recurring
        document.getElementById('recurring-label').style.display = "inline-flex"; //shows persistency
        document.getElementById('add-task-date-input').style.display = "inline"; //shows due date
        document.getElementById('add-task-date-label').style.display = "inline"; //shows due date
        document.getElementById('add-task-list-label').style.display = "none"; //Hides list option since if its a task it goes to "to-do"

    } else {
        document.getElementById("priority-label").innerHTML = "Rating: "
        isTaskSwitched.checked = false //sets task? to true
        document.getElementById("date-completed-span").style.display = "block"; //for completed
        document.getElementById('recurring-period-span').style.display = "none";//for recurring
        document.getElementById('persistent-label').style.display = "none"; //hides recurring
        document.getElementById('recurring-label').style.display = "none"; //hides persistency
        document.getElementById('add-task-date-input').style.display = "none"; //hides due date
        document.getElementById('add-task-date-label').style.display = "none"; //hides due date
        document.getElementById('add-task-list-label').style.display = "inline"; //Shows list option 
    }

    //These update the booleans after resetting them above.
    if (task.is_completed) {
        document.getElementById("completed-bool").value = task.is_completed
        switch_completed() //have to manually call this because the event listener doesn't see changing the value as an event.
    } else {
        document.getElementById("completed-bool").value = task.is_completed
        switch_completed() //have to manually call this because the event listener doesn't see changing the value as an event.
    }
    if (task.is_recurring) {
        document.getElementById("recurring-bool").checked = task.is_recurring
        switch_recurring() //have to manually call this because the event listener doesn't see changing the value as an event.
    } else {
        document.getElementById("recurring-bool").checked = task.is_recurring
        switch_recurring() //have to manually call this because the event listener doesn't see changing the value as an event.
    }


    document.getElementById("persistent-bool").checked = task.is_persistent

    updateUI(false); //Update the UI to reflect the modifications
    
    
    //Finally, sets the removal inputs to the selected task's values.
    document.getElementById("rem-task-name-input").label = task.name
    document.getElementById("rem-task-name-input").value = task.id
}

function setModifyStateList(list) { //When a list is selected, fill in the form and change to "save changes"/"cancel"

    //Set the input values to the selected list's values.
    document.getElementById("add-list-name-input").value = list.name
    document.getElementById("rem-list-name-input").value = list.id
    document.getElementById("rem-list-name-input").label = list.name

    //change from "add list" to "save changes"/"cancel"
    document.getElementById("add-list-btn").hidden = true;
    document.getElementById("save-changes-list-btn").hidden = false;
    document.getElementById("cancel-changes-list-btn").hidden = false;
}

function modifyTask() { //Modify the selected task when changes are saved.
    Idnum = selected.id
    removeTask(selected.id) //remove the old task
    addNewTask(Idnum) //make a new task w/ same ID 
}

function refreshTaskEntry() { //Refresh/clear the task inputs
    document.getElementById("add-task-name-input").value = ''
    document.getElementById("add-task-priority-input").value = 5
    document.getElementById("add-task-comment-input").value = ''
}

function modifyList() { //Modify the selected list when changes are saved.
    Idnum = selected.id
    templist = selected //temp list saved to store the tasks and add them back later

    removeList(selected.id) //remove the old list
    addNewList(Idnum) //make a new list w/ same ID
    var listIdx = task_list.findIndex(list => list.id == Idnum); //get list index

    templist.tasks.forEach(task => { //for each task in the temp-list
        if (listIdx !== -1) { //if list index exists
            task_list[listIdx].tasks.push(task); //add the tasks to the list
        }
    });
}

function refreshListEntry() { //Refresh/clear the list inputs
    document.getElementById("add-list-name-input").value = ''
}

function setTDLPage(pageNum) { //Set the page for the To-Do-List selector
    if (pageNum == 0) {
        //set as to-do list (default)
        document.getElementById("todolist-container-title").innerHTML = 'To-Do List'
    } else if (pageNum == 1) {
        //set as upcoming to-do
        document.getElementById("todolist-container-title").innerHTML = 'Upcoming'
    } else if (pageNum == 2) {
        //set as recurring to-do
        document.getElementById("todolist-container-title").innerHTML = 'Recurring'
    } else { //== 3 
        //set as stats/suggestions
        document.getElementById("todolist-container-title").innerHTML = 'Statistics'
    }

}




//add AI? - unlikely


//Pop-up info box with nicer formatting

//All time tasks (subtracting any tasks that are deleted)
//All time tasks marked completed 
//Tasks that lapse (due on a day and failed)
//Persistent tasks that are being ignored