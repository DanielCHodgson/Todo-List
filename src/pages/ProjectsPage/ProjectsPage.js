import "./ProjectsPage.css";
import ProjectService from "../../services/ProjectService";
import DomUtility from "../../utilities/DomUtility";
import EventBus from "../../utilities/EventBus";
import getIcons from "../../res/icons/icons";

export default class ProjectsPage {

    #parent;
    #projects;
    #element;
    #cards;
    #selectedCard;

    constructor() {
        this.#parent = document.querySelector(".content");
        this.#projects = ProjectService.loadFromLocalStorage();
        this.#cards = [];
        this.#element = this.#createPage();
        this.render();
    }

    #createProjectCard(name) {
        const projectCard = DomUtility.createElement("div", "project-card");

        const header = DomUtility.createElement("div", "header");
        const deleteBtn = DomUtility.createElement("button", "close");
        deleteBtn.appendChild(DomUtility.renderSvg(getIcons().close))
        deleteBtn.addEventListener("click", () => this.#handleDeleteClick(name));
        header.appendChild(deleteBtn);

        const body = DomUtility.createElement("div", "body");
        body.appendChild(DomUtility.createElement("p", "name", name));
        body.addEventListener("click", (event) => this.#handleOpenProjectClick(event, name));

        projectCard.appendChild(header);
        projectCard.appendChild(body);
        return projectCard;
    }

    #createDummyCard() {
        const dummyCard = DomUtility.createElement("div", "dummy-card");

        if (this.#projects.length === 0) {
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

        if (this.#projects.length > 0) {
            this.#projects.forEach(project => {
                
                const projectCard = this.#createProjectCard(project.name);
                
                if(project.name === ProjectService.CURRENT_PROJECT.getName()) {
                    projectCard.classList.toggle("selected")
                    this.#selectedCard = projectCard;
                }

                this.#cards.push(projectCard);
                projectsList.appendChild(projectCard);
            });
        }

        projectsList.appendChild(this.#createDummyCard());

        if (this.#projects.length === 0) {
            projectsList.classList.add("init");
            projectsList.appendChild(this.#createDemoCard());
        }

        projectsPage.appendChild(projectsList);

        return projectsPage;
    }

    #handleOpenProjectClick(event, name) {
        EventBus.emit("switchProject", name);
        this.#selectedCard.classList.toggle("selected");
        event.target.classList.toggle("selected");
        this.#selectedCard = event.target;
    }

    #handleDeleteClick(name) {
        EventBus.emit("deleteProject", name);
    }

    #handleNewProjectClick() {
        EventBus.emit("addProject");
    }

    destroy() {
        if (this.#element) {
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
