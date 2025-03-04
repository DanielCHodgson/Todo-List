import ProjectModel from "../data/Models/ProjectModel";
import TaskService from "../data/services/TaskService";

export default class DataUtility {

    static PROJECT_STORAGE_KEY = "projectData";

    static saveProject(project) {
        localStorage.setItem(DataUtility.PROJECT_STORAGE_KEY, JSON.stringify(project.toJSON()));
    }
    
    static loadProject() {
        const storedProject = localStorage.getItem(DataUtility.PROJECT_STORAGE_KEY);
        if (!storedProject) throw new Error("Project not found!");
    
        const projectData = JSON.parse(storedProject);

        return new ProjectModel(
            projectData.name,
            projectData.type,
            projectData.icon,
            TaskService.fromJSON(projectData.taskService) 
        );
    }
    
}
