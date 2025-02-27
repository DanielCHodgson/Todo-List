import "./Dashboard.css"
import FilterPane from "../FilterPane/FilterPane";
import SwimLane from "../SwimLane/SwimLane";
import Utility from "../../Utilities/domUtility";

export default function Dashboard(events) {

    const container = document.querySelector(".content");
    const filterPane = FilterPane();

    function createHeader(title) {

        const header = Utility.createElement("div", "header");

        const heading = Utility.createElement("h2", "dashboard-title", title)
   
        const newTaskBtn = Utility.createElement("button", "new-task", "create");
        newTaskBtn.addEventListener("click", handleNewTaskClick);

        header.appendChild(heading);
        header.appendChild(newTaskBtn);
        container.appendChild(header);
    }


    function handleNewTaskClick() {
        if (!document.querySelector("create-task-modal")) {
            events.emit("renderModal", {})
        }
    }

    function renderSwimLanes() {

        const swimLanes = document.createElement("div");
        swimLanes.classList.add("swim-lanes");
        container.appendChild(swimLanes);

        const lane = new SwimLane(swimLanes, events, "ready-to-start");
        lane.render(container, events);
    }

    function render() {
        createHeader("Board")
        filterPane.render(container);
        renderSwimLanes();
    }

    return {
        render
    }

}