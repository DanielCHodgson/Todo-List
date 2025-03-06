import ProjectModel from "../data/models/ProjectModel";
import TaskService from "../data/services/TaskService";

export default class DataUtility {

    static PROJECT_STORAGE_KEY = "projectData";

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
        const storedProjects = JSON.parse(localStorage.getItem(DataUtility.PROJECT_STORAGE_KEY)) || [];

        if (storedProjects.length === 0) {
            console.log("No project data");
            return null;
        }

        const projectData = storedProjects.find(project => project.name === projectName);

        return new ProjectModel(
            projectData.name,
            projectData.type,
            projectData.icon,
            TaskService.fromJSON(projectData.taskService)
        );
    }
}
