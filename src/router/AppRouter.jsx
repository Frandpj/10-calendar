import { Navigate, Route, Routes } from "react-router-dom"
import { LoginPage } from "../auth";
import { CalendarPage } from "../calendar";

export const AppRouter = () => {

    const authStatus = 'autenthicated';

    return (
        <Routes>
            {
                (authStatus === 'not-autenthicated')
                ? <Route path="/auth/*" element={ <LoginPage /> } />
                : <Route path="/*" element={ <CalendarPage /> } />
            }
            <Route path="/*" element={ <Navigate to="/auth/login" /> } />
        </Routes>
    )
}
