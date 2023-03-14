import { Schema, model } from 'mongoose';
import timestamps  from 'mongoose-timestamp';

const colorsSchema = new Schema({
    CalendarMain: {
        type: String,
        required: true
    },
    CalendarSecondary: {
        type: String,
        required: true
    },
    EventMain: {
        type: String,
        required: true
    },
    EventSecondary: {
        type: String,
        required: true
    },
})
colorsSchema.plugin(timestamps);

export default model('Colors', colorsSchema)