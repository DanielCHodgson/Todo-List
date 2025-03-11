import "./CreateProjectModal.css";
import Utility from "../../../utilities/DomUtility";
import Validator from "../../../utilities/Validator";
import EventBus from "../../../utilities/EventBus";
import getIcons from "../../../res/icons/icons";

export default class CreateProjectModal {
    constructor() {
        this.parent = document.querySelector(".app-wrapper");
        this.element = null;
        this.fields = null;

        EventBus.on("addProject", (task) => this.open(task));
    }

    open() {
        if (!this.element) {
            this.element = this.createElement();
            this.render();
            this.cacheFields();
        }
    }

    cacheFields() {
        this.fields = {
            name: this.element.querySelector("#name"),
            type: this.element.querySelector("#type"),
        };
    }

    createElement() {
        const modal = Utility.createElement("div", "create-project-modal");

        const header = Utility.createElement("div", "header");
        header.appendChild(Utility.createElement("p", "title", "New Project"));
        header.appendChild(Utility.createIconButton("close", getIcons().close, this.destroy.bind(this)));

        const body = Utility.createElement("div", "body");
        const form = Utility.createElement("form", "form");
        form.appendChild(Utility.createInputFormGroup("name", "Name", true, 1, 5));
        form.appendChild(Utility.createInputFormGroup("type", "Type", true, 1, 15));

        const submit = Utility.createElement("button", "submit", "Add");
        submit.addEventListener("click", (event) => this.handleSubmit(event));
        form.appendChild(submit);

        body.appendChild(form);
        modal.appendChild(header);
        modal.appendChild(body);

        return modal;
    }

    handleSubmit(event) {
        event.preventDefault();
        const data = Object.fromEntries(
            Object.entries(this.fields).map(([key, element]) => [key, element.value.trim()])
        );

        if (Validator.isValidProjectData(data)) {
            EventBus.emit("createProject", data);
            this.destroy();
        }
    }

    destroy() {
        if (this.element && this.parent.contains(this.element)) {
            this.element.remove();
            this.element = null;
            this.fields = null;
        }
    }


    cleanUp() {
        EventBus.off("addProject");
    }

    render() {
        if (!this.parent.contains(this.element)) {
            this.parent.appendChild(this.element);
        }
    }
}
