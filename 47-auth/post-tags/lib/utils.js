module.exports.getPaginationData = function(req, totalRecords)
{
    const itemsPerPage = Number(req.query.limit) || 3;
    const page = Number(req.query.page) || 1;
    const totalPages = Math.ceil(totalRecords / itemsPerPage);
    const offset = itemsPerPage * (page - 1);
    return {
        itemsPerPage,
        page,
        totalPages,
        offset,
    }
}