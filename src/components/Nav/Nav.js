import "./Nav.css";
import logoIcon from "../../res/icons/giro-logo-white.svg";
import Utility from "../../utilities/DomUtility";
import DataUtility from "../../utilities/DataUtility";
import DomUtility from "../../utilities/DomUtility";

export default function nav(project, events) {
    const nav = document.querySelector(".nav");

    const icons = {
        search: `<svg xmlns="http://www.w3.org/2000/svg" width="1.5rem" height="1.5rem" viewBox="0 0 512 512"><path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"/></svg>`,
        add: `<svg xmlns="http://www.w3.org/2000/svg" width="1.5rem" height="1.5rem" viewBox="0 0 448 512"><path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 144L48 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l144 0 0 144c0 17.7 14.3 32 32 32s32-14.3 32-32l0-144 144 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-144 0 0-144z"/></svg>`,
        dashboard: `<svg xmlns="http://www.w3.org/2000/svg" width="1.5rem" height="1.5rem" viewBox="0 0 512 512"><path d="M0 96C0 60.7 28.7 32 64 32l384 0c35.3 0 64 28.7 64 64l0 320c0 35.3-28.7 64-64 64L64 480c-35.3 0-64-28.7-64-64L0 96zm64 64l0 256 160 0 0-256L64 160zm384 0l-160 0 0 256 160 0 0-256z"/></svg>`,
        settings: `<svg xmlns="http://www.w3.org/2000/svg" width="1.5rem" height="1.5rem" viewBox="0 0 512 512"><path d="M487.4 315.7l-42.6-24.6c4.3-23.2 4.3-47 0-70.2l42.6-24.6c4.9-2.8 7.1-8.6 5.5-14-11.1-35.6-30-67.8-54.7-94.6-3.8-4.1-10-5.1-14.8-2.3L380.8 110c-17.9-15.4-38.5-27.3-60.8-35.1V25.8c0-5.6-3.9-10.5-9.4-11.7-36.7-8.2-74.3-7.8-109.2 0-5.5 1.2-9.4 6.1-9.4 11.7V75c-22.2 7.9-42.8 19.8-60.8 35.1L88.7 85.5c-4.9-2.8-11-1.9-14.8 2.3-24.7 26.7-43.6 58.9-54.7 94.6-1.7 5.4 .6 11.2 5.5 14L67.3 221c-4.3 23.2-4.3 47 0 70.2l-42.6 24.6c-4.9 2.8-7.1 8.6-5.5 14 11.1 35.6 30 67.8 54.7 94.6 3.8 4.1 10 5.1 14.8 2.3l42.6-24.6c17.9 15.4 38.5 27.3 60.8 35.1v49.2c0 5.6 3.9 10.5 9.4 11.7 36.7 8.2 74.3 7.8 109.2 0 5.5-1.2 9.4-6.1 9.4-11.7v-49.2c22.2-7.9 42.8-19.8 60.8-35.1l42.6 24.6c4.9 2.8 11 1.9 14.8-2.3 24.7-26.7 43.6-58.9 54.7-94.6 1.5-5.5-.7-11.3-5.6-14.1zM256 336c-44.1 0-80-35.9-80-80s35.9-80 80-80 80 35.9 80 80-35.9 80-80 80z"/></svg>`,
        backlog: `<svg xmlns="http://www.w3.org/2000/svg" width="1.5rem" height="1.5rem" viewBox="0 0 512 512"><path d="M0 96C0 60.7 28.7 32 64 32l384 0c35.3 0 64 28.7 64 64l0 320c0 35.3-28.7 64-64 64L64 480c-35.3 0-64-28.7-64-64L0 96zm64 0l0 64 64 0 0-64L64 96zm384 0L192 96l0 64 256 0 0-64zM64 224l0 64 64 0 0-64-64 0zm384 0l-256 0 0 64 256 0 0-64zM64 352l0 64 64 0 0-64-64 0zm384 0l-256 0 0 64 256 0 0-64z"/></svg>`,
        chevronUp: `<svg xmlns="http://www.w3.org/2000/svg" width="1.5rem" height="1.5rem" viewBox="0 0 512 512"><path d="M233.4 105.4c12.5-12.5 32.8-12.5 45.3 0l192 192c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L256 173.3 86.6 342.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l192-192z"/></svg>`,
        chevronDown: `<svg xmlns="http://www.w3.org/2000/svg" width="1.5rem" height="1.5rem" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"/></svg>`,

    };

    function createLeftNav() {
        const leftNav = Utility.createElement("div", "left-nav");

        const logo = Utility.createElement("div", "logo");
        logo.appendChild(Utility.createImg(logoIcon, "logo-img", "3rem", "3rem"));

        const iconsContainer = Utility.createElement("div", "left-nav-icons");

        ["search", "add"].forEach(iconType => {
            const iconDiv = Utility.createElement("div", iconType);
            iconDiv.appendChild(Utility.renderSvg(icons[iconType]));
            iconsContainer.appendChild(iconDiv);
        });

        leftNav.appendChild(logo);
        leftNav.appendChild(iconsContainer);
        return leftNav;
    }

    function createHeader() {
        const navHeader = Utility.createElement("div", "nav-header");
        const icon = Utility.createImg(project.getIcon(), "team-icon", "3rem", "3rem");
        const name = Utility.createElement("p", "project-name", project.getName());
        const type = Utility.createElement("p", "project-type", `${project.getType()} project`);
        navHeader.append(icon, name, type);

        navHeader.append(icon, name, type);

        const dropdownButton = Utility.createElement("button", "dropdown-button");
        const toggleIcon = DomUtility.renderSvg(icons.chevronDown);
        dropdownButton.appendChild(toggleIcon);
        navHeader.appendChild(dropdownButton);

        const dropdownContent = Utility.createElement("div", "dropdown-content");
        dropdownContent.classList.add("hidden");

        const projects = JSON.parse(localStorage.getItem(DataUtility.PROJECT_STORAGE_KEY)) || [];
        projects.forEach((project) => {
            const option = Utility.createElement("p", "option", project.name);
            option.addEventListener("click", () => {
                events.emit("switchDashboard", option.textContent);
            });
            dropdownContent.appendChild(option);
        });

        dropdownButton.addEventListener("click", (event) => {
            event.stopPropagation();
            dropdownContent.classList.toggle("hidden");
            dropdownContent.classList.toggle("visible");
    
            const icon = dropdownContent.classList.contains("visible") 
                ? icons.chevronUp 
                : icons.chevronDown;
            dropdownButton.firstChild.replaceWith(Utility.renderSvg(icon));
        });

        window.addEventListener("click", (event) => {
            if (nav && !nav.contains(event.target) && dropdownContent.classList.contains("visible")) {
                dropdownContent.classList.remove("visible");
                dropdownContent.classList.add("hidden");
                dropdownButton.firstChild.replaceWith(Utility.renderSvg(icons.chevronDown));
            }
        });
    
        navHeader.appendChild(dropdownContent);
        return navHeader;
    }

    function createNavList() {

        const navList = Utility.createElement("ul", "nav-list")

        const backlog = Utility.createElement("li", "backlog", "Backlog")
        backlog.prepend(Utility.renderSvg(icons.backlog));

        navList.appendChild(backlog);

        const board = Utility.createElement("li", "board", "Dashboard");
        board.prepend(Utility.renderSvg(icons.dashboard));
        navList.appendChild(board);

        const settings = Utility.createElement("li", "settings", "Settings");
        settings.prepend(Utility.renderSvg(icons.settings));
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





