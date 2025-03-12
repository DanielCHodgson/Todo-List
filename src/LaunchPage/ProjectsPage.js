import "./ProjectsPage.css";
import ProjectService from "../services/ProjectService";
import DomUtility from "../utilities/DomUtility";
import EventBus from "../utilities/EventBus";
import getIcons from "../res/icons/icons";

export default function ProjectsPage() {

    const parent = document.querySelector(".content");
    let projects = null;
    let element = null;

    function open() {
        if (!parent.querySelector(".projects-page")) {
            projects = ProjectService.getProjects();
            element = createPage();
            render();
        }
    }


    function createProjectCard(name) {
        const projectCard = DomUtility.createElement("div", "project-card");
        projectCard.appendChild(DomUtility.createElement("p", "name", name));
        projectCard.addEventListener("click", handleOpenProjectClick(name));
        return projectCard;
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

        dummyCard.addEventListener("click", (name) => handleNewProjectClick(name))
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


        projects.forEach(project => {
            projectsList.appendChild(createProjectCard(project.name))
        });

        projectsList.appendChild(createDummyCard());

        if (projects === null) {
            projectsList.classList.add("init");
            projectsList.appendChild(createDemoCard());
        }

        projectsPage.appendChild(projectsList)

        return projectsPage;
    }

    function handleOpenProjectClick(name) {
        EventBus.emit("openProject", name);
    }

    function handleNewProjectClick() {
        EventBus.emit("addProject");
    }


    function destroy() {
        if (element) {
            element.remove();
            element = null;
            projects = null;
        }
    }

    function render() {
        if (parent && element) {
            if (!parent.querySelector(".projects-page"))
                parent.appendChild(element);
        }

    }

    return {
        open,
        render,
        destroy
    }

}