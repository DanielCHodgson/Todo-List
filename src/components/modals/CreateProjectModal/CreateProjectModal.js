import "./CreateProjectModal.css"

import Utility from "../../../utilities/DomUtility";
import Validator from "../../../utilities/Validator";
import EventBus from "../../../utilities/EventBus";
import getIcons from "../../../res/icons/icons";

export default function CreateProjectModal() {

    const parent = document.querySelector(".app-wrapper");
    let element = null;
    let fields = null;

    function launchModal() {
        if (!element) {
            element = createElement();
            render();
            cacheFields();
        }
    }

    function cacheFields() {
        fields = {
            name: element.querySelector("#name"),
            type: element.querySelector("#type"),
        };
    }

    function createElement() {

        const modal = Utility.createElement("div", "create-project-modal");

        const header = Utility.createElement("div", "header");
        header.appendChild(Utility.createElement("P", "title", "New Project"))
        header.appendChild(Utility.createIconButton("close", getIcons().close, destroy));

        const body = Utility.createElement("div", "body");
        const form = Utility.createElement("form", "form");
        form.appendChild(Utility.createInputFormGroup("name", "Name", true, 1, 5));
        form.appendChild(Utility.createInputFormGroup("type", "Type", true, 1, 15));

        const submit = Utility.createElement("button", "submit", "Add");
        submit.addEventListener("click", (event) => handleSubmit(event))
        form.appendChild(submit);

        body.appendChild(form);
        modal.appendChild(header);
        modal.appendChild(body);

        return modal;
    }

    function handleSubmit(event) {
        event.preventDefault();
        const data = Object.fromEntries(Object.entries(fields).map(([key, element]) => [key, element.value.trim()]));
        if (Validator.isValidProjectData(data)) {
            EventBus.emit("createProject", data);
            destroy();
        }
    }

    function destroy() {
        element.remove();
    }


    function render() {
        parent.appendChild(element)
    }

    return {
        launchModal
    }
}