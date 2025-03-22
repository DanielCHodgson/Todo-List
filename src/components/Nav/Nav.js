import "./Nav.css";
import getIcons from "../../res/icons/icons";
import DomUtility from "../../utilities/DomUtility";
import ProjectService from "../../services/ProjectService";
import EventBus from "../../utilities/EventBus";

export default class Nav {
    #currentProject;
    #nav;
    #element;
    #dropdownButton;
    #dropdownClickHandler;
    #windowClickHandler;

    constructor() {
        this.#currentProject = ProjectService.CURRENT_PROJECT;
        this.#nav = document.querySelector(".nav");
        this.#element = this.createElement();
        this.#dropdownClickHandler = this.handleDropDownClick.bind(this);
        this.#windowClickHandler = this.handleWindowClick.bind(this);
        this.render();
    }

    createElement() {
        const navPane = DomUtility.createElement("div", "nav-pane");
        navPane.appendChild(this.createLeftNav());
        navPane.appendChild(this.createRightNav());
        return navPane;
    }

    createHeader() {
        const navHeader = DomUtility.createElement("div", "nav-header");

        if (this.#currentProject !== null) {
            const icon = DomUtility.createImg(this.#currentProject.getIcon(), "team-icon", "3rem", "3rem");
            const name = DomUtility.createElement("p", "project-name", this.#currentProject.getName());
            const type = DomUtility.createElement("p", "project-type", `${this.#currentProject.getType()} project`);
            navHeader.append(icon, name, type);

            this.#dropdownButton = DomUtility.createElement("button", "dropdown-button");
            const toggleIcon = DomUtility.renderSvg(getIcons().chevronDown);
            this.#dropdownButton.appendChild(toggleIcon);
            navHeader.appendChild(this.#dropdownButton);

            const dropdownContent = DomUtility.createElement("div", "dropdown-content");
            dropdownContent.classList.add("hidden");

            const projects = JSON.parse(localStorage.getItem(ProjectService.PROJECTS_KEY)) || [];
            projects.forEach((project) => {
                const option = DomUtility.createElement("p", "option", project.name);
                option.addEventListener("click", () => {
                    EventBus.emit("switchProject", project.name);
                });
                dropdownContent.appendChild(option);
            });

            this.#dropdownButton.addEventListener("click", (event) => this.#dropdownClickHandler(event, dropdownContent));
            window.addEventListener("click", this.#windowClickHandler);

            navHeader.appendChild(dropdownContent);
        }
        return navHeader;
    }

    handleDropDownClick(event, dropdownContent) {
        event.stopPropagation();
        dropdownContent.classList.toggle("hidden");
        dropdownContent.classList.toggle("visible");

        const icon = dropdownContent.classList.contains("visible")
            ? getIcons().chevronUp
            : getIcons().chevronDown;
        this.#dropdownButton.firstChild.replaceWith(DomUtility.renderSvg(icon));
    }

    handleWindowClick(event) {
        if (this.#nav && !this.#nav.contains(event.target)) {
            const dropdownContent = this.#nav.querySelector(".dropdown-content");
            if (dropdownContent?.classList.contains("visible")) {
                dropdownContent.classList.remove("visible");
                dropdownContent.classList.add("hidden");
                this.#dropdownButton.firstChild.replaceWith(DomUtility.renderSvg(getIcons().chevronDown));
            }
        }
    }

    createNavList() {
        const navList = DomUtility.createElement("ul", "nav-list");

        const items = [
            { class: "projects", text: "Projects", event: "openProjectsPage", icon: getIcons().projects },
            { class: "tasks", text: "Tasks", event: "openTasksPage", icon: getIcons().backlog },
            { class: "board", text: "Dashboard", event: "loadDashboard", icon: getIcons().dashboard },
            { class: "settings", text: "Settings", event: null, icon: getIcons().settings },
        ];

        items.forEach(({ class: className, text, event, icon }) => {
            const item = DomUtility.createElement("li", className, text);
            item.prepend(DomUtility.renderSvg(icon));
            if (event) item.addEventListener("click", () => EventBus.emit(event));
            navList.appendChild(item);
        });

        return navList;
    }

    createLeftNav() {
        const leftNav = DomUtility.createElement("div", "left-nav");

        const logo = DomUtility.createElement("div", "logo");
        const logoImg = DomUtility.createElement("div", "logo-img");
        logoImg.appendChild(DomUtility.renderSvg(getIcons().logo));
        logo.appendChild(logoImg);

        const iconsContainer = DomUtility.createElement("div", "left-nav-icons");

        const search = DomUtility.createElement("div", "search");
        search.appendChild(DomUtility.renderSvg(getIcons().search));
        search.addEventListener("click", () => alert("I'm beyond the scope of this project!"));

        const addProject = DomUtility.createElement("div", "add-project");
        addProject.appendChild(DomUtility.renderSvg(getIcons().addProject));
        addProject.addEventListener("click", () => EventBus.emit("addProject"));

        iconsContainer.append(search, addProject);
        leftNav.append(logo, iconsContainer);
        return leftNav;
    }

    createRightNav() {
        const rightNav = DomUtility.createElement("div", "right-nav");
        rightNav.appendChild(this.createHeader());
        rightNav.appendChild(this.createNavList());
        return rightNav;
    }

    cleanup() {
        if (this.#dropdownButton) {
            this.#dropdownButton.removeEventListener("click", this.#dropdownClickHandler);
        }
        window.removeEventListener("click", this.#windowClickHandler);
    }

    destroy() {
        this.cleanup();
        if (this.#element) {
            this.#element.remove();
        }
    }

    render() {
        this.destroy();
        this.#nav.appendChild(this.#element);
    }
}
