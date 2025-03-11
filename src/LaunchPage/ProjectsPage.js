import "./ProjectsPage.css";
import ProjectService from "../services/ProjectService";
import DomUtility from "../utilities/DomUtility";
import EventBus from "../utilities/EventBus";
import getIcons from "../res/icons/icons";

export default function ProjectsPage() {

    const projects = localStorage.getItem(ProjectService.PROJECT_STORAGE_KEY);
    const parent = document.querySelector(".content")
    const element = createPage();


    function createProjectCard() {

    }

    function createDummyCard() {
        const dummyCard = DomUtility.createElement("div", "dummy-card");

        if (projects === null) {
            dummyCard.classList.add("bounce");
            dummyCard.appendChild(DomUtility.createElement("p", "prompt", "Start from scratch"));
        }
        const icon = DomUtility.createElement("div", "plus-icon");
        icon.appendChild(DomUtility.renderSvg(getIcons().add));

        dummyCard.appendChild(icon);

        dummyCard.addEventListener("click", handleNewProjectClick)
        return dummyCard;
    }

    function createDemoCard() {
        const dummyCard = DomUtility.createElement("div", "dummy-card");

        dummyCard.classList.add("bounce");
        dummyCard.appendChild(DomUtility.createElement("p", "prompt", "Load demo data"));

        const icon = DomUtility.createElement("div", "plus-icon");
        icon.appendChild(DomUtility.renderSvg(getIcons().add));
        dummyCard.appendChild(icon);

        dummyCard.addEventListener("click", () => EventBus.emit("loadDemoEnv"));
        return dummyCard;
    }

    function createPage() {
        const projectsPage = DomUtility.createElement("div", "projects-page");
        const projectsList = DomUtility.createElement("div", "projects-list");

        projectsList.appendChild(createDummyCard());
        if (projects === null) {
            projectsList.classList.add("init");
            projectsList.appendChild(createDemoCard());
        }

        projectsPage.appendChild(projectsList)

        return projectsPage;
    }

    function handleNewProjectClick() {
        EventBus.emit("addProject");
    }


    function destroy() {
        if (element) {
            projects = null;
            element.remove();
        }
    }

    function render() {
        if (parent && element)
            parent.appendChild(element);
    }

    return {
        render,
        destroy
    }

}