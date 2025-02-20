class ApiResponse {
  public statusCode: number;
  public message: string;
  public data: object;
  public success: boolean;

  constructor(statusCode: number, message: string, data: object) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    this.success = statusCode < 400;
  }
}
export default ApiResponse;
