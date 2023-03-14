import { Schema, model } from 'mongoose';
import timestamps from 'mongoose-timestamp';
import Departments from './Departments';
import Events from './Events';
import BaseCalendars from './BaseCalendars';
import Role from './Roles'

const userSchema = new Schema({
    Name: {
        type: String,
        required: true,
        min: 6,
        max: 25,
    },
    Email: {
        type: String,
        required: true,
        min: 6,
        max: 25
    },
    Password: {
        type: String,
        required: true,
        min: 6,
        max: 1024
    },
    Role: {
        type: Schema.Types.ObjectId,
        ref: Role
    },
    Department: {
        type: Schema.Types.ObjectId,
        ref: 'Departments'
    },
    CalendarLists: [{ type: Schema.Types.ObjectId, ref: 'CalendarEntries' }]
})
userSchema.plugin(timestamps);
userSchema.pre('remove', { document: true, query: false }, async function () {
    await BaseCalendars.updateMany({ Owner: this._id }, { Owner: '60d4a81894ab933a3fd21a1c' }, { multi: true });
    await Events.updateMany({ Owner: this._id }, { Owner: '60d4a81894ab933a3fd21a1c' }, { multi: true });
});
userSchema.index({ 'Email': 'text' });

export default model('User', userSchema)