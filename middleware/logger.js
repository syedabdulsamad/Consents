const log = function log(req, res, next) {
    console.log(` ${req.method} => called for path: ${req.path}`);
    next();
}
export {
    log
}