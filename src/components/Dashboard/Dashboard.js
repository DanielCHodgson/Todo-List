import "./Dashboard.css"
import FilterPane from "../FilterPane/FilterPane";
import NewTaskModal from "../NewTaskModal/NewTaskModal";

export default function Dashboard() {

    const container = document.querySelector(".content");
    const filterPane = FilterPane();

    const newTaskModal = NewTaskModal();

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
        if(!document.querySelector("create-task-modal")) {
            newTaskModal.render();
        }
    }


    function render() {
        createHeader("Board")
        filterPane.render(container);
    }
    
    return {
        render
    }

}