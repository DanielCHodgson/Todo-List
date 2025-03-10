import "./CreateSwimlaneModal.css";
import Utility from "../../../utilities/DomUtility";
import EventBus from "../../../utilities/EventBus";
import Validator from "../../../utilities/Validator";
import getIcons from "../../../res/icons/icons";

export default function CreateSwimLaneModal() {

    const parent = document.querySelector(".app-wrapper");
    let element = null;
    let status = null;

    EventBus.on("addSwimlane", launchModal);

    function launchModal() {
        if (!element) element = createElement();
        cacheFields();
        render();
    }

    function cacheFields() {
        status = element.querySelector("#status")
    }


    function createElement() {

        const modal = Utility.createElement("div", "create-swimlane-modal");

        const header = Utility.createElement("div", "header");
        header.appendChild(Utility.createElement("P", "title", "Add swimlane"))
        header.appendChild(Utility.createIconButton("close", getIcons().close, destroy));

        const body = Utility.createElement("div", "body");
        const form = Utility.createElement("form", "form");
        const status = Utility.createInputFormGroup("status", "Status", true, 1, 20);
        status.querySelector("input").textContent = "";
        form.appendChild(status);

        const submit = Utility.createElement("button", "submit", "Add");
        submit.addEventListener("click", (event) => handleSubmit(event, status))
        form.appendChild(submit);

        body.appendChild(form);
        modal.appendChild(header);
        modal.appendChild(body);

        return modal;
    }

    function handleSubmit(event, fieldGroup) {
        event.preventDefault();

        const status = fieldGroup.querySelector("#status").value.toLowerCase();
        if (Validator.isValidSwimLaneStatus(status)) {
            EventBus.emit("createSwimLane", status);
            destroy();
        }
    }

    function destroy() {
        if (element);
        element.remove();
    }


    function render() {
        parent.appendChild(element)
    }

    return {
        render
    }


}