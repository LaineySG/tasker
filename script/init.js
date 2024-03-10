if (window.localStorage.getItem("taskList")) { 
    //If there's a tasklist in local storage, set the task_list array to the value of the local storage. Otherwise make the list and add the to-do-list.
    let retrieval = window.localStorage.getItem("taskList");
    if (retrieval) {
        console.log("Local storage data found");
        var task_list = JSON.parse(retrieval);
        console.log("Loaded data: " + JSON.stringify(task_list))
    } else {
        console.log("Local storage data is null");
        var task_list = [];
        //add main TDL
        const newList = {name: 'to-do list', tasks:[], "id" : (uid(16))};
        task_list.push(newList);
    }
} else {
    console.log("No local storage data found");
    var task_list = [];
    //add main TDL
    const newList = {name: 'to-do list', tasks:[], "id" : (uid(16))};
    task_list.push(newList);
}

let selected = '' //selected ID
let currentTDLPage = 0 //to-do-list page, defaults to "to-do-list"

updateUI() //to show loaded task_list info

console.log("Page Initialized")
