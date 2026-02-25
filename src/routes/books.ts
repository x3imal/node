import {Router} from 'express';
import {createBook, deleteBook, getBookById, getBooks, updateBook} from '../controllers/books';

export const booksRouter = Router();

booksRouter.get('/', getBooks);
booksRouter.post('/', createBook);
booksRouter.get('/:id', getBookById);
booksRouter.patch('/:id', updateBook);
booksRouter.delete('/:id', deleteBook);
