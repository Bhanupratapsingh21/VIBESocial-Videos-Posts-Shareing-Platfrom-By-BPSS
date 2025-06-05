export default function logger(req, res, next) {
    console.log(`${req.method} ${req.path}`);
    next();
}
