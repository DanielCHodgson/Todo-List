export default class TaskManager {

    #tasks;
    #status;

    constructor(status) {
        this.#status = status;
        this.#tasks = [];
    }

    addTask(task) {
        if (task.status === this.#status) {
            const exists = this.#tasks.some(t => t.id === task.id);
            if (!exists) {
                this.#tasks.push(task);
            }
        }
    }

    addTasks(tasks) {
        tasks.forEach(task => {
            const exists = this.#tasks.some(t => t.id === task.id);
            if (!exists) {
                if (task.status === this.#status) {
                    this.#tasks.push(task);
                }
            }
        });
    }

    removeTask(id) {
        this.#tasks = this.#tasks.filter(task => task.id !== id);
    }

    getTaskById(id) {
        return this.#tasks.find(task => task.id === id);
    }

    getTasks() {
        return this.getTasks;
    }
}