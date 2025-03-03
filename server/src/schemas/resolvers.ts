import { AuthenticationError } from 'apollo-server-errors';
import User from '../models/User.js';
import { signToken } from '../services/auth.js';
import Book from '../models/Book.js';

const resolvers = {
  Query: {
    me: async (_parent: unknown, _args: unknown, context: { user: any }) => {
      if (!context.user) {
        throw new AuthenticationError('You must be logged in!');
      }
      return User.findById(context.user._id).populate('savedBooks');
    },
  },
  Mutation: {
    login: async (_parent: unknown, { email, password }: { email: string; password: string }) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw new AuthenticationError('Incorrect credentials');
      }
      const isPasswordValid = await user.isCorrectPassword(password);
      if (!isPasswordValid) {
        throw new AuthenticationError('Incorrect credentials');
      }
      const token = signToken(user._id.toString(), user.email, user.username);
      return { token, user };
    },
    addUser: async (_parent: unknown, { username, email, password }: { username: string; email: string; password: string }) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user._id.toString(), user.email, user.username);
      return { token, user };
    },
    saveBook: async (_: any, { bookId, authors, description, title, image, link }: any, { user }: any) => {
      const loggedinUser = await User.findOne({ email: user.email });
      if (!loggedinUser) throw new Error('You need to be logged in!');

      // Create a new Book instance using the imported Book model
      const book = new Book({
        bookId,
        authors,
        description,
        title,
        image,
        link,
      });

      // Push the Book instance into the savedBooks array
      loggedinUser.savedBooks.push(book);
      await loggedinUser.save();

      return loggedinUser;
    },
    removeBook: async (_: any, { bookId }: any, { user }: any) => {
      const loggedinUser = await User.findOne({ email: user.email });
      if (!loggedinUser) throw new Error('You need to be logged in!');
      loggedinUser.savedBooks = loggedinUser.savedBooks.filter((book: any) => book.bookId !== bookId);
      await loggedinUser.save();
      return loggedinUser;
    },
  },
};

export default resolvers;

