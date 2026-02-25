import mongoose, {Schema} from 'mongoose';
import {transformWithId} from '../utils/mongoose';

const userSchema = new Schema(
  {
    firstName: {type: String, required: true, minlength: 2, maxlength: 20},
    lastName: {type: String, required: true, minlength: 2, maxlength: 20},
    username: {type: String, required: true, minlength: 5, maxlength: 5},
    books: [{type: Schema.Types.ObjectId, ref: 'Book'}],
  },
  {
    versionKey: false,
    toJSON: {virtual: true, transform: transformWithId},
    toObject: {virtual: true, transform: transformWithId},
  }
);

export const User = mongoose.model('User', userSchema);
