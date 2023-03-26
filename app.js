            // TOGGLE BTN FOR BACKGROUND SWITCH

const btn = document.querySelector('.switch-btn');

                //keep theme on reload

//check if local storage exists
const isGreyThemeLocalStorageNull = localStorage.getItem('greyTheme');
document.addEventListener('DOMContentLoaded', function(){
    btn.classList.add('not-slide');
    document.body.classList.add('yellowTheme');
    if(isGreyThemeLocalStorageNull !== null){
    //if true(from eventListener below, then add back classes)
    if(isGreyThemeLocalStorageNull === 'true'){
        btn.classList.add('slide');
        document.body.classList.add('greyTheme');
    } else{
        // document.body.classList.add('yellowTheme');
        // btn.classList.add('not-slide');
    }
};
})
                // toggle
btn.addEventListener('click', function(){
    if(!btn.classList.contains('slide')){
        btn.classList.add('slide');
        document.body.classList.add('greyTheme');
        localStorage.setItem('greyTheme', 'true');
    }
    else{
        btn.classList.remove('slide');
        btn.classList.add('not-slide');
        document.body.classList.remove('greyTheme');
        document.body.classList.add('yellowTheme');
        localStorage.setItem('greyTheme', 'false');
    }
});


                    // TASK LIST
const alert = document.querySelector('.alert');
const form = document.querySelector('.grocery-form');
const submitBtn = document.querySelector('.submit-btn');
const grocery = document.getElementById('grocery');
const clearBtn = document.querySelector('.clear-btn');
const clearDoneBtn = document.querySelector('.clearDone-btn');
const container = document.querySelector('.grocery-container');
const list = document.querySelector('.grocery-list');
const doneContainer = document.querySelector('.done-container');
const doneList = document.querySelector('.done-list');


//edit options
let editElement;
let editFlag = false;
let editID = '';

let doneElement;
let doneFlag = false;
let doneID = '';



//EVENT LISTENERS
form.addEventListener('submit',addItem);
clearBtn.addEventListener('click', clearItems);
clearDoneBtn.addEventListener('click', clearDoneItems);
window.addEventListener('DOMContentLoaded', setupItems);

// FUNCTIONS
function addItem(e){
    e.preventDefault();
    const value = grocery.value;
    const id = new Date().getTime().toString();
    const flag = 'active';

    if(value && !editFlag){
        createListItem(id, value);
        alertText('Item added to the list', 'success');
        container.classList.add('show-container');
        addToLocalStorage(id, flag, value);
        setBackToDefault(); 
    }
    else if(value && editFlag){
        editElement.innerHTML = value;
        alertText('value changed', 'success');
        editLocalStorage(editID, flag, value);
        setBackToDefault();
    }
    // else if(doneFlag){
    //     alertText('item moved to done list', 'success')
    // }
    else{
        alertText('Please enter a value', 'danger');
    }
}


function alertText(text,action){
    alert.textContent = text;
    alert.classList.add(`alert-${action}`);

    setTimeout(function(){
        alert.textContent = '';
        alert.classList.remove(`alert-${action}`);
    }, 1000);
};


function clearItems(){
    const items = document.querySelectorAll('.grocery-item');
    if(items.length > 0){
        items.forEach(function(item){
            list.removeChild(item);
        });
    }
    container.classList.remove('show-container');
    alertText('Items removed from the list', 'danger');
    setBackToDefault();
    localStorage.removeItem('list');
}

function clearDoneItems(){
    const items = document.querySelectorAll('.done-item');
    if(items.length > 0){
        items.forEach(function(item){
            doneList.removeChild(item);
        });
    }
    doneContainer.classList.remove('show-container');
    alertText('Items removed from archive', 'danger');
    setBackToDefault();
    localStorage.removeItem('doneList');
}


function deleteItem(e){
    const element = e.currentTarget.parentElement.parentElement;
    const id = element.dataset.id;
    list.removeChild(element);
    if(list.children.length === 0){
        container.classList.remove('show-container');
    }
    alertText('item removed', 'danger')
    setBackToDefault();
    removeFromLocalStorage(id);
}

function deleteDoneItem(e){
    const element = e.currentTarget.parentElement.parentElement;
    const id = element.dataset.id;
    doneList.removeChild(element);
    if(doneList.children.length === 0){
        doneContainer.classList.remove('show-container');
    }
    alertText('item removed', 'danger');
    setBackToDefault();
    removeFromDoneStorage(id);
}


function editItem(e){
    const element = e.currentTarget.parentElement.parentElement;
    // set edit item
    editElement = e.currentTarget.parentElement.previousElementSibling;
    //set form value
    grocery.value = editElement.innerHTML;
    editFlag = true;
    editID = element.dataset.id;
    submitBtn.textContent = 'edit'

}

function doneItem(e){
    const element = e.currentTarget.parentElement.parentElement;
    doneElement = e.currentTarget.parentElement.previousElementSibling;
    doneElement.classList.add('strike');
    doneID = element.dataset.id;
    flag = 'completed';
    //create element & add value of done elemenet
    createDoneItemList(doneID,doneElement.innerHTML)

    //HERE WE CAN DO AN IF STATEMENT, IF FILTER IS HIT THEN WE DON'T SHOW THE CONTAINER:
    // if(e.target.dataset.name === 'active'){
    //     doneContainer.classList.remove('show-container');
    // } else{
    //    doneContainer.classList.add('show-container'); 
    // }
    doneContainer.classList.add('show-container'); 

    //delete doneElemenet
    list.removeChild(element);
    alertText('item completed', 'success');
    if(list.children.length === 0){
        container.classList.remove('show-container');
    }

    //TESTING CODE TO REMOVE DONE CONTAINER DURING FILTERING & MARKING ITEM AS COMPLETED!!!!!
    if(doneContainer.classList.contains('filter-out')){
        doneContainer.classList.remove('show-container');
    }

    addToCompletedStorage(doneID, flag, doneElement.innerHTML);
    setBackToDefault();
}

function revert(e){
    const element = e.currentTarget.parentElement.parentElement;
    doneElement = e.currentTarget.parentElement.previousElementSibling;
    doneElement.classList.remove('strike');
    doneID = element.dataset.id;
    flag = 'active';
    createListItem(doneID, doneElement.innerHTML);
    container.classList.add('show-container');
    doneList.removeChild(element);
    alertText('item moved to grocery list', 'success');
    if(doneList.children.length === 0){
        doneContainer.classList.remove('show-container');
    }

    //TESTING CODE TO REMOVE MAIN CONTAINER DURING FILTERING & REVERTOMG ITEM AS TODO!!!!!
    if(container.classList.contains('filter-out')){
        container.classList.remove('show-container');
    }

    addToLocalStorage(doneID, flag, doneElement.innerHTML);
    setBackToDefault();
}

function setBackToDefault(){
    grocery.value = ''
    submitBtn.textContent = 'submit';
    editFlag = false;
    editID = '';

    doneElement;
    doneFlag = false;
    doneID = '';
};




//LOCAL STORAGE FUNCTIONS

function addToLocalStorage(id, flag, value){
    const grocery = {id, flag, value};
    //this is the starting point of all local storage: check if we have anything in the storage? if no - return an empty array, if yes - then return the array. And then it's all about pushing new value into array and puttting new array back into the storage. Or changing value of item and putting new array into storage, or filtering array and putting new array into storage. 
    let items = getLocalStorage();
    items.push(grocery);
    localStorage.setItem('list', JSON.stringify(items));
    removeFromDoneStorage(id);
};

function addToCompletedStorage(id, flag, value){
    const grocery = {id, flag, value};
    let items = getCompletedStorage();
    items.push(grocery);
    localStorage.setItem('doneList', JSON.stringify(items));
    removeFromLocalStorage(id);
}


function removeFromLocalStorage(id){
    let items = getLocalStorage();
    //we remove by overriding the list
    items = items.filter(function(item){
        if(item.id !== id){
            return item;
        }
    })
    localStorage.setItem('list', JSON.stringify(items));
}

function removeFromDoneStorage(id){
    let items = getCompletedStorage();
    items = items.filter(function(item){
        if(item.id !== id){
            return item;
        }
    })
    localStorage.setItem('doneList', JSON.stringify(items));
}


function editLocalStorage(id, flag, value){
    let items = getLocalStorage();
    items = items.map(function(item){
        if(item.id === id){
            item.value = value;
        }
        return item;
    });
    localStorage.setItem('list', JSON.stringify(items));
}

function getLocalStorage(){
    return localStorage.getItem('list')
    ? JSON.parse(localStorage.getItem('list'))
    : [];
}

function getCompletedStorage(){
    return localStorage.getItem('doneList')
    ? JSON.parse(localStorage.getItem('doneList'))
    : [];
}


//SET UP ITEMS ON PAGE RELOAD

function setupItems(){
    let items = getLocalStorage();
    let doneItems = getCompletedStorage();

    if(items.length > 0){
        items.forEach(function(item){
            createListItem(item.id, item.value);
        })
        container.classList.add('show-container');
    };

    if(doneItems.length > 0){
        doneItems.forEach(function(item){
            createDoneItemList(item.id, item.value);
        })
        doneContainer.classList.add('show-container');
    }
}


function createListItem(id, value){
    const element = document.createElement('article');
        //add class
        element.classList.add('grocery-item');
        //add attribute(for dataset)
        const attr = document.createAttribute('data-id');
        attr.value = id;
        element.setAttributeNode(attr);
        element.innerHTML = 
                `<p class="title">${value}</p>
                <div class = "btn-container">
                <button type="button" class="done-btn">
                        <i class="fas fa-check"></i>
                    </button>
                    <button type="button" class="edit-btn">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button type="button" class="delete-btn">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>`;
        const deleteBtn = element.querySelector('.delete-btn');
        const editBtn = element.querySelector('.edit-btn');
        const doneBtn = element.querySelector('.done-btn');

        //event listeners for delete and edit btns
        deleteBtn.addEventListener('click', deleteItem);
        editBtn.addEventListener('click', editItem);
        doneBtn.addEventListener('click', doneItem );

        //append child
        list.appendChild(element);
}

function createDoneItemList(id, value){
    const element = document.createElement('article');
        //add class
        element.classList.add('done-item');
        //add attribute(for dataset)
        const attr = document.createAttribute('data-id');
        attr.value = id;
        element.setAttributeNode(attr);
        element.innerHTML = 
                `<p class="title strike">${value}</p>
                <div class = "btn-container">
                <button type="button" class="doneBack-btn">
                        <i class="fas fa-check"></i>
                    </button>
                    <button type="button" class="deleteDone-btn">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>`;
        const deleteDoneBtn = element.querySelector('.deleteDone-btn');
        const doneBackBtn = element.querySelector('.doneBack-btn');

        //event listeners for delete and edit btns
        deleteDoneBtn.addEventListener('click', deleteDoneItem);
        doneBackBtn.addEventListener('click', revert);

        //append child
        doneList.appendChild(element);
}


                            // SIDEBAR

const sidebarToggle = document.querySelector('.sidebar-toggle') 
const sidebarIcon = document.querySelector('.fas')                           ;
const sidebar = document.querySelector('.sidebar');
const closeBtn = document.querySelector('.close-btn');
const activeFilter = document.querySelector('.active');
const completedFilter = document.querySelector('.completed');
const showAllBtn = document.querySelector('.all');

sidebarToggle.addEventListener('click', openSideBar);
closeBtn.addEventListener('click', closeSideBar);
activeFilter.addEventListener('click', filterActiveList);
completedFilter.addEventListener('click', filterDoneList);
showAllBtn.addEventListener('click', showAllList);


//MY SIDEBAR DOESN'T WORK WITH THIS LISTENER!
document.addEventListener('click', function(e){
    if(!sidebar.contains(e.target) && e.target !== sidebarToggle){
        sidebar.classList.remove('show-sidebar');
    }
}, true)

// sidebar functions

function openSideBar(){
    sidebar.classList.toggle('show-sidebar');
}


function closeSideBar(){
    sidebar.classList.remove('show-sidebar');
}

function filterActiveList(e){
    e.preventDefault();
    doneContainer.classList.add('filter-out');
    let items = document.querySelectorAll('.grocery-item');
    //think about logic to bring back other containers
    if(items.length > 0){
        container.style.position = '';
        container.classList.add('show-container');
        // filterAlert('filter: open items', 'success');
    } else {
        container.classList.remove('show-container');
        alertText('the list is empty', 'danger');
    }
    doneContainer.classList.remove('show-container');
    doneContainer.style.position = 'absolute';
    sidebar.classList.remove('show-sidebar');
}

function filterDoneList(e){
    e.preventDefault();
    container.classList.add('filter-out');
    //think about logic to bring back other containers
    if(!doneContainer.classList.contains('show-container')){
        doneContainer.style.position = '';
        doneContainer.classList.add('show-container');
    }
    container.classList.remove('show-container');
    container.style.position = 'absolute';
    sidebar.classList.remove('show-sidebar');
}


function showAllList(e){
    e.preventDefault();
    if(!doneContainer.classList.contains('show-container')){
        doneContainer.style.position = '';
        doneContainer.classList.add('show-container'); 
    }
    if(!container.classList.contains('show-container')){
        container.style.position = '';
        container.classList.add('show-container');
    }
    sidebar.classList.remove('show-sidebar');
}


//DOESN'T FULLY WORK
function filterAlert(text, action){
    alert.textContent = text;
    alert.classList.add(`alert-${action}`)
}












