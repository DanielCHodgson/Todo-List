import "./swimLane.css";
import TaskManager from "../Tasks/TaskManager";
import Utility from "../../Utilities/domUtility";

export default class SwimLane {

    #taskManager;

    constructor() {
        this.#taskManager = new TaskManager();

    }

    render(parent) {
        const swimLane = Utility.createElement("div", "swim-lane");
        parent.appendChild(swimLane);
    }

    get taskManager() {
        return this.#taskManager;
    }

}