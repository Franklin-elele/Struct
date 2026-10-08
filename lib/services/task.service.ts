import api from "../api";

export const getTodayTasks = async () => 
    api.get("api/task/today");

export const completeTask = async (id: string) =>
    api.patch(`api/task/${id}/complete`);

export const getTasksByDate  = async (date: string) =>
    api.get(`api/task?date=${date}`);