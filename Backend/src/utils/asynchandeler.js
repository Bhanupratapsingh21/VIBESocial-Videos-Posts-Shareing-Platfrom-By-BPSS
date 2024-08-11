// const asynchandeler = ()=>{}



/*
 const asynchandeler = () => {}
 const asynchandeler = (fn) => () => {}
 const asynchandeler = (fn) => async() => {}
 */

// 1st method to do wtih try catch or2nd is promisses .then

/*
const asynchandeler = (fn) => async(req , res , next) => {
    try {

        await fn(req,res,next)

    } catch (error) {
        res.status(err.code || 500).json({
            success : false,
            massage : err.massage,
        })
    }
}
*/
const asyncHandeler = (requesthandler) => {
    return (req,res,next)=>{
        Promise.resolve(requesthandler(req,res,next)).
        catch((err) => next(err))
    }
}

export { asyncHandeler }