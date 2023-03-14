import { Schema, model } from 'mongoose';
import timestamps from 'mongoose-timestamp';
import Users from './Users'
import AccessRules from './AccessRules'
import Events from './Events'
import CalendarEntries from './CalendarEntries'

const baseCalendarsSchema = new Schema({
    Owner: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    CalendarTitle: {
        type: String,
        required: true,
        text: true
    },
    CalendarDescription: {
        type: String,
        required: true
    },
    isHidden: { 
        type: Boolean, 
        required: true
    },
    AccessRuleId:{
        type: Schema.Types.ObjectId, 
        ref: AccessRules,
        required: true
    },
    Events: [{ type: Schema.Types.ObjectId, ref: Events }],
})

baseCalendarsSchema.plugin(timestamps);
baseCalendarsSchema.pre('remove', { document: true, query: false },async function(){
    await CalendarEntries.deleteMany({ CalendarId: this._id });
    await Events.updateMany({ BaseCalendarId: this._id }, { BaseCalendarId: '60d4a81894ab933a3fd21a1d' }, { multi: true });
});
baseCalendarsSchema.pre('save', { document: true, query: false },async function(){
    if (this.isHidden == true){

        let result = await CalendarEntries.find({ CalendarId: this._id }).sort('createdAt').distinct('_id')
        .populate('CalendarId')
        result.shift()
        if (result.length>0){
            await CalendarEntries.deleteMany({ _id: {'$in': result} });
        }
    }
});
baseCalendarsSchema.index({'CalendarTitle': 'text'});

export default model('BaseCalendars', baseCalendarsSchema)

