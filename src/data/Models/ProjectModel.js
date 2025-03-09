
export default class ProjectModel {

    #name
    #type
    #icon
    #taskService
    #laneService

    constructor(name, type, icon, taskService, laneService) {
        this.#name = name;
        this.#type = type;
        this.#icon = icon;
        this.#taskService = taskService;
        this.#laneService = laneService;
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

    getLaneService() {
        return this.#laneService;
    }

    toJSON() {
        return {
            name: this.#name,
            type: this.#type,
            icon: this.#icon,
            taskService: this.#taskService,
            laneService: this.#laneService,
        };
    }

    static fromJSON(data) {
        return new ProjectModel(data.name, data.type, data.icon, data.taskService, data.laneService);
    }
}