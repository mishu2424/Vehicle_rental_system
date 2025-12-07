import dotenv from 'dotenv'
import path from "path";

dotenv.config({path:path.join(process.cwd(),'.env')});

const config={
    port:process.env.port,
    connectionString:process.env.connectionString,
    jwt_secret:process.env.JWT_SECRET
}

export default config;