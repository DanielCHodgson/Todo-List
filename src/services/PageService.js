import Nav from "../components/Nav/Nav.js";
import Dashboard from "../pages/Dashboard/Dashboard.js";
import ProjectsPage from "../pages/ProjectsPage/ProjectsPage.js";
import TasksPage from "../pages/TasksPage/TasksPage.js";
import ProjectService from "./ProjectService.js";

export default class PageService {

    #nav = null;
    #currentPage = null;
    #cachedCurrentPage = localStorage.getItem("currentPage");

    constructor() {
        this.init();
    }

    init() {
        // dirty as hell way to handle page refreshes
        // without implementing URLs / routing 
        if (ProjectService.loadFromLocalStorage().length <= 0) {
            this.loadPage("projects");
        } else {
            this.loadPage(this.#cachedCurrentPage);
            this.loadNav();
        }
    }

    loadNav() {
        if (this.#nav !== null) {
            this.#nav.destroy();
        }
        this.#nav = new Nav();
    }

    reloadPage() {
        this.loadPage(this.#cachedCurrentPage);
    }

    loadPage(page) {

        if (this.#currentPage)
            this.#currentPage.destroy();

        switch (page) {
            case "projects":
                this.#currentPage = new ProjectsPage();
                break;
            case "dashboard":
                this.#currentPage = new Dashboard();
                break;
            case "tasks":
                this.#currentPage = new TasksPage();
                break;
        }

        localStorage.setItem("currentPage", page)
        this.#cachedCurrentPage = page;
    }

    getNav() {
        return this.#nav;
    }

    getCurrentPage() {
        return this.#currentPage;
    }



}