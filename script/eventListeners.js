//event listeners

const addListButton = document.getElementById('add-list-btn');
addListButton.addEventListener('click', () => { //add list clicked
    addNewList();
    updateUI();
});

const remListButton = document.getElementById('rem-list-btn');
remListButton.addEventListener('click', () => { //Remove list clicked
    removeList();
    updateUI(); //true/false denotes whether or not it will update the select group of lists
});

const saveTaskChangesButton = document.getElementById('save-changes-task-btn');
saveTaskChangesButton.addEventListener('click', () => { //Modifications to task saved
    document.getElementById("add-task-btn").hidden = false;
    document.getElementById("save-changes-task-btn").hidden = true;
    document.getElementById("cancel-changes-task-btn").hidden = true;
    modifyTask();
    updateUI(false);
    selected = ''
});

const cancelTaskChangesButton = document.getElementById('cancel-changes-task-btn');
cancelTaskChangesButton.addEventListener('click', () => {//Modifications to task cancelled
    document.getElementById("add-task-btn").hidden = false;
    document.getElementById("save-changes-task-btn").hidden = true;
    document.getElementById("cancel-changes-task-btn").hidden = true;
    refreshTaskEntry();
    updateUI(false);
    selected = ''
});

const saveListChangesButton = document.getElementById('save-changes-list-btn');
saveListChangesButton.addEventListener('click', () => { //Modifications to list saved
    document.getElementById("add-list-btn").hidden = false;
    document.getElementById("save-changes-list-btn").hidden = true;
    document.getElementById("cancel-changes-list-btn").hidden = true;
    modifyList();
    updateUI(false);
    selected = ''
});

const cancelListChangesButton = document.getElementById('cancel-changes-list-btn');
cancelListChangesButton.addEventListener('click', () => {//Modifications to list cancelled
    document.getElementById("add-list-btn").hidden = false;
    document.getElementById("save-changes-list-btn").hidden = true;
    document.getElementById("cancel-changes-list-btn").hidden = true;
    refreshListEntry();
    updateUI(false);
    selected = ''
});

const addTaskButton = document.getElementById('add-task-btn');
addTaskButton.addEventListener('click', () => {//Add task clicked
    addNewTask();
    updateUI(false);
});

const RemTaskButton = document.getElementById('rem-task-btn');
RemTaskButton.addEventListener('click', () => {//Remove task clicked
    removeTask();
    updateUI(false);
});

const remListChanged = document.getElementById('rem-task-list-input');
remListChanged.addEventListener('change', () => {//Remove task's list input changed
    updateUI(false);
});

const timerStarted = document.getElementById('start-timer-btn');
timerStarted.addEventListener('click', () => {//Start timer clicked
    timerStart();
});

const timerPaused = document.getElementById('pause-timer-btn');
timerPaused.addEventListener('click', () => {//Stop timer clicked
    timerPause();
});

const completedswitched = document.getElementById('completed-bool');
completedswitched.addEventListener('change', () => {//Completed switch value changed. Handles some minor UI changes for display.
    if (completedswitched.checked)  {
        document.getElementById("date-completed-span").style.display = "block";
        if (!isTaskSwitched.checked) {
            document.getElementById('buggyid').style.display = "none"; //shows buggy br
        }
    } else {
        document.getElementById("date-completed-span").style.display = "none";
        if (!isTaskSwitched.checked) {
            document.getElementById('buggyid').style.display = "block"; //shows buggy br
        }
    }
});

const recurringswitched = document.getElementById('recurring-bool');
recurringswitched.addEventListener('change', () => {//Recurring switch value changed. Handles minor UI changes for display
    if (recurringswitched.checked) {
        document.getElementById("recurring-period-span").style.display = "block";
    } else {
        document.getElementById("recurring-period-span").style.display = "none";
    }
});

const todo_right_btn = document.getElementById('todo-right-btn');
todo_right_btn.addEventListener('click', () => {//Todo right button clicked, changes TDL page.
    currentTDLPage += 1
    if (currentTDLPage >= 4) {
        currentTDLPage = 0
    }
    setTDLPage(currentTDLPage)
    //0 to-do-list, 1 upcoming-to-do, 2 recurring-to-do, 3 stats/suggestions
});
const todo_left_btn = document.getElementById('todo-left-btn');
todo_left_btn.addEventListener('click', () => {//Todo left button clicked, changes TDL page.
    currentTDLPage -= 1
    if (currentTDLPage < 0) {
        currentTDLPage = 3
    }
    setTDLPage(currentTDLPage)

});

const isTaskSwitched = document.getElementById('task-bool');
isTaskSwitched.addEventListener('change', () => {//Is-task switch value changed, handles input display changes for todo-list vs regular list inputs.
    if (isTaskSwitched.checked) { //If it is a TDL
        completedswitched.checked = false //sets completed to false
        recurringswitched.checked = false //sets recurring to false
        document.getElementById("priority-label").innerHTML = "Priority: "
        document.getElementById("persistent-bool").checked = false //sets persistent to false
        document.getElementById("date-completed-span").style.display = "none"; //for completed
        document.getElementById('recurring-period-span').style.display = "none";//for recurring

        document.getElementById('persistent-label').style.display = "inline-flex"; //shows recurring
        document.getElementById('recurring-label').style.display = "inline-flex"; //shows persistency
        document.getElementById('add-task-date-input').style.display = "inline"; //shows due date
        document.getElementById('add-task-date-label').style.display = "inline"; //shows due date
        document.getElementById('buggyid').style.display = "block"; //shows buggy br.
        document.getElementById('add-task-list-label').style.display = "none"; //Hides list option since if its a task it goes to "to-do"
    } else {
        document.getElementById("priority-label").innerHTML = "Rating: "
        completedswitched.checked = true //sets completed to true
        document.getElementById("date-completed-span").style.display = "block"; //for completed
        document.getElementById('recurring-period-span').style.display = "none";//for recurring

        document.getElementById('persistent-label').style.display = "none"; //hides recurring
        document.getElementById('recurring-label').style.display = "none"; //hides persistency
        document.getElementById('add-task-date-input').style.display = "none"; //hides due date
        document.getElementById('add-task-date-label').style.display = "none"; //hides due date
        document.getElementById('buggyid').style.display = "none"; //hides buggy br
        document.getElementById('add-task-list-label').style.display = "inline"; //Shows list option 
    }
});

const listsContainer = document.getElementById('lists-container');
const TDLContainer = document.getElementById('todolist-div');
const containerArray = [listsContainer,TDLContainer] //Create array of list and TDL container to watch clicks on.
containerArray.forEach((container, index) => {//For each item in both containers
    container.addEventListener('dragstart', (event) => {//Listens for drag-start events on list items and task item divs
        if (event.target.id.endsWith('-list-item-div') || event.target.id.endsWith('tdiv')) {
            event.stopPropagation;
            const target = event.target
            taskitemid = target.id.split("-")
            taskitemIDN = taskitemid[0]
            event.dataTransfer.effectAllowed = 'move'
            event.dataTransfer.setData("text", taskitemIDN); //sets data to the IDN
            console.log("Dragging IDN " + taskitemIDN)
        }
    });
    container.addEventListener('dragenter', (event) => {//Listens for drag-enter events on all items in containers, prevents default.
        event.preventDefault();
    });
    container.addEventListener('dragover', (event) => {//Listens for drag-over events on all items in containers, prevents default.
        event.preventDefault();
    });
    container.addEventListener('drop', (event) => {//Listens for drop events on all items in containers, handles dropping of items.
        event.preventDefault();
        dropitemIDN = event.dataTransfer.getData("text")
        itemDropped = task_list.find(list => list.id == dropitemIDN)
        console.log("dropped IDN: " + dropitemIDN)
        task_list.forEach((list, index) => { //for each list in array
            if (dropitemIDN == list.id) {
                //If it's a list being dropped we will change the order
            }
            list.tasks.forEach(task => { //for each task in that list
                if (dropitemIDN == task.id){ //Find the task in question
                //If it's a task being dropped we will add it to the new list 

                //First we get the ID of the list it was dropped on. We change the task's listid parent to the new list ID
                droppedlistid = event.target.id.split("-")
                droppedlistIDN = droppedlistid[0]
                console.log("task changed from list: " +  task.listid + " , " + task.list)
                previouslistID = task.listid
                task.listid = droppedlistIDN
                var taskobj = task_list.find(list => list.id == task.listid) //set the parent list's name
                task.list = taskobj.name
                console.log("task changed to list: " +  task.listid + " , " + task.list)

                //Then we remove the task from the parent's ID list and add it to the new list
                tempTask = task
                removeTask(task.id, previouslistID)
                addNewTask(task.id, task.listid)
                }
            });
            updateUI(false);
        });
    });
    container.addEventListener('click', (event) => {//Listens for click events on all items in container, Handles sort buttons and modifications.
        const target = event.target;
        console.log(target.id)
        // Check if the clicked element has the expected class or ID
        if (target.classList.contains('sort-btn') || target.id.endsWith('sort-btn')) {//Handles sort button clicks. Sorts the list of tasks.
            // Extract list and type information from the clicked element
            const matchArray = target.id.split("-");
            let listToSort = matchArray[0];
            const type = matchArray[1];
            if (listToSort == 'todolist') {listToSort = task_list.find(list => list.name == 'to-do list').id}

            const listIndex = task_list.findIndex(list => list.id == listToSort);

            if (listIndex !== -1) {
                const list = task_list[listIndex];
                const tasks = list.tasks;

                const currentOrder = tasks.map(task => task.name); //Name here is ok because it's sorting by name.
                if (type === "alpha") {
                    tasks.sort((a, b) => a.name.localeCompare(b.name));
                } else if (type == "rate") {
                    tasks.sort((a, b) => b.priority - a.priority);
                } else { //date
                    tasks.sort((a, b) => {
                        const dateA = new Date(a.completed_date);
                        const dateB = new Date(b.completed_date);
                        if (dateA < dateB) return -1;
                        if (dateA > dateB) return 1;
                        return 0;
                    });
                    
                }

                const isSorted = JSON.stringify(currentOrder) === JSON.stringify(tasks.map(task => task.name));

                if (isSorted) {
                    tasks.reverse();
                }

                updateUI();
            } else {
                console.log(`List "${listToSort}" not found.`);
            }
        } else if (target.id.endsWith('-list-item-div')) {//Handles task clicks and sets modification state
            taskitemid = target.id.split("-")
            taskitemIDN = taskitemid[0]
            
            task_list.forEach((list, index) => { //for each list in array
                list.tasks.forEach(task => { //for each task in that list
                    if (taskitemIDN == task.id){
                        selected = task
                        console.log("Selected task: " + selected)
                        setModifyStateTask(task)
                    }
                });
            });
        } else if (target.id.endsWith('tdiv')) { //Handles list clicks and sets modification state
            listitemid = target.id.split("-")
            listitemIDN = listitemid[0]
            task_list.forEach((list, index) => { //for each list in array
                if (listitemIDN == list.id){
                    selected = list
                    console.log("Selected list: " + selected)
                    setModifyStateList(list)
                }
            });


        }
    });

});
