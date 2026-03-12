import mongoose, { Schema, model, models } from 'mongoose';

const loanSchema = new Schema(
  {
    book: { type: Schema.Types.ObjectId, ref: 'Book', required: true },
    borrowerName: { type: String, required: true },
    dateLoaned: { type: Date, default: Date.now },
    dateReturned: { type: Date },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

const Loan = models.Loan || model('Loan', loanSchema);
export default Loan;
