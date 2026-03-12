import mongoose, { Schema, model, models } from 'mongoose';

const bookSchema = new Schema(
  {
    title: { type: String, required: true },
    author: { type: String, required: true },
    totalPages: { type: Number, required: true },
    status: {
      type: String,
      enum: ['Unread', 'Reading', 'Read'],
      default: 'Unread',
    },
    coverImageUrl: { type: String },
    currentPage: { type: Number, default: 0 },
    shelves: [{ type: Schema.Types.ObjectId, ref: 'Shelf' }],
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    loanedTo: { type: String },
    loanDate: { type: Date },
  },
  { timestamps: true }
);

const Book = models.Book || model('Book', bookSchema);
export default Book;
