let usersData = [];

let userData = {
  ID: 0,
  name: "",
  date: "",
  country: "",
  score: 0,
};

const SCORE = 5;

function getElementUsingID(ID) {
  return document.getElementById(ID);
}

function getUsersDataFromLocalStorage() {
  usersData = JSON.parse(localStorage.getItem("usersData")) || [];
}

function writeOnUserLocalStorage() {
  localStorage.setItem("usersData", JSON.stringify(usersData));
}

function addNewUserForLocalStorage() {
  getUsersDataFromLocalStorage();

  usersData.push(userData);

  usersData.sort((a, b) => b.score - a.score);

  writeOnUserLocalStorage();
  DisplayScreen();
}

function addNewUser() {
  userData = {
    ID: Date.now(),
    name: `${getElementUsingID("F-Name").value} ${getElementUsingID("L-Name").value}`,
    date: getFullCurrentDate(),
    country: getElementUsingID("Country").value,
    score: Number(getElementUsingID("Player-score").value),
  };

  addNewUserForLocalStorage();
}

function getUsersDataById(ID) {
  let users = JSON.parse(localStorage.getItem("usersData")) || [];

  return users.find((c) => c.ID === ID) || null;
}

function removeUserFromLocalStorage(ID) {
  getUsersDataFromLocalStorage();

  let before = usersData.length;

  usersData = usersData.filter((user) => user.ID !== ID);

  if (before === usersData.length) {
    console.error("User was not deleted");
    return;
  }

  writeOnUserLocalStorage();
  DisplayScreen();
}

function updateUserScore(ID, value) {
  getUsersDataFromLocalStorage();

  let user = usersData.find((u) => u.ID === ID);
  if (!user) return;

  if (value === SCORE) {
    user.score = Math.min(100, user.score + SCORE);
  } else {
    user.score = Math.max(0, user.score - SCORE);
  }

  usersData.sort((a, b) => b.score - a.score);

  writeOnUserLocalStorage();
  DisplayScreen();
}

function getFullCurrentDate() {
  return new Date().toLocaleString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

function createElement(
  name,
  className,
  id = null,
  textContent = "",
  father = null,
) {
  const element = document.createElement(name);
  if (className) element.classList.add(className);

  if (textContent !== "") {
    element.textContent = textContent;
  }

  if (id) {
    element.id = id;
  }

  if (father) {
    const parent = getElementUsingID(father);
    parent.appendChild(element);
  } else {
    document.body.appendChild(element);
  }

  return element;
}

function createDisplayElement(index) {
  const currentUser = usersData[index];

  createElement("div", "rowReslut", `rowReslut-${index}`, "", "reslut");

  createElement(
    "div",
    "fGridelement",
    `fGridelement-${index}`,
    "",
    `rowReslut-${index}`,
  );
  createElement("p", "Name", "", currentUser.name, `fGridelement-${index}`);
  createElement("p", "Date", "", currentUser.date, `fGridelement-${index}`);

  createElement(
    "div",
    "Gridelement",
    "",
    currentUser.country,
    `rowReslut-${index}`,
  );
  createElement(
    "div",
    "Gridelement",
    "",
    currentUser.score,
    `rowReslut-${index}`,
  );

  createElement(
    "div",
    "Gridelement",
    `actions-${index}`,
    "",
    `rowReslut-${index}`,
  );

  let btn1 = createElement("button", "but", "", "", `actions-${index}`);
  btn1.innerHTML = `<img src="./assets/SVG/delete.svg">`;
  btn1.dataset.id = currentUser.ID;
  btn1.dataset.action = "delete";

  let btn2 = createElement(
    "button",
    "but",
    "",
    `+${SCORE}`,
    `actions-${index}`,
  );
  btn2.dataset.id = currentUser.ID;
  btn2.dataset.action = "Add";

  let btn3 = createElement(
    "button",
    "but",
    "",
    `-${SCORE}`,
    `actions-${index}`,
  );
  btn3.dataset.id = currentUser.ID;
  btn3.dataset.action = "Minus";
}

function noDataToShow(showMessage) {
  const nD = getElementUsingID("NoData");

  if (showMessage) {
    nD.style.display = "flex";
  } else {
    nD.style.display = "none";
  }
}

function DisplayScreen() {
  getUsersDataFromLocalStorage();
  const reslut = getElementUsingID("reslut");
  reslut.innerHTML = "";
  if (usersData.length > 0) {
    noDataToShow(false);

    for (let i = 0; i < usersData.length; i++) {
      createDisplayElement(i);
    }
  } else {
    noDataToShow(true);
  }
}

function cleanChoices() {
  getElementUsingID("F-Name").value = null;
  getElementUsingID("L-Name").value = null;
  getElementUsingID("Country").value = null;
  getElementUsingID("Player-score").value = null;
}

document.addEventListener("DOMContentLoaded", () => {
  getElementUsingID("AddPlayer").addEventListener("click", () => {
    if (
      getElementUsingID("F-Name").value &&
      getElementUsingID("L-Name").value &&
      getElementUsingID("Player-score").value &&
      getElementUsingID("Country").value
    ) {
      getElementUsingID("ErrorMessage").style.display = "none";
      addNewUser();
      cleanChoices();
    } else {
      getElementUsingID("ErrorMessage").style.display = "flex";
    }
    DisplayScreen();
  });

  const scorFild = getElementUsingID("Player-score");
  scorFild.addEventListener("input", () => {
    if (Number(scorFild.value) > 100) {
      scorFild.value = 100;
    } else if (Number(scorFild.value) < 0) {
      scorFild.value = 0;
    }
  });
  const elements = [
    getElementUsingID("F-Name"),
    getElementUsingID("L-Name"),
    getElementUsingID("Country"),
  ];

  elements.forEach((el) => {
    el.addEventListener("input", (e) => {
      e.target.value = e.target.value.replace(/[^a-zA-Z\s-]/g, "");
    });
  });

  const recordsContener = getElementUsingID("reslut");

  recordsContener.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-action]");

    if (!btn) return;

    let id = Number(btn.dataset.id);
    let action = btn.dataset.action;
    if (action === "Add") {
      updateUserScore(id, SCORE);
    } else if (action === "Minus") {
      updateUserScore(id, -SCORE);
    } else if (action === "delete") {
      removeUserFromLocalStorage(id);
    }
  });
});

DisplayScreen();
