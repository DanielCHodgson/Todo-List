export default class TaskManager {

    #tasks;
    #index;

    constructor() {
        this.#tasks = [];
        this.#index = 1;
    }

    addTask(task) {
        const exists = this.#tasks.some(t => t.id === task.id);
        if (!exists) {
            this.#tasks.push(task);
            this.#index += 1;
            console.log(this.#tasks)
        }
    }

    addTasks(tasks) {
        tasks.forEach(task => {
            const exists = this.#tasks.some(task => task.id === task.id);
            if (!exists) {
                    this.#tasks.push(task);
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
        return this.#tasks;
    }

    getIndex() {
        return this.#index;
    }
}