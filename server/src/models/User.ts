import { Schema, model, Document } from 'mongoose';
import bcrypt from 'bcrypt';
import { bookSchema, BookDocument } from './Book.js'; // Import BookDocument properly


export interface UserDocument extends Document {
  _id: string;
  username: string;
  email: string;
  password: string;
  savedBooks: BookDocument[]; // Updated to use BookDocument[] instead of typeof bookSchema
  isCorrectPassword(password: string): Promise<boolean>;
  bookCount: number;
}

const userSchema = new Schema<UserDocument>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/.+@.+\..+/, 'Must use a valid email address'],
    },
    password: {
      type: String,
      required: true,
    },
    /*savedBooks: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Book', // Reference to the 'Book' model
      },
    ],*/
    savedBooks: [bookSchema]
  },
  {
    toJSON: {
      virtuals: true,
    },
  }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (this.isNew || this.isModified('password')) {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
  }
  next();
});

// Compare provided password with the hashed password in the DB
userSchema.methods.isCorrectPassword = async function (password: string) {
  return await bcrypt.compare(password, this.password);
};

// Virtual field to count the number of books in savedBooks
userSchema.virtual('bookCount').get(function () {
  return this.savedBooks.length;
});

const User = model<UserDocument>('User', userSchema);

export default User;