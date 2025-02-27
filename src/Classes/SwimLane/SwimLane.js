import "./SwimLane.css";
import TaskManager from "../Tasks/TaskManager";
import Utility from "../../Utilities/domUtility";
import Task from "../Tasks/Task";
import TaskCard from "../TaskCard/TaskCard";

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

    createCard(task) {
        const card = new TaskCard(task);
        console.log(card);

        return card.getCard();
    }

    addNewTask(data) {
        const { project, summary, description, priority, date } = data
        const task = new Task(this.#taskManager.getIndex(), project, summary, description, priority, date)
        this.#taskManager.addTask(task);
        this.render();
    }

    render() {
        this.parent.appendChild(this.#container);

        this.#tasks.forEach(task => {
          this.#container.appendChild(this.createCard(task));
        })
    }

    get taskManager() {
        return this.#taskManager;
    }

}