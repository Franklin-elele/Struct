import mongoose, { Schema, model } from "mongoose";

interface ITask {
    habitId: mongoose.Types.ObjectId;
    structureId: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    date: Date;
    title: string;
    completed: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const taskSchema = new Schema <ITask> ({
    habitId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Habit",
        required: true,
    },
    structureId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Structure",
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    title: {
        type: String,
        required: true,
        trim: true,
        minLength: 3,
    },
    completed: {
        type: Boolean,
        default: false,
    }
}, {timestamps: true});

// Ensures no duplicate Task exists for the same Habit on the same day —
// prevents double-generation (e.g. if the daily Task-generation job runs twice by accident)
taskSchema.index({ habitId: 1, date: 1 }, { unique: true });
const taskSchemaModel = mongoose.models.Task || model<ITask>("Task", taskSchema);

export default taskSchemaModel;