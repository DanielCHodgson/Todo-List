import "./Dashboard.css"
import FilterPane from "../FilterPane/FilterPane";
import SwimLane from "../SwimLane/SwimLane";
import Utility from "../../Utilities/domUtility";
import Task from "../../data/Models/TaskModel";

export default function Dashboard(project, events) {

    const container = document.querySelector(".content");
    const filterPane = FilterPane();
    const taskService = project.getTaskService();

    let lanes = [];

    events.on("createTask", (data) => createTask(data));
    events.on("UpdateTask", (data) => updateTask(data));


    function createSwimLanes(lanesContainer) {
        return [
            new SwimLane(lanesContainer, project.getTaskService(), events, "ready to start"),
            new SwimLane(lanesContainer, project.getTaskService(), events, "in progress"),
            new SwimLane(lanesContainer, project.getTaskService(), events, "in review"),
            new SwimLane(lanesContainer, project.getTaskService(), events, "closed")
        ];
    }

    function createHeader(title) {
        const header = Utility.createElement("div", "header");
        const heading = Utility.createElement("h2", "dashboard-title", title)
        const newTaskBtn = Utility.createElement("button", "new-task", "create");
        newTaskBtn.addEventListener("click", handleNewTaskClick);
        header.appendChild(heading);
        header.appendChild(newTaskBtn);
        return header;
    }

    function addTaskToSwimLane(task) {
        const lane = lanes.find(lane => task.getStatus() === lane.getStatus());
        console.log(task)
        console.log(lane)
        lane.addTask(task);
    }

    function removeTaskFromSwimLane(task) {
        const lane = lanes.find(lane => task.getStatus() === lane.getStatus());
        lane.removeTask(task);
    }

    function createTask(data) {
        const { project, summary, description, priority, date, status } = data;
        const id = `${project}-${taskService.getIndex()}`;
        const task = new Task(id, project, summary, description, priority, date, status);
        taskService.addTask(task);
        addTaskToSwimLane(task)
    }

    function updateTask(data) {

    }

    function handleNewTaskClick() {
        if (!document.querySelector(".create-task-modal")) {
            events.emit("openNewTaskModal", {})
        }
    }

    function render() {
        const dashboard = Utility.createElement("div", "dashboard");
        dashboard.appendChild(createHeader("Board"));
        filterPane.render(dashboard);

        const lanesContainer = document.createElement("div");
        lanesContainer.classList.add("swim-lane-list");
        dashboard.appendChild(lanesContainer)

        lanes = createSwimLanes(lanesContainer);
      

        lanes.forEach(lane => {
            lane.render(lanesContainer)
        });
        container.appendChild(dashboard);
    }

    return {
        render
    }

}