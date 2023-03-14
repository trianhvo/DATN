import { Schema, model } from 'mongoose';
import timestamps  from 'mongoose-timestamp';

const rolesSchema = new Schema({
    RoleName: {
        type: String,
        required: true
    }
})
rolesSchema.plugin(timestamps);

export default model('Roles', rolesSchema)