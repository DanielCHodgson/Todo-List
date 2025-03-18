import "./CreateTaskModal.css";
import DomUtility from "../../utilities/DomUtility.js";
import Validator from "../../utilities/Validator.js";
import EventBus from "../../utilities/EventBus.js";
import getIcons from "../../res/icons/icons.js";

export default class CreateTaskModal {
    #parent;
    #element;
    #form;
    #fields;
    #boundSubmit;
    #boundDestroy;

    constructor() {
        this.#parent = document.querySelector(".app-wrapper");
        this.#element = null;
        this.#form = null;
        this.#fields = {};
    }

    #bindEvents() {
        this.#boundSubmit = this.#submitTaskData.bind(this);
        this.#boundDestroy = this.destroy.bind(this);
        window.addEventListener("click", (event) => this.#handleOutsideModalClick(event));
    }

    open() {
        if (!this.#element) {
            this.#element = this.#createElement();
            this.#cacheFields();
        }
        this.render();
        this.#bindEvents();
    }

    #handleOutsideModalClick(event) {
        if (this.#element && !this.#element.contains(event.target)) {
            console.log('Clicked outside modal, closing...');
            this.destroy();
        }
    }

    #cacheFields() {
        this.#fields = {
            summary: this.#element.querySelector("#summary"),
            description: this.#element.querySelector("#description"),
            project: this.#element.querySelector("#project"),
            priority: this.#element.querySelector("#priority"),
            status: this.#element.querySelector("#status"),
            date: this.#element.querySelector("#date"),
        };
    }

    #createElement() {
        const modal = DomUtility.createElement("div", "create-task-modal");
        modal.id = "modal";
        modal.append(this.#createHeader(), this.#createForm(), this.#createFooter());
        return modal;
    }

    #createHeader() {
        const header = DomUtility.createElement("div", "modal-header");
        header.appendChild(DomUtility.createElement("h2", "modal-title", "New task"));

        const iconRow = DomUtility.createElement("div", "icon-row");
        iconRow.appendChild(DomUtility.createIconButton("expand", getIcons().expand));
        iconRow.appendChild(DomUtility.createIconButton("close", getIcons().close, this.#boundDestroy));

        header.appendChild(iconRow);
        return header;
    }

    #createForm() {
        this.#form = DomUtility.createElement("form", null, null, { id: "new-task-form" });

        this.#form.append(
            DomUtility.createSelectFormGroup("project", "Project", ["SAAS"]),
            DomUtility.createInputFormGroup("summary", "Summary", true, 1, 35),
            DomUtility.createTextAreaFormGroup("description", "Description", false, 0, 500),
            DomUtility.createSelectFormGroup("priority", "Priority", ["P1", "P2", "P3", "P4", "P5"]),
            DomUtility.createInputFormGroup("status", "Status", true, 1, 20),
            DomUtility.createDateFormGroup("date", "Due date", false)
        );

        return this.#form;
    }

    #createFooter() {
        const footer = DomUtility.createElement("div", "modal-footer");

        const createBtn = DomUtility.createElement("button", "create-btn", "Create", { type: "submit" });
        createBtn.addEventListener("click", this.#boundSubmit);

        const cancelBtn = DomUtility.createElement("button", "cancel-btn", "Cancel", { type: "button" });
        cancelBtn.addEventListener("click", this.#boundDestroy);

        footer.append(createBtn, cancelBtn);
        return footer;
    }

    #submitTaskData(event) {
        event.preventDefault();

        if (Validator.isValidTaskData(this.#fields)) {
            const data = Object.fromEntries(
                Object.entries(this.#fields).map(([key, element]) => {
                    return key === "status" ? 
                        [key, element.value.trim().toLowerCase()] :
                        [key, element.value.trim()];
                })
            );
            EventBus.emit("createTask", data);
            this.destroy();
        }
    }

    destroy() {
        if (this.#element) {
            this.#removeEventListeners();
            this.#element.remove();
            this.#element = null;
            this.#fields = {};
        }
    }

    #removeEventListeners() {
        const createBtn = this.#form?.querySelector(".create-btn");
        const cancelBtn = this.#form?.querySelector(".cancel-btn");
        const closeBtn = this.#element?.querySelector(".modal-header .icon-row .close");

        if (createBtn) createBtn.removeEventListener("click", this.#boundSubmit);
        if (cancelBtn) cancelBtn.removeEventListener("click", this.#boundDestroy);
        if (closeBtn) closeBtn.removeEventListener("click", this.#boundDestroy);
    }

    render() {
        if (!this.#element || this.#parent.contains(this.#element)) return;
        this.#parent.appendChild(this.#element);
    }
}
