import { Schema, model } from 'mongoose';
import { timestamps } from 'mongoose-timestamp';

const eventExceptionSchema = new Schema({
    EventId: { 
        type: Schema.Types.ObjectId, 
        ref: 'Events',
        required: true
    },
    ExceptionDate: { 
        type: String, 
        required: true
    },
    Duration: {
        type: String,
        required: true
    },
})

eventExceptionSchema.plugin(timestamps);
export default model('CalendarEntries', eventExceptionSchema)