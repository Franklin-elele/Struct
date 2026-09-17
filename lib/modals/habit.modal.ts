import mongoose, { Schema, Document, model } from "mongoose";

interface IHabit extends Document {
    structureId: mongoose.Types.ObjectId;
    title: string;
    frequency: "daily" | "custom";
    customDays?: string[];
    duration?: string;
    createdAt: Date;
    updatedAt: Date;
}

const habitSchema = new Schema <IHabit>({
    structureId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Structure",
        required: true,
    },
    title: {
        type: String,
        required: true,
        trim: true,
        minLength: 3,
    },
    frequency: {
        type: String,
        required: true,
        enum: ["daily", "custom"],
        default: "daily",
    },
    customDays: {
        type: [String],
        default: undefined,
    },
    duration: {
        type: String,
        trim: true,
    }
}, {timestamps: true});

const habitSchemaModel = mongoose.models.Habit || model<IHabit>("Habit", habitSchema);

export default habitSchemaModel;