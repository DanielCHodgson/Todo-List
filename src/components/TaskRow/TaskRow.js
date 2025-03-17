import "./TaskRow.css";
import EventBus from "../../utilities/EventBus";
import DomUtility from "../../utilities/DomUtility";
import getIcons from "../../res/icons/icons";

export default class TaskRow {
    #parent;
    #task;
    #taskData;
    #element;
    #fields;
    #deleteBtn;

    constructor(parent, task) {
        if (!task || typeof task !== 'object') {
            throw new Error("Invalid task object.");
        }

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
        if (this.#fields.summary && this.#fields.status) {
            this.#fields.summary.addEventListener("blur", this.#handleBlur);
            this.#fields.status.addEventListener("blur", this.#handleBlur);
            this.#fields.priority.addEventListener("change",this.#handleSelectChange);
            this.#fields.summary.addEventListener("click", this.#stopClickPropagation);
            this.#fields.status.addEventListener("click", this.#stopClickPropagation);
            this.#fields.priority.addEventListener("click", this.#stopClickPropagation);
        }

        if (this.#element) {
            this.#element.addEventListener("click", this.#handleRowClick);
        }

        if (this.#deleteBtn) {
            this.#deleteBtn.addEventListener("click", this.#handleDeleteClick);
        }
    }

    #stopClickPropagation = (event) => {
        event.stopPropagation();
    };

    #handleSelectChange= (event) => {
        const data = { taskData: this.#taskData, inputField: event.target, row: this };
        EventBus.emit("updateRow", data);
    }

    #handleBlur = (event) => {
        const data = { taskData: this.#taskData, inputField: event.target, row: this };
        EventBus.emit("updateRow", data);
    };

    #handleRowClick = () => {
        EventBus.emit("launchViewTaskModal", this.#task);
    };

    #handleDeleteClick = (event) => {
        event.preventDefault();
        event.stopPropagation();
        EventBus.emit("deleteTaskRow", this.#task);
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
        const priority = DomUtility.createSelect("priority", ["P1", "P2", "P3", "P4", "P5"]);
        this.#fields.priority = priority;
        cont3.appendChild(priority);

        const cont4 = DomUtility.createElement("div", "container");
        const status = DomUtility.createInputField("status", true, 1, 20);
        this.#fields.status = status;
        cont4.appendChild(status);

        const cont5 = DomUtility.createElement("div", "container");
        cont5.classList.add("icons")
        this.#deleteBtn = DomUtility.createElement("button", "delete");
        this.#deleteBtn.innerHTML = getIcons().close;
        cont5.appendChild(this.#deleteBtn);

        rowForm.append(cont1, cont2, cont3, cont4, cont5);
        taskRow.appendChild(rowForm);
        return taskRow;
    }

    #setData() {
        Object.entries(this.#fields).forEach(([key, field]) => {
            if (field.tagName === "P") field.textContent = this.#taskData[key] || "";
            else field.value = this.#taskData[key] || "";
        });
    }

    render() {
        if (this.#parent && this.#element) {
            this.#parent.appendChild(this.#element);
        }
    }

    #unbindEvents() {
        if (this.#fields.summary) this.#fields.summary.removeEventListener("blur", this.#handleBlur);
        if (this.#fields.status) this.#fields.status.removeEventListener("blur", this.#handleBlur);
        if (this.#fields.priority) this.#fields.priority.removeEventListener("change", this.#handleSelectChange);
        if (this.#element) this.#element.removeEventListener("click", this.#handleRowClick);
        if (this.#deleteBtn) this.#deleteBtn.removeEventListener("click", this.#handleDeleteClick);
    }

    destroy() {
        this.#unbindEvents();
        if (this.#element) this.#element.remove();
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
