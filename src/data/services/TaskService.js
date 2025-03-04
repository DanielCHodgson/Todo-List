import Task from "../Models/TaskModel";

export default class TaskService {

    #tasks;
    #index;

    constructor(tasks, index) {
        this.#tasks = tasks;
        this.#index = index;
    }

    addTask(newTask) {
        const exists = this.#tasks.some(task => task.getId() === newTask.getId());
        if (!exists) {
            this.#tasks.push(newTask);
            this.#index += 1;
        }
    }

    addTasks(tasks) {
        tasks.forEach(task => {
            const exists = this.#tasks.some(task => getId() === task.id);
            if (!exists) {
                this.#tasks.push(task);
                this.#index += 1;
            }
        });
    }

    updateTask(updatedTask) {
        const index = this.#tasks.findIndex(task => task.getId() === updatedTask.getId());
        if (index !== -1) {
            this.#tasks[index] = updatedTask;
        }
    }

    removeTask(id) {
        this.#tasks = this.#tasks.filter(task => task.getId() !== id);
    }

    getTaskById(id) {
        console.log(typeof id)
        console.log(typeof this.#tasks[0].getId())

        return this.#tasks.find(task => task.getId() === id);
    }

    getTasksByStatus(status) {
        return this.#tasks.filter(task => task.getStatus() === status);
    }

    getTasks() {
        return this.#tasks;
    }

    getIndex() {
        return this.#index;
    }

    toJSON() {
        return {
            tasks: this.#tasks.map(task => task.toJSON()),
            index: this.#index,
        };
    }

    static fromJSON(data) {
        return new TaskService(data.tasks.map(task => Task.fromJSON(task)), data.index);
    }
}