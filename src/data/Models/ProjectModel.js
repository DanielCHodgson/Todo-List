export default class ProjectModel {

    #name
    #type
    #icon
    #taskService

    constructor(name, type, icon, taskService) {
        this.#name = name;
        this.#type = type;
        this.#icon = icon;
        this.#taskService = taskService;
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

    toJSON() {
        return {
            name: this.#name,
            type: this.#type,
            icon: this.#icon,
            taskService: this.#taskService
        };
    }

    static fromJSON(data) {
        return new ProjectModel(data.name, data.type, data.icon, data.taskService);
    }
}