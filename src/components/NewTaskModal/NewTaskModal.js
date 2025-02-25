import Utility from "../../Utilities/utility.js";
import "./NewTaskModal.css"

export default function NewTaskModal() {

    const parent = document.querySelector(".app-wrapper");

    const closeIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="1rem" height="1rem" viewBox="0 0 384 512"><path d="M376.6 84.5c11.3-13.6 9.5-33.8-4.1-45.1s-33.8-9.5-45.1 4.1L192 206 56.6 43.5C45.3 29.9 25.1 28.1 11.5 39.4S-3.9 70.9 7.4 84.5L150.3 256 7.4 427.5c-11.3 13.6-9.5 33.8 4.1 45.1s33.8 9.5 45.1-4.1L192 306 327.4 468.5c11.3 13.6 31.5 15.4 45.1 4.1s15.4-31.5 4.1-45.1L233.7 256 376.6 84.5z"/></svg>';
    const expandIocn = `<svg xmlns="http://www.w3.org/2000/svg" width="1rem" height="1rem" viewBox="0 0 512 512"><path d="M344 0L488 0c13.3 0 24 10.7 24 24l0 144c0 9.7-5.8 18.5-14.8 22.2s-19.3 1.7-26.2-5.2l-39-39-87 87c-9.4 9.4-24.6 9.4-33.9 0l-32-32c-9.4-9.4-9.4-24.6 0-33.9l87-87L327 41c-6.9-6.9-8.9-17.2-5.2-26.2S334.3 0 344 0zM168 512L24 512c-13.3 0-24-10.7-24-24L0 344c0-9.7 5.8-18.5 14.8-22.2s19.3-1.7 26.2 5.2l39 39 87-87c9.4-9.4 24.6-9.4 33.9 0l32 32c9.4 9.4 9.4 24.6 0 33.9l-87 87 39 39c6.9 6.9 8.9 17.2 5.2 26.2s-12.5 14.8-22.2 14.8z"/></svg>`;

    function createHeader() {

        const header = document.createElement("div");
        header.classList.add("modal-header")

        const title = document.createElement("h2");
        title.classList.add("modal-title");
        title.textContent = "New task";
        header.appendChild(title);

        const icons = document.createElement("div");
        icons.classList.add("icon-row");

        const expand = document.createElement("div");
        expand.classList.add("expand");
        expand.appendChild(Utility.renderSvg(expandIocn));
        icons.appendChild(expand);

        const close = document.createElement("div");
        close.classList.add("close");
        close.appendChild(Utility.renderSvg(closeIcon));
        icons.appendChild(close);

        header.append(icons);
        return header;
    }

    function createProjectField() {
        const options = ["My project"];
        return Utility.createSelectFormGroup("project", "Project", options);
    }

    function createPriorityField() {
        const options = ["P1", "P2", "P3", "P4", "P5"];
        return Utility.createSelectFormGroup("priority", "Priority", options);
    }


    function createSummaryField() {
        return Utility.createInputFormGroup("summary", "Summary", true, "1", "40");
    }

    function createDescriptionField() {
        const formGroup = document.createElement("div");
        formGroup.classList.add("form-group");

        const label = document.createElement("label");
        label.setAttribute("for", "description");
        label.textContent = "Description";

        const input = document.createElement("textarea");
        input.id = "description";
        input.maxLength = "500";

        formGroup.appendChild(label);
        formGroup.appendChild(input);
        return formGroup;
    }


    function createFooter() {
        const footer = document.createElement("div");
        footer.classList.add("modal-footer");

        const create = document.createElement("button");
        create.classList.add("create-btn");
        create.textContent = "Create";
        footer.appendChild(create);

        const cancel = document.createElement("button");
        cancel.classList.add("cancel-btn");
        cancel.textContent = "Cancel";
        footer.appendChild(cancel);

        return footer;
    }


    function createDueDate() {
        return Utility.createInputFormGroup("date", "Due date", true, "8", "10");
    }

    function render() {

        const modal = document.createElement("div");
        modal.classList.add("create-task-modal");

        modal.appendChild(createHeader());

        const form = document.createElement("form");
        form.id = "new-task-form";
        form.appendChild(createProjectField());
        form.appendChild(createSummaryField());
        form.appendChild(createDescriptionField());
        form.appendChild(createPriorityField());
        form.appendChild(createDueDate());

        modal.appendChild(form);
        modal.appendChild(createFooter());
        parent.appendChild(modal);
    }

    return {
        render
    }
}