import "./SwimLane.css";
import TaskManager from "../../../data/Tasks/TaskManager";
import Utility from "../../../Utilities/domUtility";
import Task from "../../../data/Tasks/Task";
import TaskCard from "../TaskCard/TaskCard";

export default class SwimLane {

    #taskManager;
    #container;

    constructor(parent, events) {
        this.parent = parent;
        this.#container = Utility.createElement("div", "swim-lane");
        this.#taskManager = new TaskManager();
        events.on("createTask", (data) => this.addNewTask(data))
    }

    createCard(task) {
        const card = new TaskCard(task);
        return card.getCard();
    }

    addNewTask(data) {
        const { project, summary, description, priority, date } = data
        this.#taskManager.addTask(new Task(this.#taskManager.getIndex(), project, summary, description, priority, date));
        this.render();
    }

    render() {
        this.parent.appendChild(this.#container);

        console.log(this.#taskManager.getTasks())
        this.#taskManager.getTasks().forEach(task => {
          this.#container.appendChild(this.createCard(task));
        })
    }

    get taskManager() {
        return this.#taskManager;
    }

}