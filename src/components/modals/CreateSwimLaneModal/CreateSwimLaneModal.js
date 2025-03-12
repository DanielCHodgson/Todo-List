import "./CreateSwimlaneModal.css";
import Utility from "../../../utilities/DomUtility";
import EventBus from "../../../utilities/EventBus";
import Validator from "../../../utilities/Validator";
import getIcons from "../../../res/icons/icons";

export default class CreateSwimLaneModal {
    constructor() {
        this.parent = document.querySelector(".app-wrapper");
        this.element = null;
        this.statusField = null;

        this.boundOpen = this.open.bind(this);
        EventBus.on("addSwimlane", this.boundOpen);
    }

    open() {
        if (!this.element) this.element = this.createElement();
        this.cacheFields();
        this.render();
    }

    cacheFields() {
        this.statusField = this.element.querySelector("#status");
    }

    createElement() {
        const modal = Utility.createElement("div", "create-swimlane-modal");

        const header = Utility.createElement("div", "header");
        header.appendChild(Utility.createElement("p", "title", "Add Swimlane"));
        header.appendChild(Utility.createIconButton("close", getIcons().close, () => this.destroy()));

        const body = Utility.createElement("div", "body");
        const form = Utility.createElement("form", "form");
        const status = Utility.createInputFormGroup("status", "Status", true, 1, 20);
        status.querySelector("input").textContent = "";
        form.appendChild(status);

        const submit = Utility.createElement("button", "submit", "Add");
        submit.addEventListener("click", (event) => this.handleSubmit(event, status));
        form.appendChild(submit);

        body.appendChild(form);
        modal.appendChild(header);
        modal.appendChild(body);

        return modal;
    }

    handleSubmit(event, fieldGroup) {
        event.preventDefault();

        const status = fieldGroup.querySelector("#status").value.toLowerCase();
        if (Validator.isValidSwimLaneStatus(status)) {
            EventBus.emit("createSwimLane", status);
            this.destroy();
        }
    }

    destroy() {
        if (this.element) {
            this.element.remove();
            this.element = null;
        }
    }

    cleanUp() {
        EventBus.off("addSwimlane", this.boundOpen);
    }

    render() {
        if (!this.parent.contains(this.element)) {
            this.parent.appendChild(this.element);
        }
    }
}
