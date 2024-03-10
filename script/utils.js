function getItemById(inputID) {//Take in ID, return task or list object.
    for (const list of task_list) { //for each list in array
        if (inputID == list.id) { //it's a list
            return list;
        }
        for (const task of list.tasks) { //for each task in that list
            if (inputID == task.id) { //it's a task
                return task;
            }
        }
    }
    // Return a default value or handle the case where the ID is not found.
    return null;
}

function allowDrop(ev) {//Allow drops.
    ev.preventDefault()
}

function updateLocalStorage() {//Updates local stories to be equal to taskList.
    console.log("updating local storage...")
    window.localStorage.setItem("taskList", JSON.stringify(task_list));
    let retrieval = window.localStorage.getItem("taskList")
    task_list = JSON.parse(retrieval)
}

function uid(num) { //generate unique/random ID 
    alpha = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z']
    Calpha = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z']
    out = ''
    for (let i=0; i < num; i++) {
        rnd = Math.floor(Math.random() * 60) //0 to 35. 0 to 9 will be number, 10 to 35 will be alpha. 36 to 60 are cap alpha.
        
        if (rnd <= 9) {
            out += i
        } else if (rnd <= 35) {
            out += alpha[(rnd-10)]
        } else {
            out += Calpha[(rnd-36)]
        }
    }
    return out
}

function clearStorage() {//Clears local storage to refresh list
    //Run from console for testing 
    window.localStorage.setItem("taskList", [])
    console.log("Cleared!")
    location.reload()
}
