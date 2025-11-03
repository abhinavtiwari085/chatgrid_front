import mongoose from 'mongoose';

const inviteSchema = new mongoose.Schema(
  {
    workspaceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Workspace',
      required: true
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending'
    },
    inviteType: {
      type: String,
      enum: ['dm', 'workspace'],
      default: 'dm'
    }
  },
  { timestamps: true }
);

const Invite = mongoose.model('Invite', inviteSchema);

export default Invite;
