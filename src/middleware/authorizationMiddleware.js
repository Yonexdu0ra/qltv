


const ROLE = {
    "Admin": "Admin",
    "Librarian": "Librarian",
    "User": "User"
}


const requiredRoleAdmin = (req, res, next) => {
     if (req.user.role !== ROLE.Admin) {
        return res.status(403).redirect('/forbidden');
    }
    next();
};


const requiredRoleLibrarianAndAdmin = (req, res, next) => {
    if (req.user.role !== ROLE.Librarian && req.user.role !== ROLE.Admin) {
        return res.status(403).redirect('/forbidden');
    }
    next();
};



module.exports = {
    requiredRoleAdmin,
    requiredRoleLibrarianAndAdmin
};