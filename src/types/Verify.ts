export interface IVerify{
    createdAt: Date;
    rentalDate: Date;
}

export interface IVerifyResponse{
    verifyHour: boolean,
    verifyDate: boolean,
    verifyMark: boolean
}