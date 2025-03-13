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
        this.boundOpen = this.open.bind(this);
        this.boundSubmit = this.#submitTaskData.bind(this);
        this.boundDestroy = this.destroy.bind(this);
    }

    open() {
        if (!this.element) {
            this.element = this.#createElement();
            this.#cacheFields();
        }
        this.render();
    }

    #cacheFields() {
        this.fields = {
            summary: this.element.querySelector("#summary"),
            description: this.element.querySelector("#description"),
            project: this.element.querySelector("#project"),
            priority: this.element.querySelector("#priority"),
            status: this.element.querySelector("#status"),
            date: this.element.querySelector("#date")
        };
    }

    #createElement() {
        const modal = Utility.createElement("div", "create-task-modal");
        modal.id = "modal";
        modal.append(this.#createHeader(), this.#createForm(), this.#createFooter());
        return modal;
    }

    #createHeader() {
        const header = Utility.createElement("div", "modal-header");
        header.appendChild(Utility.createElement("h2", "modal-title", "New task"));

        const iconRow = Utility.createElement("div", "icon-row");
        iconRow.appendChild(Utility.createIconButton("expand", getIcons().expand));
        iconRow.appendChild(Utility.createIconButton("close", getIcons().close, this.boundDestroy));

        header.appendChild(iconRow);
        return header;
    }

    #createForm() {
        this.form = Utility.createElement("form", null, null, { id: "new-task-form" });

        this.form.append(
            Utility.createSelectFormGroup("project", "Project", ["SAAS"]),
            Utility.createInputFormGroup("summary", "Summary", true, 1, 35),
            Utility.createTextAreaFormGroup("description", "Description", false, 0, 500),
            Utility.createSelectFormGroup("priority", "Priority", ["P1", "P2", "P3", "P4", "P5"]),
            Utility.createInputFormGroup("status", "Status", true, 1, 20),
            Utility.createDateFormGroup("date", "Due date", false)
        );

        return this.form;
    }

    #createFooter() {
        const footer = Utility.createElement("div", "modal-footer");

        const createBtn = Utility.createElement("button", "create-btn", "Create", { type: "submit" });
        createBtn.addEventListener("click", this.boundSubmit);

        const cancelBtn = Utility.createElement("button", "cancel-btn", "Cancel", { type: "button" });
        cancelBtn.addEventListener("click", this.boundDestroy);

        footer.append(createBtn, cancelBtn);
        return footer;
    }

    #submitTaskData(event) {
        event.preventDefault();

        if (Validator.isValidTaskData(this.fields)) {
            const data = Object.fromEntries(
                Object.entries(this.fields).map(([key, element]) => {
                    return key === "status" ?
                        [key, element.value.trim().toLowerCase()] :
                        [key, element.value.trim()]
                })
            );
            EventBus.emit("createTask", data);
            this.destroy();
        }
    }



    destroy() {
        if (this.element) {
            this.form?.querySelector(".create-btn")?.removeEventListener("click", this.boundSubmit);
            this.element.remove();
            this.element = null;
            this.fields = {};
        }
    }

    render() {
        if (!this.element || this.parent.contains(this.element)) return;
        this.parent.appendChild(this.element);
    }
}