class APIError extends Error{
    constructor(statusCode,message="Something Went Wrong",error=[],stack=""){
        super();
        this.statusCode = statusCode;
        this.message = message;
        this.error = error;
        this.success = false;
        if(stack){
            this.stack=stack
        }else{
            Error.captureStackTrace(this,this.constructor)
        }

    }
}

export default APIError;