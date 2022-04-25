import jwt_decode from 'jwt-decode';

interface lowHighObj {
    low: number, 
    high: number
}

interface JwtUserData {
    sub: lowHighObj, 
    exp: number,
    iat: number
}

const decodeJWTToken = (): JwtUserData => {
    const token:string = <string>localStorage.getItem("id_token");
    const tokenWithoutBearer:string = token.replace('Bearer ', '');
    const decodedJWT:JwtUserData = jwt_decode(tokenWithoutBearer);

    return decodedJWT;
}

export {decodeJWTToken};