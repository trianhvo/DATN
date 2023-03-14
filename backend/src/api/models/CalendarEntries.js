import { Schema, model } from 'mongoose';
import timestamps  from 'mongoose-timestamp';
import BaseCalendars from './BaseCalendars'
import Colors from './Colors'


const calendarEntriesSchema = new Schema({
    CalendarId: { 
        type: Schema.Types.ObjectId, 
        ref: 'BaseCalendars',
        required: true
    },
    ColorId:{
        type: Schema.Types.ObjectId, 
        ref: Colors,
        required: true
    },
    Reminders: [{ 
        minute: String,
        eventId: String
    }],
    isPrimary: { 
        type: Boolean, 
        required: true
    },
})

calendarEntriesSchema.plugin(timestamps);

export default model('CalendarEntries', calendarEntriesSchema)