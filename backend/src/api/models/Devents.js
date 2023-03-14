import { Schema, model } from 'mongoose';
import timestamps  from 'mongoose-timestamp';
import Departments from './Departments'

const deventsSchema = new Schema({
    DeventName: {
        type: String,
        required: true
    },
    DeventCode: {
        type: String,
        required: true
    },
    DepartmentId: { 
        type: Schema.Types.ObjectId, 
        ref: 'Departments',
        required: true
    },
})

deventsSchema.plugin(timestamps);

export default model('Devents', deventsSchema)