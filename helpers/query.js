const queryHelpers = {
    findByName = async (model, input) => {
        await model.find({
            name: {
                $regex: input,
                $options: 'i'
            }
        })
    },

}

module.exports = queryHelpers