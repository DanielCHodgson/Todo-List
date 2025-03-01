import TaskService from "../services/TaskService";

export default class ProjectModel {

    #name
    #type
    #icon
    #taskService

    constructor(name, type, icon) {
        this.#name = name;
        this.#type = type;
        this.#icon = icon;
        this.#taskService = new TaskService();
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
}