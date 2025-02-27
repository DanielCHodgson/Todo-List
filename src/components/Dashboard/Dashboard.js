import "./Dashboard.css"
import FilterPane from "../FilterPane/FilterPane";
import SwimLane from "../SwimLane/SwimLane";
import Utility from "../../Utilities/domUtility";

export default function Dashboard(project, events) {

    const container = document.querySelector(".content");
    const filterPane = FilterPane();
    let lanes = [];

    events.on("createTask", (data) => addTaskToSwimLane(data));

    function createHeader(title) {
        const header = Utility.createElement("div", "header");
        const heading = Utility.createElement("h2", "dashboard-title", title)
        const newTaskBtn = Utility.createElement("button", "new-task", "create");
        newTaskBtn.addEventListener("click", handleNewTaskClick);
        header.appendChild(heading);
        header.appendChild(newTaskBtn);
        return header;
    }

    function addTaskToSwimLane(data) {
        console.log("after emit");
        console.log({data});
        const lane = lanes.find(lane => data.status === lane.getStatus());
        lane.addNewTask(data);
    }

    function handleNewTaskClick() {
        if (!document.querySelector("create-task-modal")) {
            events.emit("renderModal", {})
        }
    }

    function createSwimLanes() {
        const swimLanes = document.createElement("div");
        swimLanes.classList.add("swim-lane-list");

        lanes.push(
            new SwimLane(swimLanes, project.getTaskService(), "ready to start"),
            new SwimLane(swimLanes, project.getTaskService(), "in progress"),
            new SwimLane(swimLanes, project.getTaskService(), "in review"),
            new SwimLane(swimLanes, project.getTaskService(), "closed"),
        );

        return swimLanes;
    }

    function render() {
        const dashboard = Utility.createElement("div", "dashboard");
        dashboard.appendChild(createHeader("Board"));
        filterPane.render(dashboard);
        dashboard.appendChild(createSwimLanes());
        lanes.forEach(lane => lane.render())
        container.appendChild(dashboard);
    }

    return {
        render
    }

}