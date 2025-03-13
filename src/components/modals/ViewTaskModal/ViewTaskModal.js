import "./ViewTaskModal.css";
import DomUtility from "../../../utilities/DomUtility";
import Validator from "../../../utilities/Validator";
import EventBus from "../../../utilities/EventBus";
import getIcons from "../../../res/icons/icons";

export default class ViewTaskModal {
    constructor() {
        this.parent = document.querySelector(".app-wrapper");
        this.element = null;
        this.fields = {};
        this.currentTask = null;
    }

    open(task) {
        if (!this.element) {
            this.element = this.#createElement();
            this.render();
            this.#cacheFields();
        }
        this.currentTask = task;
        this.setData(task);
    }

    #cacheFields() {
        this.fields = {
            id: this.element.querySelector(".id"),
            summary: this.element.querySelector("#summary"),
            description: this.element.querySelector("#description"),
            project: this.element.querySelector("#project"),
            priority: this.element.querySelector("#priority"),
            status: this.element.querySelector("#status"),
            date: this.element.querySelector("#date")
        };
    }

    setData(task) {
        if (!task) return;
        this.fields.id.textContent = task.getId();
        this.fields.summary.value = task.getSummary();
        this.fields.description.value = task.getDescription();
        this.fields.project.value = task.getProject();
        this.fields.priority.value = task.getPriority();
        this.fields.status.value = task.getStatus();
        this.fields.date.value = task.getDueDate();
        console.log(task)
    }

    #createElement() {
        const modal = DomUtility.createElement("div", "view-task-modal");
        modal.id = "modal";
        modal.append(this.#createHeader(), this.#createBody(), this.#createFooter());
        return modal;
    }

    #createHeader() {
        const header = DomUtility.createElement("div", "view-task-header");
        const iconRow = DomUtility.createElement("div", "icon-row");
        iconRow.appendChild(DomUtility.createElement("p", "id"));

        const closeBtn = DomUtility.createElement("button", "close");

        closeBtn.appendChild(DomUtility.renderSvg(getIcons().close));
        closeBtn.addEventListener("click", () => this.destroy());

        iconRow.appendChild(closeBtn);


        const title = DomUtility.createElement("div", "title")

        const summary = document.createElement("input");
        summary.id = "summary";
        summary.required = true;
        summary.minLength = 1;
        summary.maxLength = 50;
        title.appendChild(summary);

        header.appendChild(iconRow);
        header.appendChild(title)

        return header;
    }

    #createBody() {
        const body = DomUtility.createElement("div", "view-task-body");

        const left = DomUtility.createElement("div", "modal-left");
        left.appendChild(DomUtility.createTextAreaFormGroup("description", "Description", false, 0, 1000));

        const right = DomUtility.createElement("div", "modal-right");
        ["project", "priority", "status",].forEach(field => {
            right.appendChild(DomUtility.createInputFormGroup(field, field.charAt(0).toUpperCase() + field.slice(1), true));
        });
        right.appendChild(DomUtility.createDateFormGroup("date", "Date", false));

        body.append(left, right);
        return body;
    }

    #createFooter() {
        const footer = DomUtility.createElement("div", "view-task-footer");

        const updateBtn = DomUtility.createElement("button", "update-btn", "Update");
        updateBtn.addEventListener("click", this.#updateTask.bind(this));

        const cancelBtn = DomUtility.createElement("button", "cancel-btn", "Cancel");
        cancelBtn.addEventListener("click", this.destroy.bind(this));

        footer.append(updateBtn, cancelBtn);
        return footer;
    }

    #updateTask() {
        if (Validator.isValidTaskData(this.fields)) {
            const data = Object.fromEntries(
                Object.entries(this.fields).map(([key, element]) => [key, element.value.trim()])
            );
            data.id = this.currentTask.getId();
            EventBus.emit("updateTask", { task: this.currentTask, newData: data });
            this.destroy();
        }
    }

    render() {
        if (!this.parent.contains(this.element)) {
            this.parent.appendChild(this.element);
        }
    }

    destroy() {
        if (this.element) {
            this.element.remove();
            this.element = null;
            this.fields = {};
            this.currentTask = null;
        }
    }
}
