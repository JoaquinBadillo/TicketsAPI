// Middleware to block access to routes based on user role
const hasRole = (roles) => (req, res, next) => {
    if (!roles.has(req.userRole))
        return res.status(403).send({ message: "Forbidden" });
    
    next();
}

const adminRole = new Set(["admin"]);

module.exports = {
    hasRole,
    adminRole
};