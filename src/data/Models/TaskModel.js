export default class Task {
    #id;
    #project;
    #summary;
    #description;
    #priority;
    #dueDate;
    #status;

    constructor(id, project, summary, description, priority, dueDate, status) {
        if (!id || !project || !summary || !priority || !status) {
            throw new Error("Missing required fields.");
        }
        this.#id = id;
        this.#project = project;
        this.#summary = summary;
        this.#description = description || "";
        this.#priority = priority;
        this.#dueDate = dueDate;
        this.#status = status;
    }


    getId() {
        return this.#id;
    }
    getProject() {
        return this.#project;
    }
    getSummary() {
        return this.#summary;
    }
    getDescription() {
        return this.#description;
    }
    getPriority() {
        return this.#priority;
    }
    getDueDate() {
        return this.#dueDate;
    }
    getStatus() {
        return this.#status;
    }

    setProject(value) {
        this.#project = value.trim();
    }
    setSummary(value) {
        this.#summary = value.trim();
    }
    setDescription(value) {
        this.#description = value.trim();
    }

    setDueDate(value) {
       //To do
    }

    setStatus(value) {
        this.#status = value.trim();
    }

    toJSON() {
        return {
            id: this.#id,
            project: this.#project,
            summary: this.#summary,
            description: this.#description,
            priority: this.#priority,
            dueDate: this.#dueDate,
            status: this.#status
        };
    }

    static fromJSON(json) {
        return new Task(
            json.id,
            json.project,
            json.summary,
            json.description,
            json.priority,
            json.dueDate,
            json.status
        );
    }
}
