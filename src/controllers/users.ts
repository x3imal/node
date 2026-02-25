import {NextFunction, Request, Response} from 'express';
import {Book} from '../models/book';
import {User} from '../models/user';
import {isValidId} from '../utils/mongoose';

const rejectInvalidUserId = (id: string | string[] | undefined, res: Response) => {
  if (!id || Array.isArray(id) || !isValidId(id)) {
    res.status(404).json({error: 'User not found'});
    return true;
  }
  return false;
};

/**
 * Returns all users.
 * @param _req Express request.
 * @param res Express response.
 * @param next Express next function.
 * @returns Promise<void>
 */
export const getUsers = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    next(err);
  }
};

/**
 * Creates a new user.
 * @param req Express request.
 * @param res Express response.
 * @param next Express next function.
 * @returns Promise<void>
 */
export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
};

/**
 * Returns a user by id.
 * @param req Express request.
 * @param res Express response.
 * @param next Express next function.
 * @returns Promise<void>
 */
export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (rejectInvalidUserId(req.params.id, res)) return;
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404).json({error: 'User not found'});
      return;
    }
    res.json(user);
  } catch (err) {
    next(err);
  }
};

/**
 * Updates a user by id.
 * @param req Express request.
 * @param res Express response.
 * @param next Express next function.
 * @returns Promise<void>
 */
export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (rejectInvalidUserId(req.params.id, res)) return;
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!user) {
      res.status(404).json({error: 'User not found'});
      return;
    }
    res.json(user);
  } catch (err) {
    next(err);
  }
};

/**
 * Deletes a user by id.
 * @param req Express request.
 * @param res Express response.
 * @param next Express next function.
 * @returns Promise<void>
 */
export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (rejectInvalidUserId(req.params.id, res)) return;
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      res.status(404).json({error: 'User not found'});
      return;
    }
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};

/**
 * Returns all books borrowed by a user.
 * @param req Express request.
 * @param res Express response.
 * @param next Express next function.
 * @returns Promise<void>
 */
export const getUserBooks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (rejectInvalidUserId(req.params.id, res)) return;
    const user = await User.findById(req.params.id).populate('books');
    if (!user) {
      res.status(404).json({error: 'User not found'});
      return;
    }
    res.json(user.books ?? []);
  } catch (err) {
    next(err);
  }
};

/**
 * Attaches a book to a user (borrow).
 * @param req Express request.
 * @param res Express response.
 * @param next Express next function.
 * @returns Promise<void>
 */
export const borrowBook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (rejectInvalidUserId(req.params.id, res)) return;
    const {book_id: bookId} = req.body as {book_id?: string};
    if (!bookId || !isValidId(bookId)) {
      res.status(404).json({error: 'Book not found'});
      return;
    }
    const [user, book] = await Promise.all([User.findById(req.params.id), Book.findById(bookId)]);
    if (!user) {
      res.status(404).json({error: 'User not found'});
      return;
    }
    if (!book) {
      res.status(404).json({error: 'Book not found'});
      return;
    }
    const alreadyBorrowed = user.books?.some((item) => String(item) === String(book._id));
    if (!alreadyBorrowed) {
      user.books.push(book._id);
      await user.save();
    }
    res.json(user);
  } catch (err) {
    next(err);
  }
};

/**
 * Removes a book from a user (return).
 * @param req Express request.
 * @param res Express response.
 * @param next Express next function.
 * @returns Promise<void>
 */
export const returnBook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (rejectInvalidUserId(req.params.id, res)) return;
    const {bookId} = req.params;
    if (!bookId || Array.isArray(bookId) || !isValidId(bookId)) {
      res.status(404).json({error: 'Book not found'});
      return;
    }
    const [user, book] = await Promise.all([User.findById(req.params.id), Book.findById(bookId)]);
    if (!user) {
      res.status(404).json({error: 'User not found'});
      return;
    }
    if (!book) {
      res.status(404).json({error: 'Book not found'});
      return;
    }
    user.books = user.books?.filter((item) => String(item) !== String(book._id)) ?? [];
    await user.save();
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};
