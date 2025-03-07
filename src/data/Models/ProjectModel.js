import Dashboard from "../../components/Dashboard/Dashboard";

export default class ProjectModel {

    #name
    #type
    #icon
    #taskService
    #dashboard;

    constructor(name, type, icon, taskService, dashboard) {
        this.#name = name;
        this.#type = type;
        this.#icon = icon;
        this.#taskService = taskService;
        dashboard ? this.#dashboard = dashboard : this.#dashboard = new Dashboard(this);
    }

    getName() {
        return this.#name;
    }

    getType() {
        return this.#type;
    }

    getIcon() {
        return this.#icon;
    }

    getTaskService() {
        return this.#taskService;
    }

    getDashboard() {
        return this.#dashboard;
    }

    toJSON() {
        return {
            name: this.#name,
            type: this.#type,
            icon: this.#icon,
            taskService: this.#taskService,
            dashboard: this.#dashboard
        };
    }

    static fromJSON(data) {
        return new ProjectModel(data.name, data.type, data.icon, data.taskService, data.dashboard);
    }
}