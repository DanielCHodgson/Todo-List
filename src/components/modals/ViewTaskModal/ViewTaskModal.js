import "./ViewTaskModal.css";
import Utility from "../../../utilities/DomUtility";
import Validator from "../../../utilities/Validator";
import EventBus from "../../../utilities/EventBus";

export default class ViewTaskModal {
    constructor() {
        this.parent = document.querySelector(".app-wrapper");
        this.currentTask = null;
        this.fields = null;
        this.element = null;

        this.icons = {
            close: `<svg xmlns="http://www.w3.org/2000/svg" width="1rem" height="1rem" viewBox="0 0 384 512">
                <path d="M376.6 84.5c11.3-13.6 9.5-33.8-4.1-45.1s-33.8-9.5-45.1 4.1L192 206 56.6 43.5C45.3 29.9 25.1 28.1 11.5 39.4S-3.9 70.9 7.4 84.5L150.3 256 7.4 427.5c-11.3 13.6-9.5 33.8 4.1 45.1s33.8 9.5 45.1-4.1L192 306 327.4 468.5c11.3 13.6 31.5 15.4 45.1 4.1s15.4-31.5 4.1-45.1L233.7 256 376.6 84.5z"/>
            </svg>`
        };

        this.boundOpen = this.open.bind(this);
        EventBus.on("viewTask", this.boundOpen);
    }

    open(task) {
        if (!this.element) this.element = this.createElement();
        this.currentTask = task;
        this.cacheFields();
        this.setData(task);
        this.render();
    }

    cacheFields() {
        this.fields = {
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
        this.fields.summary.value = task.getSummary();
        this.fields.description.value = task.getDescription();
        this.fields.project.value = task.getProject();
        this.fields.priority.value = task.getPriority();
        this.fields.status.value = task.getStatus();
        this.fields.date.value = task.getDueDate();
    }

    createElement() {
        const modal = Utility.createElement("div", "view-task-modal");
        modal.appendChild(this.createHeader());
        modal.appendChild(this.createBody());
        modal.appendChild(this.createFooter());
        return modal;
    }

    createHeader() {
        const container = Utility.createElement("div", "view-task-header");
        const upper = Utility.createElement("div", "upper");
        upper.appendChild(Utility.createElement("p", "id"));

        const iconRow = Utility.createElement("div", "icon-row");
        iconRow.appendChild(Utility.createIconButton("close", this.icons.close, this.destroy.bind(this)));
        upper.appendChild(iconRow);

        const lower = Utility.createElement("div", "lower");
        const summary = document.createElement("input");
        summary.id = "summary";
        summary.required = true;
        summary.minLength = 1;
        summary.maxLength = 50;
        lower.appendChild(summary);

        container.appendChild(upper);
        container.appendChild(lower);
        return container;
    }

    createBody() {
        const container = Utility.createElement("div", "view-task-body");

        const left = Utility.createElement("div", "modal-left");
        left.appendChild(Utility.createTextAreaFormGroup("description", "Description", false, 0, 1000));

        const right = Utility.createElement("div", "modal-right");
        right.appendChild(Utility.createSelectFormGroup("project", "Project", ["SAAS", "DOCS"]));
        right.appendChild(Utility.createSelectFormGroup("priority", "Priority", ["P1", "P2", "P3", "P4", "P5"]));
        right.appendChild(Utility.createSelectFormGroup("status", "Status", ["ready to start", "in progress", "in review", "closed"]));
        right.appendChild(Utility.createInputFormGroup("date", "Due date", true, "8", "10"));

        container.appendChild(left);
        container.appendChild(right);
        return container;
    }

    updateTask() {
        if (Validator.isValidTaskData(this.fields)) {
            const data = this.trimFields(this.fields);
            data.id = this.currentTask.getId();
            EventBus.emit("updateTask", { task: this.currentTask, newData: data });
            this.destroy();
        }
    }

    trimFields(fields) {
        return Object.fromEntries(
            Object.entries(fields).map(([key, element]) => [key, element.value.trim()])
        );
    }

    createFooter() {
        const footer = Utility.createElement("div", "view-task-footer");
        const updateBtn = Utility.createElement("button", "update-btn", "Update");
        updateBtn.addEventListener("click", this.updateTask.bind(this));

        const cancelBtn = Utility.createElement("button", "cancel-btn", "Cancel");
        cancelBtn.addEventListener("click", this.destroy.bind(this));

        footer.appendChild(updateBtn);
        footer.appendChild(cancelBtn);
        return footer;
    }

    render() {
        if (!this.parent.contains(this.element)) {
            this.parent.appendChild(this.element);
        }
    }

    cleanup() {
        EventBus.off("viewTask", this.boundOpen);
    }

    destroy() {
        if (this.element && this.parent.contains(this.element)) {
            this.parent.removeChild(this.element);
            this.element = null;
            this.fields = null;
            this.currentTask = null;
        }
    }
}
