import Nav from "../components/Nav/Nav.js";
import Dashboard from "../components/Dashboard/Dashboard.js";
import ProjectsPage from "../pages/ProjectsPage/ProjectsPage.js";
import TasksPage from "../pages/TasksPage/TasksPage.js";

export default class PageService {

    #nav = null;
    #currentPage = null;

    constructor() {
        this.init();
    }

    init() {
        // dirty as hell way to handle page refreshes
        // without implementing URLs and routing 
        const storedPage = localStorage.getItem("currentPage");

        if (storedPage === null) {
            this.#currentPage = "projects";
            this.loadPage(this.#currentPage)
        } else {
            this.#currentPage = storedPage;
            this.loadPage(this.#currentPage)
            this.loadNav();
        }
    }

    loadNav() {
        if (this.#nav !== null) {
            console.log(this.#nav)
            this.#nav.destroy();
        }
        this.#nav = new Nav();
    }


    reloadPage() {
        this.loadPage(localStorage.getItem("currentPage"));
    }

    loadPage(page) {

        if (this.#currentPage && this.#currentPage.object) {
            this.#currentPage.object.destroy();
        }

        switch (page) {
            case "projects":
                this.#currentPage = {
                    "name": page,
                    "object": new ProjectsPage(),
                };
                break;
            case "dashboard":
                this.#currentPage = {
                    "name": page,
                    "object": new Dashboard(),
                };
                break;
            case "tasks":
                this.#currentPage = {
                    "name": page,
                    "object": new TasksPage(),
                };
                break;
            default:
                console.error("Unknown page: " + page);
                this.#currentPage = {
                    "name": "home",
                    "object": new ProjectsPage(),
                };
                break;
        }

        localStorage.setItem("currentPage", this.#currentPage.name)
    }

    getNav() {
        return this.#nav;
    }



}