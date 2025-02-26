import "./Dashboard.css"
import FilterPane from "../FilterPane/FilterPane";
import SwimLane from "../../Classes/SwimLane/SwimLane";
import Utility from "../../Utilities/domUtility";

export default function Dashboard(events) {

    const container = document.querySelector(".content");
    const filterPane = FilterPane();
    const lane = new SwimLane();

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
        lane.render(swimLanes);
        container.appendChild(swimLanes);
    }

    function render() {
        createHeader("Board")
        filterPane.render(container);
        renderSwimLanes();
        events.emit("han")
    }

    return {
        render
    }

}