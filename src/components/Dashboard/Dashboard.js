import "./Dashboard.css"
import FilterPane from "../FilterPane/FilterPane";
import SwimLane from "../SwimLane/SwimLane";

export default function Dashboard(events) {

    const container = document.querySelector(".content");
    const filterPane = FilterPane();
    const lane = SwimLane();

    function createHeader(title) {

        const header = document.createElement("div")
        header.classList.add("header");

        const heading = document.createElement("h2");
        heading.classList.add("dashboard-title");
        heading.textContent = title;
        container.appendChild(heading);
        header.appendChild(heading);

        const newTaskBtn = document.createElement("button");
        newTaskBtn.classList.add("new-task");
        newTaskBtn.textContent = "Create";

        newTaskBtn.addEventListener("click", handleNewTaskClick);

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