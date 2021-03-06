"use strict";

import * as notification from "./notification.js";

let allTasks = []; // user tasks
let currentlyEditingTask = null; // for use later in edit and delete

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
let clickedDay = new Date().getDate();
let clickedMonth = new Date().getMonth();	// months is off by 1, eg. January = 0, December = 11
let clickedYear = new Date().getFullYear();

const today = `${clickedYear}-${(clickedMonth + 1).toString().padStart(2, "0")}-${(clickedDay).toString().padStart(2, "0")}`;

const url = window.location.pathname; // reads url
const split = url.split("/");

// ON LOAD
window.addEventListener("load", () => {
	// Displayed in the Dark Blue part of the Calandar
	// on load, it displays the current day, month and year
	document.getElementById("selectedDay").innerHTML = new Date().getDate();
	document.getElementById("month").innerHTML = months[new Date().getMonth()];
	document.getElementById("year").innerHTML = new Date().getFullYear();

	// renders the days in the calandar
	renderDays(document.getElementById("daysTable"), new Date().getMonth(), new Date().getFullYear());

	// GET request: grab tasks the user currently has from server, then update allTasks array
	fetch(`/api/users/${split[2]}/tasks`)
		.then(response => {
			return response.json();
		}).then(obj => {
			// if we get no errors
			if (obj.status === 0) {
				allTasks = obj.result;

				// render today's tasks
				renderTask(document.getElementById("selectedDayTasks"), allTasks.filter(day => {
					return new Date(day.date).getTime() === new Date(today).getTime();
				}));

				// renders the tasks in modal
				renderModalTasks(document.getElementById("modalTasksBody"), allTasks.filter(task => {
					return new Date(task.date).getTime() >= new Date(today).getTime();
				}));
				// includes all tasks, including the tasks from selected tasks

				// filters out expired tasks
				renderTask(document.getElementById("futureTasks"), allTasks.filter(day => {
					return new Date(day.date).getTime() > new Date(today).getTime();
				}));
			} else {
				throw new Error("something went wrong with getting the tasks from the server: " + obj.result);
			}
		}).catch(notification.showDangerToast);
});

// ================ CALENDAR =======================
/**
 * Render days on the calandar
 *
 * @param {HTMLElement} element
 * @param {Number} month the month to render(off by 1; according to Calandar class)
 * @param {Number} year the year to render
 */
function renderDays (element, month, year) {
	element.innerHTML = "";

	const firstDay = (new Date(year, month)).getDay();
	const lastDay = 32 - new Date(year, month, 32).getDate();

	let day = 1;

	for (let i = 0; i < 6; i++) {
		// if last row and there are no days on this row,
		// do not render it
		if (i === 5 && day > lastDay) {
			break;
		}
		const outerWrapper = document.createElement("div");
		outerWrapper.classList.add("row", "text-center");

		const innerWrapper = document.createElement("div");
		innerWrapper.classList.add("d-flex", "justify-content-between");
		outerWrapper.appendChild(innerWrapper);

		for (let j = 0; j < 7; j++) {
			const dayDiv = document.createElement("div");
			dayDiv.classList.add("col");
			dayDiv.setAttribute("id", "days");

			// dayDiv does not display a number if those squares are not days
			if (!(i === 0 && j < firstDay) && day <= lastDay) {
				dayDiv.innerHTML = day.toString();
				day++;
			}

			// when a day is clicked on the dayTable, render
			// tasks for that day
			dayDiv.addEventListener("click", () => {
				// if the dayDiv is an actual day, render new updated day
				if (dayDiv.innerHTML !== "") {
					document.getElementById("selectedDay").innerHTML = dayDiv.innerHTML;
					clickedDay = dayDiv.innerHTML;

					const date = `${clickedYear}-${(clickedMonth + 1).toString().padStart(2, "0")}-${(clickedDay).toString().padStart(2, "0")}`;

					// from allTasks array, get all days that matches this day
					const clickedDayArray = allTasks.filter(task => task.date === date);
					renderTask(document.getElementById("selectedDayTasks"), clickedDayArray);
				}
			});
			innerWrapper.appendChild(dayDiv);
		}
		element.appendChild(outerWrapper);
	}
}

// event listener for previous month arrow button
document.getElementById("prev").addEventListener("click", () => {
	if (clickedMonth === 0) {
		clickedMonth = 11;
		clickedYear--;
	} else {
		clickedMonth--;
	}

	// renders the day, month and year
	document.getElementById("selectedDay").innerHTML = clickedDay;
	document.getElementById("month").innerHTML = months[clickedMonth];
	document.getElementById("year").innerHTML = clickedYear;

	// renders the days in the calandar
	renderDays(document.getElementById("daysTable"), clickedMonth, clickedYear);
});

// event listener for previous month arrow button
document.getElementById("next").addEventListener("click", () => {
	if (clickedMonth === 11) {
		clickedMonth = 0;
		clickedYear++;
	} else {
		clickedMonth++;
	}

	// renders the day, month and year
	document.getElementById("selectedDay").innerHTML = clickedDay;
	document.getElementById("month").innerHTML = months[clickedMonth];
	document.getElementById("year").innerHTML = clickedYear;

	// renders the days in the calandar
	renderDays(document.getElementById("daysTable"), clickedMonth, clickedYear);
});

// ==============================================
// ==============================================
// ==============================================
// ================ TASKS =======================

/**
 * Create only tasks in the selected day's tasks or future tasks(not modals)
 * @param {obj} task task obj{name, description, class, date, time}
 * @returns a task(in selected day/future task) element
 */
function createTask (userTask) {
	const taskHolder = document.createElement("div");
	taskHolder.classList.add("form-check");

	const taskInput = document.createElement("input");
	taskInput.classList.add("form-check-input");
	taskInput.setAttribute("type", "checkbox");
	taskInput.setAttribute("value", "");
	taskInput.setAttribute("id", "flexCheckDefault");

	const task = document.createElement("label");
	task.classList.add("form-check-label");
	task.setAttribute("for", "flexCheckDefault");
	task.innerHTML = `${userTask.name}`;

	// space in between the user task and the edit button
	const space = document.createElement("span");
	space.innerHTML = " ";

	const editButton = document.createElement("button");
	editButton.classList.add("btn", "btn-outline-light", "btn-sm", "rounded", "border-end");
	editButton.setAttribute("type", "button");
	editButton.setAttribute("data-bs-toggle", "modal");
	editButton.setAttribute("data-bs-target", "#tasksModal");
	editButton.setAttribute("data-placement", "top");
	const editButtonText = document.createElement("span");
	editButtonText.innerHTML = " Edit";
	editButtonText.style.color = "black";

	const i = document.createElement("i");
	i.classList.add("fa", "fa-table");
	i.style.color = "black";

	editButton.appendChild(i);
	editButton.appendChild(editButtonText);
	editButton.addEventListener("click", () => {
		// when the edit button is clicked, display submit edit button and delete button
		// then hide the add button(this is done with the following 3 if statements)
		document.getElementById("tasksTitle").innerHTML = "Edit Task";
		const addTaskButton = document.getElementById("addTaskButton");
		if (window.getComputedStyle(addTaskButton).display === "block") {
			addTaskButton.style.display = "none";
		}

		const submitEditTaskButton = document.getElementById("submitEditTaskButton");
		if (window.getComputedStyle(submitEditTaskButton).display === "none") {
			submitEditTaskButton.style.display = "block";
		}
		const deleteTaskButton = document.getElementById("deleteTaskButton");
		if (window.getComputedStyle(deleteTaskButton).display === "none") {
			deleteTaskButton.style.display = "block";
		}

		// when the user clicks the edit button of a task, in modal,
		// display the clicked tasks on the left of current tasks
		document.getElementById("taskName").value = userTask.name;
		document.getElementById("taskDate").value = userTask.date;
		document.getElementById("taskTime").value = userTask.time;
		document.getElementById("taskDescription").value = userTask.description;

		// global variable used to update this task for use in edit button
		// update task by reference
		currentlyEditingTask = userTask;
	});

	// mouseover and mouseout are the 2 events you need to create a hover effect for the button
	editButton.addEventListener("mouseover", () => {
		editButton.style.backgroundColor = "#0d6efd";
		editButton.style.border = "none";
		editButtonText.style.color = "white";
		i.style.color = "white";
	});

	editButton.addEventListener("mouseout", () => {
		editButton.style.backgroundColor = "transparent";
		editButton.style.borderRight = "solid 1px black";
		editButtonText.style.color = "black";
		i.style.color = "black";
	});

	task.appendChild(space);
	task.appendChild(editButton);

	taskHolder.appendChild(taskInput); // append taskInput, task, and li to the taskHolder parent div
	taskHolder.appendChild(task);

	return taskHolder;
}

/**
 * Create tasks in tasks modal
 * @param {string} name name of task
 * @param {string} description description of the task
 * @param {string} date date when the task is due(yyyy-mm-dd)
 * @param {string} time time when the task is due(HH:mm), time is using 24 hour clock system(aka. military time)
 * @returns a modal task element
 */
function createModalTasks (name, description, date, time) {
	const arr = [description, date, time];

	const row = document.createElement("tr");

	const header = document.createElement("th");
	header.setAttribute("scope", "row");
	header.innerHTML = name;
	row.appendChild(header);

	for (let i = 0; i < 3; i++) {
		const col = document.createElement("td");
		col.innerHTML = arr[i];
		col.style.wordBreak = "break-all";
		row.appendChild(col);
	}

	return row;
}

/**
 * either renders the selected day's tasks or future tasks(not tasks in modal)
 * @param {HTMLElement} element
 * @param {array} taskArray the array to render at the element
 */
function renderTask (element, taskArray) {
	element.innerHTML = "";

	for (let i = 0; i < taskArray.length; i++) {
		element.appendChild(createTask(taskArray[i]));
	}
}

/**
 * renders all tasks in modals
 * @param {HTMLElement} element
 * @param {Array<Object>} tasks the tasks to render
 */
function renderModalTasks (element, tasks) {
	element.innerHTML = "";

	for (let i = 0; i < tasks.length; i++) {
		const taskHolder = createModalTasks(tasks[i].name, tasks[i].description, tasks[i].date, tasks[i].time);
		element.appendChild(taskHolder);
	}
}

// open modal when add new task button is clicked
document.getElementById("addTaskOpenModal").addEventListener("click", () => {
	// when user clicks the open modal, clear the input fields on the left side
	document.getElementById("taskName").value = "";
	document.getElementById("taskDate").value = "";
	document.getElementById("taskTime").value = "";
	document.getElementById("taskDescription").value = "";

	document.getElementById("tasksTitle").innerHTML = "Add a Task";

	// if add task button is clicked, only display add button
	const addTaskButton = document.getElementById("addTaskButton");
	if (window.getComputedStyle(addTaskButton).display === "none") {
		addTaskButton.style.display = "block";
	}

	// make submit and edit button invisible
	const submitEditTaskButton = document.getElementById("submitEditTaskButton");
	if (window.getComputedStyle(submitEditTaskButton).display === "block") {
		submitEditTaskButton.style.display = "none";
	}
	const deleteTaskButton = document.getElementById("deleteTaskButton");
	if (window.getComputedStyle(deleteTaskButton).display === "block") {
		deleteTaskButton.style.display = "none";
	}
});

// date is yyyy-MM-dd
// time is HH:mm
document.getElementById("addTaskButton").addEventListener("click", () => {
	const taskName = document.getElementById("taskName").value;
	const taskDate = document.getElementById("taskDate").value;
	const taskTime = document.getElementById("taskTime").value;
	const taskDescription = document.getElementById("taskDescription").value;

	// stops user from adding tasks with some empty fields
	if (taskName.length === 0 || taskDate.length === 0 || taskTime === 0 || taskDescription === 0) {
		return;
	}

	const temp = {
		name: taskName,
		description: taskDescription,
		date: taskDate,
		time: taskTime
	};

	// POST request: tell server to add a task, then update allTasks array
	fetch(`/api/users/${split[2]}/tasks/create`, {
		method: "POST",
		body: JSON.stringify(temp),
		headers: {
			"Content-Type": "application/json"
		}
	}).then(response => {
		return response.json();
	}).then(obj => {
		if (obj.status !== 0) {
			throw new Error(obj.result);
		}

		allTasks.push(temp);
		renderModalTasks(document.getElementById("modalTasksBody"), allTasks.filter(task => { // re render task modal
			return new Date(task.date).getTime() >= new Date(today).getTime();
		}));

		renderTask(document.getElementById("futureTasks"), allTasks.filter(task => { // re render future tasks
			return new Date(task.date).getTime() > new Date(today).getTime();
		}));
		renderTask(document.getElementById("selectedDayTasks"), allTasks.filter(task => { // re render selected days tasks
			return task.date === `${clickedYear}-${(clickedMonth + 1).toString().padStart(2, "0")}-${(clickedDay).toString().padStart(2, "0")}`;
		}));
	}).catch(notification.showDangerToast);

	// clear all fields in the add tasks(left side of task modal)
	document.getElementById("taskName").value = "";
	document.getElementById("taskDate").value = "";
	document.getElementById("taskTime").value = "";
	document.getElementById("taskDescription").value = "";
});

// after clicking the submit button, update the changes for that task
document.getElementById("submitEditTaskButton").addEventListener("click", () => {
	const taskName = document.getElementById("taskName").value;
	const taskDate = document.getElementById("taskDate").value;
	const taskTime = document.getElementById("taskTime").value;
	const taskDescription = document.getElementById("taskDescription").value;

	// stops user from submitting tasks with some empty fields
	if (taskName.length === 0 || taskDate.length === 0 || taskTime === 0 || taskDescription === 0) {
		return;
	}

	const temp = {
		name: taskName,
		description: taskDescription,
		date: taskDate,
		time: taskTime
	};

	// POST the server with the edited values
	fetch(`/api/users/${split[2]}/tasks/${currentlyEditingTask.name}/edit`, {
		method: "POST",
		body: JSON.stringify(temp),
		headers: {
			"Content-Type": "application/json"
		}
	}).then(response => {
		return response.json();
	}).then(obj => {
		if (obj.status !== 0) {
			throw new Error(obj.result);
		}

		// edit the task in the allTasks array
		currentlyEditingTask.name = taskName;
		currentlyEditingTask.date = taskDate;
		currentlyEditingTask.time = taskTime;
		currentlyEditingTask.description = taskDescription;

		renderModalTasks(document.getElementById("modalTasksBody"), allTasks.filter(task => { // re render tasks
			return new Date(task.date).getTime() >= new Date(today).getTime();
		}));
		renderTask(document.getElementById("futureTasks"), allTasks.filter(task => { // re render future tasks
			return new Date(task.date).getTime() > new Date(today).getTime();
		}));
		renderTask(document.getElementById("selectedDayTasks"), allTasks.filter(task => { // re render selected days tasks
			return task.date === `${clickedYear}-${(clickedMonth + 1).toString().padStart(2, "0")}-${(clickedDay).toString().padStart(2, "0")}`;
		}));
	}).catch(notification.showDangerToast);

	// after submitting changes, clear all fields in the add tasks(left side of task modal)
	document.getElementById("taskName").value = "";
	document.getElementById("taskDate").value = "";
	document.getElementById("taskTime").value = "";
	document.getElementById("taskDescription").value = "";
});

document.getElementById("deleteTaskButton").addEventListener("click", () => {
	// POST the server and remove task from database
	fetch(`/api/users/${split[2]}/tasks/remove`, {
		method: "POST",
		body: JSON.stringify(currentlyEditingTask),
		headers: {
			"Content-Type": "application/json"
		}
	}).then(response => {
		return response.json();
	}).then(obj => {
		if (obj.status !== 0) {
			throw new Error(obj.result);
		}
		for (let i = 0; i < allTasks.length; i++) {
			if (currentlyEditingTask != null && allTasks[i] === currentlyEditingTask) {
				// search through allTasks array, if the values all match, delete the item at said index from client side storage
				allTasks.splice(i, 1);
				currentlyEditingTask = null;
				break;
			}
		}
		renderModalTasks(document.getElementById("modalTasksBody"), allTasks.filter(task => { // re render task modal
			return new Date(task.date).getTime() >= new Date(today).getTime();
		}));
		renderTask(document.getElementById("futureTasks"), allTasks.filter(task => { // re render future tasks
			return new Date(task.date).getTime() > new Date(today).getTime();
		}));
		renderTask(document.getElementById("selectedDayTasks"), allTasks.filter(task => { // re render selected days tasks
			return task.date === `${clickedYear}-${(clickedMonth + 1).toString().padStart(2, "0")}-${(clickedDay).toString().padStart(2, "0")}`;
		}));
	}).catch(notification.showDangerToast);

	// after deleting a task, clear all fields in the add tasks(left side of task modal)
	document.getElementById("taskName").value = "";
	document.getElementById("taskDate").value = "";
	document.getElementById("taskTime").value = "";
	document.getElementById("taskDescription").value = "";
});

// renders previous tasks(not todays tasks or future tasks)
document.getElementById("oldTasksButton").addEventListener("click", () => {
	renderModalTasks(document.getElementById("oldTasks"), allTasks.filter(task => {
		return new Date(task.date).getTime() < new Date(today).getTime();
	}));
});
