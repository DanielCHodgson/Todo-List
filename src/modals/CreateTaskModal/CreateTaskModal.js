import "./CreateTaskModal.css";
import DomUtility from "../../utilities/DomUtility.js";
import Validator from "../../utilities/Validator.js";
import EventBus from "../../utilities/EventBus.js";
import getIcons from "../../res/icons/icons.js";
import ProjectService from "../../services/ProjectService.js";

export default class CreateTaskModal {
    #parent;
    #element;
    #form;
    #fields;
    #boundSubmit;
    #boundDestroy;
    #overlay;
    #boundOverlayClick;

    #createBtn;
    #cancelBtn;
    #closeBtn;

    constructor() {
        this.#parent = document.querySelector(".app-wrapper");
        this.#element = null;
        this.#fields = {};
        this.#bindEvents();
    }

    open() {
        if (!this.#element) {
            this.#element = this.#createElement();
            this.#cacheElements();
            this.render();
            this.#createOverlay();
        }
    }


    #cacheElements() {
        this.#createBtn = this.#form?.querySelector(".create-btn");
        this.#cancelBtn = this.#form?.querySelector(".cancel-btn");
        this.#closeBtn = this.#element?.querySelector(".modal-header .icon-row .close");
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
        this.#closeBtn = DomUtility.createIconButton("close", getIcons().close, this.#boundDestroy)
        iconRow.appendChild(this.#closeBtn);

        header.appendChild(iconRow);
        return header;
    }

    #createForm() {
        this.#form = DomUtility.createElement("form", null, null, { id: "new-task-form" });

        const currProjName = ProjectService.CURRENT_PROJECT.getName();

        const projectSelect = DomUtility.createSelectFormGroup(
            "project",
            `Save to (ID created from ${currProjName}'s index)`,
            ProjectService.loadAllFromLocalStorage().map(project => project.name)
        );

        const selectElement = projectSelect.querySelector("select");
        if (selectElement) {
            selectElement.value = currProjName;
        }

        this.#form.append(
            projectSelect,
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

        this.#createBtn = DomUtility.createElement("button", "create-btn", "Create", { type: "submit" });
        this.#createBtn.addEventListener("click", this.#boundSubmit);

        this.#cancelBtn = DomUtility.createElement("button", "cancel-btn", "Cancel", { type: "button" });
        this.#cancelBtn.addEventListener("click", this.#boundDestroy);

        footer.append(this.#createBtn, this.#cancelBtn);
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
            this.#unbindEvents();
            this.#element.remove();
            this.#element = null;
            this.#fields = {};
            if (this.#overlay) {
                this.#overlay.removeEventListener("click", this.#boundOverlayClick);
                this.#overlay.remove();
            }
            this.#overlay = null;
        }
    }

    #unbindEvents() {
        if (this.#createBtn) this.#createBtn.removeEventListener("click", this.#boundSubmit);
        if (this.#cancelBtn) this.#cancelBtn.removeEventListener("click", this.#boundDestroy);
        if (this.#closeBtn) this.#closeBtn.removeEventListener("click", this.#boundDestroy);
    }

    render() {
        if (this.#element && !this.#parent.contains(this.#element))
            this.#parent.appendChild(this.#element);
    }

    #createOverlay() {
        this.#overlay = DomUtility.createElement("div", "modal-overlay");
        this.#overlay.addEventListener("click", this.#boundOverlayClick);
        this.#parent.appendChild(this.#overlay);
    }

    #handleOverlayClick() {
        this.destroy();
    }

    #bindEvents() {
        this.#boundSubmit = this.#submitTaskData.bind(this);
        this.#boundDestroy = this.destroy.bind(this);
        this.#boundOverlayClick = this.#handleOverlayClick.bind(this);
    }

}
