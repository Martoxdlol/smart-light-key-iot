exports.ClientError = class ClientError extends Error{
  constructor(msg,code){
    super()
    this.code = code
    this.message = msg
  }
}
