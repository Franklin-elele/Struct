import api from "../api";

// Types
export type CreateStructurePayload = {
    title: string;
}

export type updateStructurePayload = {
    title: string;
}

export type createHabitPayload = {
    title: string;
    frequency: "daily" | "custom";
    customDays?: string[];
    duration?: string;
}

export type updateHabitPayload = {
    title: string;
    frequency: "daily" | "custom";
    customDays?: string[];
    duration?: string;
}


// Structures endpoints
export const createStructure = async (data: CreateStructurePayload) =>
    api.post("api/structures", data);


export const updateStructure = async (id: string, data: updateStructurePayload) =>
    api.patch(`api/structures/${id}`, data);

export const getStructures = async () => 
    api.get("api/structures");

export const getStructureById = async (id: string) => 
    api.get(`api/structures/${id}`);

export const archiveStructureById = async (id: string) =>
    api.post(`api/structures/${id}/archive`)

export const setCurrentStructure = async (id: string) =>
    api.post(`api/structures/${id}/set-current`)


// Habits Endpoints
export const createHabit = async (structureId: string, data: createHabitPayload) =>
    api.post(`api/structures/${structureId}/habits`, data);

export const updateHabit = async (id: string, data: updateHabitPayload) =>
    api.patch(`api/habits/${id}`, data);

export const deleteHabit = async (id: string) =>
    api.delete(`api/habits/${id}`);

// export const getHabitById = async (id: string) => 
//     api.get(`api/habits/${id}`);

