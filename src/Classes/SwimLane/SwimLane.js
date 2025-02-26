import "./SwimLane.css";
import TaskManager from "../Tasks/TaskManager";
import Utility from "../../Utilities/domUtility";
import Task from "../Tasks/Task";

export default class SwimLane {

    #taskManager;
    #container;
    #tasks;
    #cards;

    constructor(parent, events) {
        this.parent = parent;
        this.#container = Utility.createElement("div", "swim-lane");
        this.#taskManager = new TaskManager();
        this.#tasks = this.#taskManager.getTasks();
        this.#cards = [];
        events.on("createTask", (data) => this.addNewTask(data))
    }

    addNewTask(data) {
        const { project, summary, description, priority, date} = data
        this.#taskManager.addTask(new Task(this.#taskManager.getIndex(), project, summary, description, priority, date));
        console.log(this.#taskManager.getTasks().length);
    }

    render() {
        this.parent.appendChild(this.#container);

        this.#tasks.forEach(task => {

        })
    }

    get taskManager() {
        return this.#taskManager;
    }

}