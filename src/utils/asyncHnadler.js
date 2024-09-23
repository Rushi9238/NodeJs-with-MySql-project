const asyncHandler=(requestHnadler)=>{
    return (req,res,next)=>{
        Promise.resolve(requestHnadler(req,res,next)).catch((error)=>{
            next(error)
        })
    }
}

export {asyncHandler}