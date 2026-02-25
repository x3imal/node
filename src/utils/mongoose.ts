import mongoose from 'mongoose';

/**
 * Adds `id` field and removes `_id` for cleaner API responses.
 * @param _doc Mongoose document (unused).
 * @param ret Plain object to be transformed.
 * @returns Transformed object.
 */
export const transformWithId = (_doc: unknown, ret: Record<string, unknown>) => {
  if (ret._id) {
    ret.id = String(ret._id);
    delete ret._id;
  }
  return ret;
};

/**
 * Checks whether a string is a valid MongoDB ObjectId.
 * @param id Candidate id.
 * @returns True if id is valid.
 */
export const isValidId = (id: string) => mongoose.isValidObjectId(id);
