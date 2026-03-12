import mongoose, { Schema, model, models } from 'mongoose';

const shelfSchema = new Schema(
  {
    name: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

const Shelf = models.Shelf || model('Shelf', shelfSchema);
export default Shelf;
