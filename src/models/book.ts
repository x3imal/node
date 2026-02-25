import mongoose, {Schema} from 'mongoose';
import {transformWithId} from '../utils/mongoose';

const bookSchema = new Schema(
  {
    title: {type: String, required: true, minlength: 2, maxlength: 20},
    author: {type: String, required: true, minlength: 2, maxlength: 20},
    year: {type: Number, required: true},
  },
  {
    versionKey: false,
    toJSON: {virtual: true, transform: transformWithId},
    toObject: {virtual: true, transform: transformWithId},
  }
);

export const Book = mongoose.model('Book', bookSchema);
