import mongoose, { Schema, model } from "mongoose";

interface IStructure {
    userId: mongoose.Types.ObjectId;
    title: string;
    startDate: Date;
    endDate: Date;
    status: "active" | "archived";
    isCurrent: boolean;
    createdAt: Date;
    UpdatedAt: Date;
}

const structureSchemaModal = new Schema <IStructure>({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    title: {
        type: String,
        required: true,
        trim: true,  
        minLength: 3,
    },
    startDate: {
        type: Date,
         default: Date.now,
    },
    endDate: {
        type: Date,
        required: true,
    },
    status: {
        type: String,
        enum: ["active", "archived"],
        default: "active",
    },
    isCurrent: {
        type: Boolean,
        default: false,
    }

}, {timestamps: true});

const structureSchema = mongoose.models.Structure || model<IStructure>("Structure", structureSchemaModal);

export default structureSchema;