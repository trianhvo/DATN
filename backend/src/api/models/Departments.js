import { Schema, model } from 'mongoose';
import timestamps  from 'mongoose-timestamp';
import Devents from './Devents'
import Users from './Users'

const departmentsSchema = new Schema({
    DepartmentName: {
        type: String,
        required: true
    },
    DepartmentDescription: {
        type: String,
        required: true
    }
})
departmentsSchema.pre('remove', { document: true, query: false },async function(){
    await Devents.updateMany({DepartmentId: this._id}, {DepartmentId: '60d363069aaf354c62b5d2ed' }, { multi: true });
    await Users.updateMany({DepartmentId: this._id}, {DepartmentId: '60d363069aaf354c62b5d2ed' }, { multi: true });
});
departmentsSchema.plugin(timestamps);
export default model('Departments', departmentsSchema)