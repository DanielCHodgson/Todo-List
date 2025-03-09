import "./CreateSwimlaneModal.css";
import Utility from "../../../utilities/DomUtility";

export default function CreateSwimLaneModal(events) {

    const icons = {
        close: `<svg xmlns="http://www.w3.org/2000/svg" width="1rem" height="1rem" viewBox="0 0 384 512"><path d="M376.6 84.5c11.3-13.6 9.5-33.8-4.1-45.1s-33.8-9.5-45.1 4.1L192 206 56.6 43.5C45.3 29.9 25.1 28.1 11.5 39.4S-3.9 70.9 7.4 84.5L150.3 256 7.4 427.5c-11.3 13.6-9.5 33.8 4.1 45.1s33.8 9.5 45.1-4.1L192 306 327.4 468.5c11.3 13.6 31.5 15.4 45.1 4.1s15.4-31.5 4.1-45.1L233.7 256 376.6 84.5z"/></svg>`,
    };

    const parent = document.querySelector(".app-wrapper");
    let element = null;

    events.on("addSwimlane", launchModal);

    function launchModal() {
        if (!element) element = createElement();
        render();
    }


    function createElement() {

        const modal = Utility.createElement("div", "create-swimlane-modal");

        const header = Utility.createElement("div", "header");
        header.appendChild(Utility.createElement("P", "title", "Add swimlane"))
        header.appendChild(Utility.createIconButton("close", icons.close, destroy));

        const body = Utility.createElement("div", "body");
        const form = Utility.createElement("form", "form");
        form.appendChild(Utility.createInputFormGroup("status", "Status", true, 1, 20));

        const submit = Utility.createElement("button", "submit", "Add");
        submit.addEventListener("click", (event) => handleSubmit)
        form.appendChild(submit);

        body.appendChild(form);
        modal.appendChild(header);
        modal.appendChild(body);

        return modal;
    }

    function handleSubmit(event) {
        event.preventDefault();

    }

    function destroy() {
        element.remove();
    }


    function render() {
        parent.appendChild(element)
    }

    return {
        render
    }


}