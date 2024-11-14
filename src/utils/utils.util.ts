import { decodeToken } from "react-jwt";
import { DecodedToken } from "../types/IToken";

export const getUserId = (): number | null => {
    const token = localStorage.getItem("authToken");
    if (token) {
        const decodedToken = decodeToken<DecodedToken>(token);
        return decodedToken ? decodedToken.sub : null;
    }
    return null;
};