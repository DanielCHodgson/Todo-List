import "./TaskRow.css";
import EventBus from "../../utilities/EventBus";
import DomUtility from "../../utilities/DomUtility";

export default class TaskRow {
    #parent;
    #task;
    #taskData;
    #element;
    #fields;

    constructor(parent, task) {
        this.#task = task;
        this.#taskData = this.setTaskData(task);
        this.#parent = parent;
        this.#fields = {};
        this.#element = this.#createElement();

        this.#setData();
        this.#bindEvents();
        this.render();
    }

    #bindEvents() {
        this.#fields.summary.addEventListener("blur", this.#handleBlur);
        this.#fields.status.addEventListener("blur", this.#handleBlur);
        this.#fields.summary.addEventListener("click", this.#stopClickPropagation);
        this.#fields.status.addEventListener("click", this.#stopClickPropagation);
        this.#element.addEventListener("click", this.#handleClick);
    }

    #stopClickPropagation = (event) => {
        event.stopPropagation();
    };

    #handleBlur = (event) => {
        event.stopPropagation();
        const data = { taskData: this.#taskData, inputField: event.target, row: this };
        EventBus.emit("updateRow", data);
    };

    #handleClick = () => {
        EventBus.emit("launchViewTaskModal", this.#task);
    };

    #createElement() {
        const taskRow = DomUtility.createElement("div", "task-row");
        const rowForm = DomUtility.createElement("form", "task-form");

        const cont1 = DomUtility.createElement("div", "container");
        const id = DomUtility.createElement("p", "id");
        this.#fields.id = id;
        cont1.appendChild(id);

        const cont2 = DomUtility.createElement("div", "container");
        const summary = DomUtility.createInputField("summary", true, 1, 30);
        this.#fields.summary = summary;
        cont2.appendChild(summary);

        const cont3 = DomUtility.createElement("div", "container");
        const status = DomUtility.createInputField("status", true, 1, 20);
        this.#fields.status = status;
        cont3.appendChild(status);

        rowForm.appendChild(cont1);
        rowForm.appendChild(cont2);
        rowForm.appendChild(cont3);

        taskRow.appendChild(rowForm);
        return taskRow;
    }

    #setData() {
        Object.values(this.#fields).forEach((field) => {
            const name = field.tagName === "P" ? "id" : field.id;
            if (field.tagName === "INPUT") {
                field.value = this.#taskData[name];
            } else if (field.tagName === "P") {
                field.textContent = this.#taskData[name];
            }
        });
    }

    render() {
        if (this.#parent && this.#element) {
            this.#parent.appendChild(this.#element);
        }
    }

    #unbindEvents() {
        this.#fields.summary.removeEventListener("blur", this.#handleBlur);
        this.#fields.status.removeEventListener("blur", this.#handleBlur);
        this.#fields.id.removeEventListener("click", this.#handleClick);
    }

    destroy() {
        if (this.#element) {
            this.#unbindEvents();
            this.#element.remove();
        }
    }

    getTaskData() {
        return this.#taskData;
    }

    setTaskData(task) {
        return {
            id: task.getId(),
            project: task.getProject(),
            summary: task.getSummary(),
            description: task.getDescription(),
            priority: task.getPriority(),
            date: task.getDate(),
            status: task.getStatus(),
        };
    }

}
