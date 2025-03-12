import "./Nav.css";
import getIcons from "../../res/icons/icons";
import DomUtility from "../../utilities/DomUtility";
import ProjectService from "../../services/ProjectService";
import EventBus from "../../utilities/EventBus";

export default function nav() {

    const project = ProjectService.CURRENT_PROJECT;
    const nav = document.querySelector(".nav");
    const element = createElement();

    function createElement() {
        const navPane = DomUtility.createElement("div", "nav-pane");
        navPane.appendChild(createLeftNav())
        navPane.appendChild(createRightNav())
        return navPane;
    }

    function createHeader() {
        const navHeader = DomUtility.createElement("div", "nav-header");

        if (project !== null) {
            const icon = DomUtility.createImg(project.getIcon(), "team-icon", "3rem", "3rem");
            const name = DomUtility.createElement("p", "project-name", project.getName());
            const type = DomUtility.createElement("p", "project-type", `${project.getType()} project`);
            navHeader.append(icon, name, type);

            navHeader.append(icon, name, type);

            const dropdownButton = DomUtility.createElement("button", "dropdown-button");
            const toggleIcon = DomUtility.renderSvg(getIcons().chevronDown);
            dropdownButton.appendChild(toggleIcon);
            navHeader.appendChild(dropdownButton);

            const dropdownContent = DomUtility.createElement("div", "dropdown-content");
            dropdownContent.classList.add("hidden");

            const projects = JSON.parse(localStorage.getItem(ProjectService.PROJECT_STORAGE_KEY)) || [];
            projects.forEach((project) => {
                const option = DomUtility.createElement("p", "option", project.name);
                option.addEventListener("click", () => {
                    EventBus.emit("switchProject", option.textContent);
                });
                dropdownContent.appendChild(option);
            });

            dropdownButton.addEventListener("click", (event) => {
                event.stopPropagation();
                dropdownContent.classList.toggle("hidden");
                dropdownContent.classList.toggle("visible");

                const icon = dropdownContent.classList.contains("visible")
                    ? getIcons().chevronUp
                    : getIcons().chevronDown;
                dropdownButton.firstChild.replaceWith(DomUtility.renderSvg(icon));
            });

            window.addEventListener("click", (event) => {
                if (nav && !nav.contains(event.target) && dropdownContent.classList.contains("visible")) {
                    dropdownContent.classList.remove("visible");
                    dropdownContent.classList.add("hidden");
                    dropdownButton.firstChild.replaceWith(DomUtility.renderSvg(getIcons().chevronDown));
                }
            });

            navHeader.appendChild(dropdownContent);
        }
        return navHeader;
    }

    function createNavList() {

        const navList = DomUtility.createElement("ul", "nav-list")

        const projects = DomUtility.createElement("li", "projects", "Projects");
        projects.prepend(DomUtility.renderSvg(getIcons().projects));
        projects.addEventListener("click", () => EventBus.emit("openProjectsPage"));
        navList.appendChild(projects);

        const tasks = DomUtility.createElement("li", "tasks", "Tasks")
        tasks.prepend(DomUtility.renderSvg(getIcons().backlog));
        navList.appendChild(tasks);

        const board = DomUtility.createElement("li", "board", "Dashboard");
        board.prepend(DomUtility.renderSvg(getIcons().dashboard));
        board.addEventListener("click", () => EventBus.emit("openDashboard"));
        navList.appendChild(board);

        const settings = DomUtility.createElement("li", "settings", "Settings");
        settings.prepend(DomUtility.renderSvg(getIcons().settings));
        navList.appendChild(settings);

        return navList;
    }

    function createLeftNav() {
        const leftNav = DomUtility.createElement("div", "left-nav");

        const logo = DomUtility.createElement("div", "logo");
        const logoImg = DomUtility.createElement("div", "logo-img")
        logoImg.appendChild(DomUtility.renderSvg(getIcons().logo));
        logo.appendChild(logoImg);

        const iconsContainer = DomUtility.createElement("div", "left-nav-icons");

        const search = DomUtility.createElement("div", "search");
        search.appendChild(DomUtility.renderSvg(getIcons().search))

        const addProject = DomUtility.createElement("div", "add-project");
        addProject.appendChild(DomUtility.renderSvg(getIcons().addProject));
        addProject.addEventListener("click", () => EventBus.emit("addProject"));

        iconsContainer.appendChild(search);
        iconsContainer.appendChild(addProject);

        leftNav.appendChild(logo);
        leftNav.appendChild(iconsContainer);
        return leftNav;
    }

    function createRightNav() {
        const rightNav = DomUtility.createElement("div", "right-nav");
        rightNav.appendChild(createHeader());
        rightNav.appendChild(createNavList());
        return rightNav;
    }

    function destroy() {
        if(element) {
           element.remove();
        }
    }

    function render() {
        destroy();
        nav.appendChild(createLeftNav())
        nav.appendChild(createRightNav())
    }

    return {
        render
    }
};





