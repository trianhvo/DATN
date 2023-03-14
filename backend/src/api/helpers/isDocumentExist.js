export default async function(Model,id){
    let data = await Model.findOne({ _id: id})
    return data
}