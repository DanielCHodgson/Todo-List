import Utility from "../../../utilities/DomUtility.js";
import "./CreateTaskModal.css";
import Validator from "../../../utilities/Validator.js";

export default function NewTaskModal(events) {
    const parent = document.querySelector(".app-wrapper");
    const icons = {
        close: `<svg xmlns="http://www.w3.org/2000/svg" width="1rem" height="1rem" viewBox="0 0 384 512"><path d="M376.6 84.5c11.3-13.6 9.5-33.8-4.1-45.1s-33.8-9.5-45.1 4.1L192 206 56.6 43.5C45.3 29.9 25.1 28.1 11.5 39.4S-3.9 70.9 7.4 84.5L150.3 256 7.4 427.5c-11.3 13.6-9.5 33.8 4.1 45.1s33.8 9.5 45.1-4.1L192 306 327.4 468.5c11.3 13.6 31.5 15.4 45.1 4.1s15.4-31.5 4.1-45.1L233.7 256 376.6 84.5z"/></svg>`,
        expand: `<svg xmlns="http://www.w3.org/2000/svg" width="1rem" height="1rem" viewBox="0 0 512 512"><path d="M344 0L488 0c13.3 0 24 10.7 24 24v144c0 9.7-5.8 18.5-14.8 22.2s-19.3 1.7-26.2-5.2l-39-39-87 87c-9.4 9.4-24.6 9.4-33.9 0l-32-32c-9.4-9.4-9.4-24.6 0-33.9l87-87L327 41c-6.9-6.9-8.9-17.2-5.2-26.2S334.3 0 344 0zM168 512L24 512c-13.3 0-24-10.7-24-24V344c0-9.7 5.8-18.5 14.8-22.2s19.3-1.7 26.2 5.2l39 39 87-87c9.4-9.4 24.6-9.4 33.9 0l32 32c9.4 9.4 9.4 24.6 0 33.9l-87 87 39 39c6.9 6.9 8.9 17.2 5.2 26.2s-12.5 14.8-22.2 14.8z"/></svg>`
    };

    let element = null;
    let form = null;
    let fields = {};
    let statuses = null;

    events.on("openNewTaskModal", (laneService) => launchModal(laneService));

    function launchModal(laneService) {

        statuses = laneService
            .getLanes()
            .map(lane => {
                return lane.getStatus();
            })

        if (!element) {
            element = createElement();
            render();
            cacheFields();
        }
    }

    function cacheFields() {
        fields = {
            summary: element.querySelector("#summary"),
            description: element.querySelector("#description"),
            project: element.querySelector("#project"),
            priority: element.querySelector("#priority"),
            status: element.querySelector("#status"),
            date: element.querySelector("#date")
        };
    }

    function createElement() {
        const modal = Utility.createElement("div", "create-task-modal");
        modal.append(createHeader(), createForm(), createFooter());
        return modal;
    }

    function createHeader() {
        const header = Utility.createElement("div", "modal-header");
        header.appendChild(Utility.createElement("h2", "modal-title", "New task"));

        const iconRow = Utility.createElement("div", "icon-row");
        iconRow.appendChild(Utility.createIconButton("expand", icons.expand));
        iconRow.appendChild(Utility.createIconButton("close", icons.close, destroy));

        header.appendChild(iconRow);
        return header;
    }

    function createForm() {
        form = Utility.createElement("form", null, null, { id: "new-task-form" });

        form.append(
            Utility.createSelectFormGroup("project", "Project", ["SAAS"]),
            Utility.createInputFormGroup("summary", "Summary", true, 1, 35),
            Utility.createTextAreaFormGroup("description", "Description", false, 0, 500),
            Utility.createSelectFormGroup("priority", "Priority", ["P1", "P2", "P3", "P4", "P5"]),
            Utility.createSelectFormGroup("status", "Status", statuses),
            Utility.createInputFormGroup("date", "Due date", true, 10, 10)
        );

        return form;
    }

    function createFooter() {
        const footer = Utility.createElement("div", "modal-footer");

        const createBtn = Utility.createElement("button", "create-btn", "Create", { type: "submit" });
        createBtn.addEventListener("click", createTask);

        const cancelBtn = Utility.createElement("button", "cancel-btn", "Cancel", { type: "button" });
        cancelBtn.addEventListener("click", destroy);

        footer.append(createBtn, cancelBtn);
        return footer;
    }

    function createTask(event) {
        event.preventDefault();

        if (Validator.isValidTaskData(fields)) {
            const data = Object.fromEntries(
                Object.entries(fields).map(([key, element]) => [key, element.value.trim()])
            );
            events.emit("createTask", data);
            destroy();
        }
    }

    function render() {
        parent.appendChild(element);
    }

    function destroy() {
        if (element) {
            form?.removeEventListener("submit", createTask);
            element.remove();
            element = null;
            fields = {};
        }
    }
}
