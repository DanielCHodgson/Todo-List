import Utility from "../../../Utilities/domUtility.js";
import "./CreateTaskModal.css"

export default function NewTaskModal(events) {

    const parent = document.querySelector(".app-wrapper");
    const icons = {
        close: `<svg xmlns="http://www.w3.org/2000/svg" width="1rem" height="1rem" viewBox="0 0 384 512"><path d="M376.6 84.5c11.3-13.6 9.5-33.8-4.1-45.1s-33.8-9.5-45.1 4.1L192 206 56.6 43.5C45.3 29.9 25.1 28.1 11.5 39.4S-3.9 70.9 7.4 84.5L150.3 256 7.4 427.5c-11.3 13.6-9.5 33.8 4.1 45.1s33.8 9.5 45.1-4.1L192 306 327.4 468.5c11.3 13.6 31.5 15.4 45.1 4.1s15.4-31.5 4.1-45.1L233.7 256 376.6 84.5z"/></svg>`,
        expand: `<svg xmlns="http://www.w3.org/2000/svg" width="1rem" height="1rem" viewBox="0 0 512 512"><path d="M344 0L488 0c13.3 0 24 10.7 24 24l0 144c0 9.7-5.8 18.5-14.8 22.2s-19.3 1.7-26.2-5.2l-39-39-87 87c-9.4 9.4-24.6 9.4-33.9 0l-32-32c-9.4-9.4-9.4-24.6 0-33.9l87-87L327 41c-6.9-6.9-8.9-17.2-5.2-26.2S334.3 0 344 0zM168 512L24 512c-13.3 0-24-10.7-24-24L0 344c0-9.7 5.8-18.5 14.8 22.2s19.3 1.7 26.2 5.2l39 39 87-87c9.4-9.4 24.6-9.4 33.9 0l32 32c9.4 9.4 9.4 24.6 0 33.9l-87 87 39 39c6.9 6.9 8.9 17.2 5.2 26.2s-12.5 14.8-22.2 14.8z"/></svg>`
    };

    let modal;
    let form;

    events.on("renderModal", showModal);

    function showModal() {
        render();
    }

    function createHeader() {

        const header = Utility.createElement("div", "modal-header");
        header.appendChild(Utility.createElement("h2", "modal-title", "New task"));

        const iconRow = Utility.createElement("div", "icon-row");
        iconRow.appendChild(createIconButton("expand", icons.expand));
        iconRow.appendChild(createIconButton("close", icons.close, destroy));

        header.appendChild(iconRow);
        return header;
    }

    function createIconButton(className, icon, onClick = null) {
        const btn = Utility.createElement("div", className);
        btn.appendChild(Utility.renderSvg(icon));
        if (onClick) btn.addEventListener("click", onClick);
        return btn;
    }

    function createForm() {
        form = Utility.createElement("form", null, null, { id: "new-task-form" });
        form.appendChild(Utility.createSelectFormGroup("project", "Project", ["My project"]));
        form.appendChild(Utility.createInputFormGroup("summary", "Summary", true, 1, 35));
        form.appendChild(Utility.createTextAreaFormGroup("description", "Description", false, 0, 500));
        form.appendChild(Utility.createSelectFormGroup("priority", "Priority", ["P1", "P2", "P3", "P4", "P5"]));
        form.appendChild(Utility.createSelectFormGroup("status", "Status", ["ready to start", "in progress", "in review", "closed"]));
        form.appendChild(Utility.createInputFormGroup("date", "Due date", true, "8", "10"));

        return form;
    }

    function createFooter() {
        const footer = Utility.createElement("div", "modal-footer");

        const createBtn = Utility.createElement("button", "create-btn", "Create");
        createBtn.addEventListener("click", createTask);

        const cancelBtn = Utility.createElement("button", "cancel-btn", "Cancel");
        cancelBtn.addEventListener("click", destroy);

        footer.appendChild(createBtn);
        footer.appendChild(cancelBtn);

        return footer;
    }

    function createTask() {

        const fields = {
            project: form.querySelector("#project"),
            summary: form.querySelector("#summary"),
            description: form.querySelector("#description"),
            priority: form.querySelector("#priority"),
            date: form.querySelector("#date"),
            status: form.querySelector("#status")
        };
    
        if (isValidTaskData(fields)) {
            const data = Object.fromEntries(Object.entries(fields).map(([key, element]) => [key, element.value.trim()]));
            events.emit("createTask", data);
            destroy();
        }
    }

    function isValidTaskData(fields) {

        const errors = [];

        Object.entries(fields)
            .filter(([key]) => key !== "description" && key !== "date")
            .forEach(([key, element]) => {
                if (!element.value) {
                    element.classList.add("invalid-field");
                    errors.push(`${key} is a mandatory field.`);
                } else {
                    element.classList.remove("invalid-field");
                }
            });

        if (fields.summary.value.length > 35) {
            errors.push("Summary must be 35 characters or less.");
        }

        const dateRegex = /^([0-2][0-9]|(3)[0-1])-(0[1-9]|1[0-2])-\d{4}$/;
        if (!dateRegex.test(fields.date.value)) {
            errors.push("Date must be in the format DD-MM-YYYY.");
        }

        if (errors.length > 0) {
            displayErrorMessages(errors);
            return false;
        }

        return true;
    }


    function displayErrorMessages(errors) {
        // To DO - print to UI
        alert(errors.join("\n"));
    }

    function render() {
        modal = Utility.createElement("div", "create-task-modal");
        modal.appendChild(createHeader());
        modal.appendChild(createForm());
        modal.appendChild(createFooter());

        parent.appendChild(modal);
    }

    function destroy() {
        parent.querySelector(".create-btn")?.removeEventListener("click", createTask);
        parent.querySelector(".cancel-btn")?.removeEventListener("click", destroy);
        modal.remove();
    }

    return {
        render
    }
}