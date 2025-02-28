import "./Dashboard.css"
import FilterPane from "../FilterPane/FilterPane";
import SwimLane from "../SwimLane/SwimLane";
import Utility from "../../Utilities/domUtility";

export default function Dashboard(project, events) {

    const container = document.querySelector(".content");
    const filterPane = FilterPane();

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
        const lane = lanes.find(lane => data.status === lane.getStatus());
        lane.addNewTask(data);
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


        let lanes = [
            new SwimLane(lanesContainer, project.getTaskService(), events, "ready to start"),
            new SwimLane(lanesContainer,project.getTaskService(), events, "in progress"),
            new SwimLane(lanesContainer,project.getTaskService(), events, "in review"),
            new SwimLane(lanesContainer,project.getTaskService(), events, "closed")
        ];
    

        lanes.forEach(lane => {
            lane.render(lanesContainer)
        });
        container.appendChild(dashboard);
    }

    return {
        render
    }

}