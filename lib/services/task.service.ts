import api from "../api";

export const getTodayTasks = async () => 
    api.get("api/tasks/today");

export const completeTask = async (id: string) =>
    api.patch(`api/tasks/${id}/complete`);

export const getTaskHistory = async (days = 30) =>
    api.get(`api/tasks/history?days=${days}`);