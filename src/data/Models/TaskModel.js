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

    static fromJSON(data) {
        return new Task(
            data.id,
            data.project,
            data.summary,
            data.description,
            data.priority,
            data.dueDate,
            data.status
        );
    }
}
