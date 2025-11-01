import mongoose, { Document, Schema } from 'mongoose'

export enum UserRole {
    ADMIN = 'ADMIN',
    AUTHOR = 'AUTHOR',
    USER = 'USER',
}

export enum UserStatus {
    PENDING = 'PENDING',
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED'
}
 
export interface IUser extends Document {
    _id: mongoose.Types.ObjectId
    firstname: string
    lastname: string
    email: string
    password: string
    roles: UserRole[]
    approved: UserStatus
}

const UserSchema: Schema = new Schema<IUser>({
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    roles: { type: [String], enum: Object.values(UserRole), default: [UserRole.USER] },
    approved: { type: String, enum: Object.values(UserStatus), default: UserStatus.PENDING },
}, {
    timestamps: true
})

export const User = mongoose.model<IUser>('User', UserSchema)
