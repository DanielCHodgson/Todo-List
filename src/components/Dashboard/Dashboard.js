import "./Dashboard.css";
import FilterPane from "../FilterPane/FilterPane";
import SwimLane from "../SwimLane/SwimLane";
import Utility from "../../Utilities/domUtility";
import Task from "../../data/Models/TaskModel";
import TaskCard from "../TaskCard/TaskCard";

export default function Dashboard(project, events) {
    const container = document.querySelector(".content");
    const taskService = project.getTaskService();
    const lanes = {};

    function createDashboard() {
        const dashboard = Utility.createElement("div", "dashboard");
        dashboard.appendChild(createHeader("Board"));

        const filterPane = FilterPane();
        filterPane.render(dashboard);

        const lanesContainer = Utility.createElement("div", "swim-lane-list");
        dashboard.appendChild(lanesContainer);

        createSwimLanes(lanesContainer)
    
        return dashboard;
    }


    function createSwimLanes(lanesContainer) {
        ["ready to start", "in progress", "in review", "closed"].forEach(status => {
            lanes[status] = new SwimLane(
                lanesContainer,
                taskService.getTasksByStatus(status).map(task => new TaskCard(task, events)),
                status
            );
            lanes[status].render(lanesContainer);
        });
    }

    function createHeader(title) {
        const header = Utility.createElement("div", "header");
        const heading = Utility.createElement("h2", "dashboard-title", title);
        const newTaskBtn = Utility.createElement("button", "new-task", "Create");
        newTaskBtn.addEventListener("click", handleNewTaskClick);
        header.appendChild(heading);
        header.appendChild(newTaskBtn);
        return header;
    }

    function addCard(task) {
        if (lanes[task.getStatus()]) {
            lanes[task.getStatus()].addCard(new TaskCard(task, events));
        }
    }

    function removeFromSwimLane(task) {
        if (lanes[task.getStatus()]) {
            lanes[task.getStatus()].removeCard(task.getId());
        }
    }

    function updateSwimLane(task) {
        if (lanes[task.getStatus()]) {
            lanes[task.getStatus()].updateCard(task.getId(), new TaskCard(task, events));
        }
    }

    function createTask(data) {
        const id = `${data.project}-${taskService.getIndex()}`;
        return new Task(id, data.project, data.summary, data.description, data.priority, data.date, data.status);
    }

    function updateTask(data) {

        const { task, newData } = data;
        const updatedTask = new Task(task.getId(), newData.project, newData.summary, newData.description, newData.priority, newData.date, newData.status);

        taskService.updateTask(task.getId(), updatedTask);

        if (task.getStatus() !== newData.status) {
            removeFromSwimLane(task);
            addCard(updatedTask);
        } else {
            updateSwimLane(updatedTask);
        }
    }

    function handleNewTaskClick() {
        if (!document.querySelector(".create-task-modal")) {
            events.emit("openNewTaskModal", {});
        }
    }

    function render() {
        container.innerHTML = "";
        container.appendChild(createDashboard());
    }

    events.on("createTask", (data) => {
        const task = createTask(data);
        taskService.addTask(task);
        addCard(task);
    });

    events.on("updateTask", (data) => {
        updateTask(data)}
    );

    return {
        render
    };
}
