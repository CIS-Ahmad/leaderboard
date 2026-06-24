let usersData = [];

let userData = {
    ID: 0,
    name: "",
    date: "",
    country: "",
    score: 0
};

function getEleUsingID(ID) {
    return document.getElementById(ID);
}

function GetUsersDataFromLocalStorage() {
    usersData = JSON.parse(localStorage.getItem("usersData")) || [];
}

function writeOnUsreLocalStorage() {
    localStorage.setItem("usersData", JSON.stringify(usersData));
}



function addNewUserForLocalStorage() {

    GetUsersDataFromLocalStorage();

    usersData.push(userData);

    usersData.sort((a, b) => b.score - a.score);

    writeOnUsreLocalStorage();
    DisplayScreen();
}

function addNewUSer() {

    userData = {
        ID: Date.now(),
        name: `${getEleUsingID("F-Name").value} ${getEleUsingID("L-Name").value}`,
        date: getFullCurrentDate(),
        country: getEleUsingID("Country").value,
        score: Number(getEleUsingID("Player-score").value)
    };

    addNewUserForLocalStorage();
}



function GetUSersDataById(ID) {

    let users = JSON.parse(localStorage.getItem("usersData")) || [];

    return users.find(c => c.ID === ID) || null;
}

function removeUserFromLocalStorage(ID) {

    GetUsersDataFromLocalStorage();

    let before = usersData.length;

    usersData = usersData.filter(user => user.ID !== ID);

    if (before === usersData.length) {
        console.error("User was not deleted");
        return;
    }

    writeOnUsreLocalStorage();
    DisplayScreen();
}

function updateUserScore(ID, value) {

    GetUsersDataFromLocalStorage();

    let user = usersData.find(u => u.ID === ID);
    if (!user) return;

    if (value === 5) {
        user.score = Math.min(100, user.score + 5);
    } else {
        user.score = Math.max(0, user.score - 5);
    }

    usersData.sort((a, b) => b.score - a.score);

    writeOnUsreLocalStorage();
    DisplayScreen();
}


function getFullCurrentDate() {
    return new Date().toLocaleString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    });
}


function createElement(name, className, id = null, textContent = "", father = null) {

    const element = document.createElement(name);
    element.classList.add(className);

    if (textContent !== "") {
        element.textContent = textContent;
    }

    if (id) {
        element.id = id;
    }

    if (father) {
        const parent = getEleUsingID(father);
        parent.appendChild(element);
    } else {
        document.body.appendChild(element);
    }

    return element;
}


function CreateDisplayElement(index) {

    const currentUser = usersData[index];

    createElement("div", "rowReslut", `rowReslut-${index}`, "", "reslut");

    createElement("div", "fGridelement", `fGridelement-${index}`, "", `rowReslut-${index}`);
    createElement("p", "Name", '', currentUser.name, `fGridelement-${index}`);
    createElement("p", "Date", '', currentUser.date, `fGridelement-${index}`);

    createElement("div", "Gridelement", '', currentUser.country, `rowReslut-${index}`);
    createElement("div", "Gridelement", '', currentUser.score, `rowReslut-${index}`);

    createElement("div", "Gridelement", `actions-${index}`, "", `rowReslut-${index}`);

    let btn1 = createElement("button", "but", '', "", `actions-${index}`);
    btn1.innerHTML = `<img src="./assets/SVG/delete.svg">`;

    let btn2 = createElement("button", "but", '', '+5', `actions-${index}`);
    let btn3 = createElement("button", "but", '', '-5', `actions-${index}`);

    btn1.addEventListener("click", () => {
        removeUserFromLocalStorage(currentUser.ID);
    });

    btn2.addEventListener("click", () => {
        updateUserScore(currentUser.ID, 5);
    });

    btn3.addEventListener("click", () => {
        updateUserScore(currentUser.ID, -5);
    });
}

function DisplayScreen() {

    GetUsersDataFromLocalStorage();

    const reslut = getEleUsingID("reslut");
    reslut.innerHTML = "";

    for (let i = 0; i < usersData.length; i++) {
        CreateDisplayElement(i);
    }
}

document.addEventListener("DOMContentLoaded", () => {

    getEleUsingID('AddPlayer').addEventListener("click", () => {

        if (getEleUsingID("F-Name").value &&
            getEleUsingID("L-Name").value &&
            getEleUsingID("Player-score").value &&
            getEleUsingID("Country").value) {

            getEleUsingID("ErrorMessage").style.display = 'none';

            addNewUSer();

        } else {
            getEleUsingID("ErrorMessage").style.display = 'flex';
        }
    });

    let scorFild = getEleUsingID("Player-score");
    scorFild.addEventListener('input', () => {

        if (Number(scorFild.value) > 100) {
            scorFild.value = 100;
        }
        else if (Number(scorFild.value) < 0) {
            scorFild.value = 0;
        }

    });

    DisplayScreen();
});