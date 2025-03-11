import Utility from "../../../utilities/DomUtility.js";
import "./CreateTaskModal.css";
import Validator from "../../../utilities/Validator.js";
import EventBus from "../../../utilities/EventBus.js";
import getIcons from "../../../res/icons/icons.js";

export default class NewTaskModal {
    constructor() {
        this.parent = document.querySelector(".app-wrapper");
        this.element = null;
        this.form = null;
        this.fields = {};
        this.statuses = null;

        this.boundOpen = this.open.bind(this);
        EventBus.on("openNewTaskModal", this.boundOpen);
    }

    open(laneService) {
        this.statuses = laneService.getLanes().map(lane => lane.getStatus());

        if (!this.element) {
            this.element = this.createElement();
            this.render();
            this.cacheFields();
        }
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

    createElement() {
        const modal = Utility.createElement("div", "create-task-modal");
        modal.append(this.createHeader(), this.createForm(), this.createFooter());
        return modal;
    }

    createHeader() {
        const header = Utility.createElement("div", "modal-header");
        header.appendChild(Utility.createElement("h2", "modal-title", "New task"));

        const iconRow = Utility.createElement("div", "icon-row");
        iconRow.appendChild(Utility.createIconButton("expand", getIcons().expand));
        iconRow.appendChild(Utility.createIconButton("close", getIcons().close, () => this.destroy()));

        header.appendChild(iconRow);
        return header;
    }

    createForm() {
        this.form = Utility.createElement("form", null, null, { id: "new-task-form" });

        this.form.append(
            Utility.createSelectFormGroup("project", "Project", ["SAAS"]),
            Utility.createInputFormGroup("summary", "Summary", true, 1, 35),
            Utility.createTextAreaFormGroup("description", "Description", false, 0, 500),
            Utility.createSelectFormGroup("priority", "Priority", ["P1", "P2", "P3", "P4", "P5"]),
            Utility.createSelectFormGroup("status", "Status", this.statuses),
            Utility.createDateFormGroup("date", "Due date", false)
        );

        return this.form;
    }

    createFooter() {
        const footer = Utility.createElement("div", "modal-footer");

        const createBtn = Utility.createElement("button", "create-btn", "Create", { type: "submit" });
        createBtn.addEventListener("click", (event) => this.submitTaskData(event));

        const cancelBtn = Utility.createElement("button", "cancel-btn", "Cancel", { type: "button" });
        cancelBtn.addEventListener("click", () => this.destroy());

        footer.append(createBtn, cancelBtn);
        return footer;
    }

    submitTaskData(event) {
        event.preventDefault();

        if (Validator.isValidTaskData(this.fields)) {
            const data = Object.fromEntries(
                Object.entries(this.fields).map(([key, element]) => [key, element.value.trim()])
            );
            EventBus.emit("createTask", data);
            this.destroy();
        }
    }

    render() {
        this.parent.appendChild(this.element);
    }

    destroy() {
        if (this.element) {
            this.element.remove();
            this.element = null;
            this.fields = {};
        }
    }

    cleanUp() {
        EventBus.off("openNewTaskModal", this.boundOpen);
    }
}
