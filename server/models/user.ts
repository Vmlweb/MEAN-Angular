//Modules
import { Schema, Document, model } from 'mongoose'

//Schema
export const UserSchema = new Schema({
	username: String,
	email: String
});

//Typings
export interface IUser extends Document {
	id: Schema.Types.ObjectId,
	username: string,
	email: string
}

//Model
export const User = model<IUser>('Users', UserSchema)