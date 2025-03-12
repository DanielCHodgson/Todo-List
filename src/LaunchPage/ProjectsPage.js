import "./ProjectsPage.css";
import ProjectService from "../services/ProjectService";
import DomUtility from "../utilities/DomUtility";
import EventBus from "../utilities/EventBus";
import getIcons from "../res/icons/icons";

export default class ProjectsPage {

    #parent;
    #projects;
    #element;

    constructor() {
        this.#parent = document.querySelector(".content");
        this.#projects = ProjectService.getProjects();
        this.#element = this.#createPage();
        this.render();
    }


    #createProjectCard(name) {
        const projectCard = DomUtility.createElement("div", "project-card");
        projectCard.appendChild(DomUtility.createElement("p", "name", name));
        projectCard.addEventListener("click", this.#handleOpenProjectClick(name));
        return projectCard;
    }

    #createDummyCard() {
        const dummyCard = DomUtility.createElement("div", "dummy-card");

        if (this.#projects === null) {
            dummyCard.classList.add("bounce");
            dummyCard.appendChild(DomUtility.createElement("p", "prompt", "Start from scratch"));
        }
        const icon = DomUtility.createElement("div", "plus-icon");
        icon.appendChild(DomUtility.renderSvg(getIcons().add));

        dummyCard.appendChild(icon);

        dummyCard.addEventListener("click", (name) => this.#handleNewProjectClick(name));
        return dummyCard;
    }

    #createDemoCard() {
        const dummyCard = DomUtility.createElement("div", "dummy-card");

        dummyCard.classList.add("bounce");
        dummyCard.appendChild(DomUtility.createElement("p", "prompt", "Load demo data"));

        const icon = DomUtility.createElement("div", "plus-icon");
        icon.appendChild(DomUtility.renderSvg(getIcons().add));
        dummyCard.appendChild(icon);

        dummyCard.addEventListener("click", () => EventBus.emit("loadDemoEnv"));
        return dummyCard;
    }

    #createPage() {
        const projectsPage = DomUtility.createElement("div", "projects-page");
        const projectsList = DomUtility.createElement("div", "projects-list");

        if (this.#projects !== null) {
            this.#projects.forEach(project => {
                projectsList.appendChild(this.#createProjectCard(project.name));
            });
        }

        projectsList.appendChild(this.#createDummyCard());

        if (this.#projects === null) {
            projectsList.classList.add("init");
            projectsList.appendChild(this.#createDemoCard());
        }

        projectsPage.appendChild(projectsList);

        return projectsPage;
    }

    #handleOpenProjectClick(name) {
        return () => {
            EventBus.emit("openProject", name);
        };
    }

    #handleNewProjectClick() {
        EventBus.emit("addProject");
    }

    destroy() {
        if (this.#element) {
            console.log("destroying projects page!")
            this.#element.remove();
            this.#element = null;
            this.#projects = null;
        }
    }

    render() {
        if (!this.#parent.querySelector(".projects-page"))
            this.#parent.appendChild(this.#element);
    }
}
