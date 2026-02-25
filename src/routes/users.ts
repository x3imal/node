import {Router} from 'express';
import {
  borrowBook,
  createUser,
  deleteUser,
  getUserBooks,
  getUserById,
  getUsers,
  returnBook,
  updateUser,
} from '../controllers/users';

export const usersRouter = Router();

usersRouter.get('/', getUsers);
usersRouter.post('/', createUser);
usersRouter.get('/:id', getUserById);
usersRouter.patch('/:id', updateUser);
usersRouter.delete('/:id', deleteUser);
usersRouter.get('/:id/books', getUserBooks);
usersRouter.post('/:id/books', borrowBook);
usersRouter.delete('/:id/books/:bookId', returnBook);
