const mongoose = require('mongoose');
const { Schema } = mongoose;

const { MeritOperationEnum } = require('../util/enums/merit-enums');

const MeritSchema = new Schema({
  pledgeName: {
    type: String,
    required: true,
  },
  issuerName: {
    type: String,
    required: true,
  },
  pledgeID: { type: Schema.Types.ObjectId, ref: 'Brothers' },
  issuerID: { type: Schema.Types.ObjectId, ref: 'Brothers' },
  operation: {
    type: String,
    required: true,
    enum: Object.values(MeritOperationEnum),
  },
  description: {
    type: String,
    required: true,
  },
  isDispatched: {
    type: Boolean,
    default: false,
    required: false,
  },
});

module.exports = mongoose.model('Merits', MeritSchema);