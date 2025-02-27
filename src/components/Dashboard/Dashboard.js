import "./Dashboard.css"
import FilterPane from "../FilterPane/FilterPane";
import SwimLane from "../SwimLane/SwimLane";
import Utility from "../../Utilities/domUtility";

export default function Dashboard(project, events) {

    const container = document.querySelector(".content");
    const filterPane = FilterPane();

    function createHeader(title) {

        const header = Utility.createElement("div", "header");
        const heading = Utility.createElement("h2", "dashboard-title", title)
        const newTaskBtn = Utility.createElement("button", "new-task", "create");
        newTaskBtn.addEventListener("click", handleNewTaskClick);

        header.appendChild(heading);
        header.appendChild(newTaskBtn);
        return header;
    }


    function handleNewTaskClick() {
        if (!document.querySelector("create-task-modal")) {
            events.emit("renderModal", {})
        }
    }

    function createSwimLanes() {

        const swimLanes = document.createElement("div");
        swimLanes.classList.add("swim-lanes");

        const lane = new SwimLane(swimLanes, project.getTaskService(), events, "ready-to-start");
        lane.render();

        return swimLanes;
    }

    function render() {
        const dashboard = Utility.createElement("div", "dashboard");
        dashboard.appendChild(createHeader("Board"));
        filterPane.render(dashboard);
        dashboard.appendChild(createSwimLanes());
        container.appendChild(dashboard);
    }

    return {
        render
    }

}