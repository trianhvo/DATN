import { Schema, model } from 'mongoose';
import timestamps  from 'mongoose-timestamp';

const accessSchema = new Schema({
    AccessName: {
        type: String,
        required: true
    }
})

accessSchema.plugin(timestamps);
export default model('AccessRules', accessSchema)