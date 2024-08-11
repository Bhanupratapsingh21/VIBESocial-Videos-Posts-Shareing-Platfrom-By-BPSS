class ApiResponse {
    constructor(statusCode, data , message = "Success"){
        this.statusCode = statusCode
        this.data = data
        this.message = message
        this.success = statusCode < 400
        // read about stats code on docs yh kisse kise k hai or useage's
    }
}
export { ApiResponse }