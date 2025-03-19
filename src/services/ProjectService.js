import ProjectModel from "../data/models/ProjectModel";
import TaskService from "./TaskService";
import LaneService from "./LaneService";

export default class ProjectService {

    static PROJECTS_KEY = "projectData";
    static CURR_PROJECT_NAME_KEY = "currentProjectName";

    static get CURRENT_PROJECT() {
        return this.load(localStorage.getItem(this.CURR_PROJECT_NAME_KEY));
    }

    static set CURRENT_PROJECT(projectName) {
        if (projectName) {
            localStorage.setItem(this.CURR_PROJECT_NAME_KEY, projectName);
        } else {
            localStorage.removeItem(this.CURR_PROJECT_NAME_KEY);
        }
    }

    static save(savedProject) {
        let projects = this.loadAllFromLocalStorage();
        let projectExists = false;

        projects = projects.map(project => {
            if (project.name === savedProject.getName()) {
                projectExists = true;
                return savedProject.toJSON();
            }
            return project;
        });

        if (!projectExists) {
            projects.push(savedProject.toJSON());
        }

        this.saveAllToLocalStorage(projects);
    }

    static load(projectName) {
        if (!projectName)
            return null;

        const projectData =
            this.loadAllFromLocalStorage()
                .find(project => project.name === projectName);

        return projectData.length === 0 ?
            null :
            new ProjectModel(
                projectData.name,
                projectData.type,
                projectData.icon,
                TaskService.fromJSON(projectData.taskService),
                LaneService.fromJSON(projectData.laneService)
            );
    }

    static loadFirst() {
        return this.loadAllFromLocalStorage().length === 0 ?
            null :
            this.load(storedProjects[0].name);
    }

    static delete(name) {
        let projects = this.loadAllFromLocalStorage();

        if (projects.length === 0)
            return;

        this.saveAllToLocalStorage(projects.filter(project => project.name !== name));

        if (this.CURRENT_PROJECT.getName() === name)
            localStorage.removeItem(this.CURR_PROJECT_NAME_KEY);
    }

    static saveAllToLocalStorage(projects) {
        localStorage.setItem(this.PROJECTS_KEY, JSON.stringify(projects));
    }

    static loadAllFromLocalStorage() {
        return JSON.parse(localStorage.getItem(this.PROJECTS_KEY)) || [];
    }

    static switchProject(projectName) {
        if (projectName)
            localStorage.setItem(this.CURR_PROJECT_NAME_KEY, projectName);
    }

}
