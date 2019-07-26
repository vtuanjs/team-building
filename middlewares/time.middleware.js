const isTimeEndEdited = (min, document) => {
    return ((Date.now() - document.createdOn)/1000 < (min * 60) )
}

module.exports = {
    isTimeEndEdited
}