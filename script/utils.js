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

/**
 * takes in a date, returns string representation as 'dd-mm-yy'
 * @param {Date} date1 
 */
function getDateString(date) { //takes in a date, returns yyyy-mm-dd
    const yyyy = date.getFullYear();
    let mm = date.getMonth() + 1; // month is zero-indexed
    let dd = date.getDate();

    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;

    const formatted = yyyy + '-' + mm + '-' + dd;
    return formatted
}

/**
 * takes in 2 dates, returns 1 if date1 > date2, 0 if ==, -1 if date2 > date1
 * @param {Date} date1 
 * @param {Date} date2 
 */
function compareDateObjects(date1, date2) { 
    const yyyy1 = date1.getFullYear();
    let mm1 = date1.getMonth() + 1; // month is zero-based
    let dd1 = date1.getDate();
    const yyyy2 = date2.getFullYear();
    let mm2 = date2.getMonth() + 1; // month is zero-based
    let dd2 = date2.getDate();

    if (yyyy1 > yyyy2) {
        return 1
    } else if (yyyy2 > yyyy1) {
        return -1
    } else { //they're equal year
        if (mm1 > mm2) {
            return 1
        } else if (mm2 > mm1) {
            return -1
        } else {//they're equal month
            if (dd1 > dd2) {
                return 1
            } else if (dd2 > dd1) {
                return -1
            } else { //all equal
                return 0
            }
        }
    }
}