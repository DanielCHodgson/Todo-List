import "./CreateSwimlaneModal.css";
import DomUtility from "../../../utilities/DomUtility";
import EventBus from "../../../utilities/EventBus";
import Validator from "../../../utilities/Validator";
import getIcons from "../../../res/icons/icons";

export default class CreateSwimLaneModal {

    #parent;
    #element;
    #statusField;
    #overlay;

    #boundSubmit;
    #boundOverlayClick;

    constructor() {
        this.#parent = document.querySelector(".app-wrapper");
        this.#element = null;
        this.#statusField = null;
        this.#overlay = null;

        this.#boundSubmit = this.#handleSubmit.bind(this);
        this.#boundOverlayClick = this.#handleOverlayClick.bind(this);
    }

    open() {
        console.log("opening!")
        this.#element = this.#createElement();
        this.#cacheFields();
        this.render();
        this.#createOverlay();
    }

    #cacheFields() {
        this.#statusField = this.#element.querySelector("#status");
    }

    #createElement() {
        const modal = DomUtility.createElement("div", "create-swimlane-modal");
        modal.id = "modal";

        const header = DomUtility.createElement("div", "header");
        header.appendChild(DomUtility.createElement("p", "title", "Add Swimlane"));
        header.appendChild(DomUtility.createIconButton("close", getIcons().close, () => this.destroy()));

        const body = DomUtility.createElement("div", "body");
        const form = DomUtility.createElement("form", "form");
        const status = DomUtility.createInputFormGroup("status", "Status", true, 1, 20);
        status.querySelector("input").textContent = "";
        form.appendChild(status);

        const submit = DomUtility.createElement("button", "submit", "Add");
        submit.addEventListener("click", this.#boundSubmit);
        form.appendChild(submit);

        body.appendChild(form);
        modal.appendChild(header);
        modal.appendChild(body);

        return modal;
    }

    #handleSubmit(event) {
        event.preventDefault();
        const status = this.#statusField.value.trim().toLowerCase();
        if (Validator.isValidSwimLaneStatus(status)) {
            EventBus.emit("createSwimLane", status);
            this.destroy();
        }
    }


    #unbindEvents() {
        this.#element.querySelector(".submit").removeEventListener("click", this.#boundSubmit);
        this.#element.querySelector(".submit").removeEventListener("click", () => this.destroy());
    }

    destroy() {
        if (this.#element) {
            this.#unbindEvents();

            if (this.#overlay) {
                this.#overlay.removeEventListener("click", this.#boundOverlayClick);
                this.#overlay.remove();
            }
            this.#element.remove();
            this.#element = null;
            this.#overlay = null;
        }
    }

    render() {
        if (!this.#element || this.#parent.contains(this.#element)) return;
        this.#parent.appendChild(this.#element);
    }

    #createOverlay() {
        if (!this.#overlay) {
            this.#overlay = DomUtility.createElement("div", "modal-overlay");
            this.#overlay.addEventListener("click", this.#boundOverlayClick);
            this.#parent.appendChild(this.#overlay);
        }
    }

    #handleOverlayClick() {
        this.destroy();
    }
}
