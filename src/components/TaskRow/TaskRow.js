import "./TaskRow.css";
import EventBus from "../../utilities/EventBus";
import DomUtility from "../../utilities/DomUtility";

export default class TaskRow {

    #parent;
    #taskData;
    #element;
    #fields;

    constructor(parent, task) {

        this.#taskData = this.setTaskData(task);
        this.#parent = parent;
        this.#fields = [];
        this.#element = this.#createElement();

        this.#setData();
        this.#bindEvents();
        this.render();
    }

    #bindEvents() {
        this.#fields
            .filter(field => field.tagName !== "P")
            .forEach(field => {
                const data = { taskData: this.#taskData, inputField: field, row: this }
                field.addEventListener("blur", () => EventBus.emit("updateRow", data))
            });
    }

    #createElement() {
        const taskRow = DomUtility.createElement("div", "task-row");
        const rowForm = DomUtility.createElement("form", "task-form");

        const id = DomUtility.createElement("p", "id");
        this.#fields.push(id);

        const summary = DomUtility.createInputField("summary", true, 1, 30)
        this.#fields.push(summary);

        const status = DomUtility.createInputField("status", true, 1, 20)
        this.#fields.push(status);

        rowForm.appendChild(id);
        rowForm.appendChild(summary);
        rowForm.appendChild(status);

        taskRow.appendChild(rowForm);
        return taskRow;
    }


    #setData() {

        this.#fields.forEach(field => {

            const name = field.tagName === "P" ? "id" : field.id;

            if (field.tagName === "INPUT") {
                field.value = this.#taskData[name];

            } else if (field.tagName == "P")
                field.textContent = this.#taskData[name];
        });
    }

    render() {
        if (this.#parent && this.#element) {
            this.#parent.appendChild(this.#element);
        }
    }

    #unbindEvents() {
        this.#fields.summary.removeEventListener("blur", () => EventBus.emit("updateRow", data));
        this.#fields.status.removeEventListener("blur", () => EventBus.emit("updateRow", data));
    }

    destroy() {
        if (this.#element) {
            this.#element.remove();
            this.#unbindEvents();
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
            date: task.getDueDate(),
            status: task.getStatus()
        };
    }

}