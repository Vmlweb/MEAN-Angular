//Modules
import { Schema, Document, model } from 'mongoose'

//Schema
export const UserSchema = new Schema({
	username: String,
	email: String
},{
	timestamps: true	
})

//Typings
export interface IUser extends Document {
	id: string
	username: string
	email: string
}

//Model
export const User = model<IUser>('user', UserSchema)