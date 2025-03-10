import "./Nav.css";
import getIcons from "../../res/icons/icons";
import Utility from "../../utilities/DomUtility";
import ProjectService from "../../services/ProjectService";
import DomUtility from "../../utilities/DomUtility";
import EventBus from "../../utilities/EventBus";

export default function nav() {

    const project = ProjectService.CURRENT_PROJECT;
    const nav = document.querySelector(".nav");

    function createLeftNav() {
        const leftNav = Utility.createElement("div", "left-nav");

        const logo = Utility.createElement("div", "logo");
        const logoImg = Utility.createElement("div", "logo-img")
        logoImg.appendChild(Utility.renderSvg(getIcons().logo));
        logo.appendChild(logoImg);

        const iconsContainer = Utility.createElement("div", "left-nav-icons");

        const search = Utility.createElement("div", "search");
        search.appendChild(Utility.renderSvg(getIcons().search))

        const addProject = Utility.createElement("div", "add-project");
        addProject.appendChild(Utility.renderSvg(getIcons().add));
        addProject.addEventListener("click", () => EventBus.emit("addProject"));

        iconsContainer.appendChild(search);
        iconsContainer.appendChild(addProject);

        leftNav.appendChild(logo);
        leftNav.appendChild(iconsContainer);
        return leftNav;
    }

    function createHeader() {
        const navHeader = Utility.createElement("div", "nav-header");

        if (project !== null) {
            const icon = Utility.createImg(project.getIcon(), "team-icon", "3rem", "3rem");
            const name = Utility.createElement("p", "project-name", project.getName());
            const type = Utility.createElement("p", "project-type", `${project.getType()} project`);
            navHeader.append(icon, name, type);

            navHeader.append(icon, name, type);

            const dropdownButton = Utility.createElement("button", "dropdown-button");
            const toggleIcon = DomUtility.renderSvg(getIcons().chevronDown);
            dropdownButton.appendChild(toggleIcon);
            navHeader.appendChild(dropdownButton);

            const dropdownContent = Utility.createElement("div", "dropdown-content");
            dropdownContent.classList.add("hidden");

            const projects = JSON.parse(localStorage.getItem(ProjectService.PROJECT_STORAGE_KEY)) || [];
            projects.forEach((project) => {
                const option = Utility.createElement("p", "option", project.name);
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
                dropdownButton.firstChild.replaceWith(Utility.renderSvg(icon));
            });

            window.addEventListener("click", (event) => {
                if (nav && !nav.contains(event.target) && dropdownContent.classList.contains("visible")) {
                    dropdownContent.classList.remove("visible");
                    dropdownContent.classList.add("hidden");
                    dropdownButton.firstChild.replaceWith(Utility.renderSvg(getIcons().chevronDown));
                }
            });

            navHeader.appendChild(dropdownContent);
        }
        return navHeader;
    }

    function createNavList() {

        const navList = Utility.createElement("ul", "nav-list")

        const backlog = Utility.createElement("li", "backlog", "Backlog")
        backlog.prepend(Utility.renderSvg(getIcons().backlog));

        navList.appendChild(backlog);

        const board = Utility.createElement("li", "board", "Dashboard");
        board.prepend(Utility.renderSvg(getIcons().dashboard));
        navList.appendChild(board);

        const settings = Utility.createElement("li", "settings", "Settings");
        settings.prepend(Utility.renderSvg(getIcons().settings));
        navList.appendChild(settings);

        return navList;
    }

    function createRightNav() {
        const rightNav = Utility.createElement("div", "right-nav");
        rightNav.appendChild(createHeader());
        rightNav.appendChild(createNavList());
        return rightNav;
    }

    function destroy() {
        nav.innerHTML = "";
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





