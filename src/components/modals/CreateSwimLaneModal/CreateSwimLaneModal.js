import "./CreateSwimLaneModal.css";
import Utility from "../../../utilities/DomUtility";

export default function CreateSwimLaneModal() {

    const parent = document.querySelector(".app-wrapper");
    const element = createElement();

    render();

    function createElement() {

        const modal = Utility.createElement("div", "create-swimlane-modal");

        const form = Utility.createElement("form", "form")

        const status = Utility.createInputFormGroup("status", "Status", true, 1, 20);
        const submit = Utility.createElement("button", "submit", "Add");

        form.appendChild(status);
        form.appendChild(submit);

        modal.appendChild(form)

        return modal;
    }


    function destroy() {
        if (parent && element)
            parent.remove(element);
    }


    function render() {
        parent.appendChild(element)
    }

    return {
        render
    }


}