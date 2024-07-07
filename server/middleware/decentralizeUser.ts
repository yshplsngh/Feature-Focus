import {NextFunction,Request,Response} from "express";
import {reIssueAccessToken, validateToken} from "../utils/jwtUtils";
import {accessTokenCookieOptions} from "../routes/auth";

export const deserializeUser = async (req:Request,res:Response,next:NextFunction)=>{
    const accessToken = req.cookies?.accessToken || req.headers?.authorization
    const refreshToken = req.cookies?.refreshToken

    // console.log(accessToken);
    // console.log(req.headers);

    if(!accessToken){
        // console.error("Access token is missing");
        return next();
    }

    const {decoded,expired} = await validateToken(accessToken);
    if(!expired && decoded){
        // console.log(16)
        // console.log(decoded)
        res.locals.user = decoded
        return next();
    }
    if(expired && refreshToken){
        // console.log('access token is expired 22');
        // console.log('issuing token by refresh token');
        const newAccessToken = await reIssueAccessToken(refreshToken);
        if(newAccessToken){
            res.cookie("accessToken", newAccessToken,accessTokenCookieOptions);
        }else{
            // console.log('new access token not created');
            return next()
        }

        const {decoded} = await validateToken(newAccessToken);
        // console.log(35)
        // console.log(result);
        res.locals.user = decoded;
        return next();
    }
    return next();
}