import "./CreateProjectModal.css";
import DomUtility from "../../../utilities/DomUtility";
import Validator from "../../../utilities/Validator";
import EventBus from "../../../utilities/EventBus";
import getIcons from "../../../res/icons/icons";

export default class CreateProjectModal {
    constructor() {
        this.parent = document.querySelector(".app-wrapper");
        this.element = null;
        this.fields = null;
        
        this.boundOpen = this.open.bind(this);
        this.boundSubmit = this.#handleSubmit.bind(this);
        EventBus.on("addProject", this.boundOpen);
    }

    open() {
        if (!this.element) {
            this.element = this.#createElement();
            this.#cacheFields();
            this.#bindEvents();
        }
        this.render();
    }

    #cacheFields() {
        this.fields = {
            name: this.element.querySelector("#name"),
            type: this.element.querySelector("#type"),
        };
    }

    #createElement() {
        const modal = DomUtility.createElement("div", "create-project-modal");
        modal.id = "modal";

        const header = DomUtility.createElement("div", "header");
        header.appendChild(DomUtility.createElement("p", "title", "New Project"));
        header.appendChild(DomUtility.createIconButton("close", getIcons().close, () => this.destroy()));

        const body = DomUtility.createElement("div", "body");
        const form = DomUtility.createElement("form", "form");
        form.appendChild(DomUtility.createInputFormGroup("name", "Name", true, 1, 5));
        form.appendChild(DomUtility.createInputFormGroup("type", "Type", true, 1, 15));

        const submit = DomUtility.createElement("button", "submit", "Add");
        submit.addEventListener("click", this.boundSubmit);
        form.appendChild(submit);

        body.appendChild(form);
        modal.appendChild(header);
        modal.appendChild(body);

        return modal;
    }

    #handleSubmit(event) {
        event.preventDefault();
        const data = Object.fromEntries(
            Object.entries(this.fields).map(([key, element]) => [key, element.value.trim()])
        );

        if (Validator.isValidProjectData(data)) {
            EventBus.emit("createProject", data);
            this.destroy();
        }
    }

    #bindEvents() {
        EventBus.on("addProject", this.boundOpen);
    }

    #unbindEvents() {
        EventBus.off("addProject", this.boundOpen);
    }

    destroy() {
        if (this.element) {
            this.#unbindEvents();
            this.element.querySelector(".submit")?.removeEventListener("click", this.boundSubmit);
            this.element.remove();
            this.element = null;
            this.fields = null;
        }
    }

    render() {
        if (!this.element || this.parent.contains(this.element)) return;
        this.parent.appendChild(this.element);
    }
}
