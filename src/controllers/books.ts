import {NextFunction, Request, Response} from 'express';
import {Book} from '../models/book';
import {isValidId} from '../utils/mongoose';

const rejectInvalidBookId = (id: string | string[] | undefined, res: Response) => {
  if (!id || Array.isArray(id) || !isValidId(id)) {
    res.status(404).json({error: 'Book not found'});
    return true;
  }
  return false;
};

/**
 * Returns all books.
 * @param _req Express request.
 * @param res Express response.
 * @param next Express next function.
 * @returns Promise<void>
 */
export const getBooks = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (err) {
    next(err);
  }
};

/**
 * Creates a new book.
 * @param req Express request.
 * @param res Express response.
 * @param next Express next function.
 * @returns Promise<void>
 */
export const createBook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const book = await Book.create(req.body);
    res.status(201).json(book);
  } catch (err) {
    next(err);
  }
};

/**
 * Returns a book by id.
 * @param req Express request.
 * @param res Express response.
 * @param next Express next function.
 * @returns Promise<void>
 */
export const getBookById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (rejectInvalidBookId(req.params.id, res)) return;
    const book = await Book.findById(req.params.id);
    if (!book) {
      res.status(404).json({error: 'Book not found'});
      return;
    }
    res.json(book);
  } catch (err) {
    next(err);
  }
};

/**
 * Updates a book by id.
 * @param req Express request.
 * @param res Express response.
 * @param next Express next function.
 * @returns Promise<void>
 */
export const updateBook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (rejectInvalidBookId(req.params.id, res)) return;
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!book) {
      res.status(404).json({error: 'Book not found'});
      return;
    }
    res.json(book);
  } catch (err) {
    next(err);
  }
};

/**
 * Deletes a book by id.
 * @param req Express request.
 * @param res Express response.
 * @param next Express next function.
 * @returns Promise<void>
 */
export const deleteBook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (rejectInvalidBookId(req.params.id, res)) return;
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) {
      res.status(404).json({error: 'Book not found'});
      return;
    }
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};
