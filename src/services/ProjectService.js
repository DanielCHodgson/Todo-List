import ProjectModel from "../data/models/ProjectModel";
import TaskService from "./TaskService";
import LaneService from "./LaneService";

export default class ProjectService {

    static PROJECT_STORAGE_KEY = "projectData";
    static CURRENT_PROJECT = this.loadCurrentProject();

    static saveProject(savedProject) {
        let projects = JSON.parse(localStorage.getItem(this.PROJECT_STORAGE_KEY)) || [];
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
    
        localStorage.setItem(this.PROJECT_STORAGE_KEY, JSON.stringify(projects));
    }
    
    static loadProject(projectName) {
        const storedProjects = this.getProjects() || [];

        if (storedProjects.length === 0) {
            console.log("No project data");
            return null;
        }

        const projectData = storedProjects.find(project => project.name === projectName);

        console.log(projectData)

        return new ProjectModel(
            projectData.name,
            projectData.type,
            projectData.icon,
            TaskService.fromJSON(projectData.taskService),
            LaneService.fromJSON(projectData.laneService),
        );
    }

    static getProjects() {
        return JSON.parse(localStorage.getItem(this.PROJECT_STORAGE_KEY));
    }

    static loadCurrentProject() {
        return this.loadProject(localStorage.getItem("currentProject"));
    }

    static getCurrentProjectName() {
        return localStorage.getItem("currentProject");
    }

    static setCurrentProject(projectName) {
        localStorage.setItem("currentProject", projectName);
        this.CURRENT_PROJECT = this.loadCurrentProject();
    }

}
