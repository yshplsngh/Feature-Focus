import { Route, Routes } from "react-router-dom";
import Register from "./pages/Register";
import RequireAuth from "./features/RequireAuth";
import Post from "./pages/Post";
import Layout from "./component/Layout";
import Err404 from "./pages/Err404";
import { Suspense } from "react";
import Loading from "./component/Loading";
import Testing from "./component/Testing";
import Home from "./pages/Home";
import ResetPassword from "./pages/ResetPassword";
import VerifyOTP from "./pages/VerifyOTP";

function App() {
    return (
        <Suspense fallback={<Loading />}>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route path="register" element={<Register />} />
                    <Route path="verifyOTP" element={<VerifyOTP />} />
                    <Route element={<RequireAuth />}>
                        <Route path="posts" element={<Post />} />
                        <Route path="resetPassword" element={<ResetPassword />} />
                    </Route>
                    <Route path="test" element={<Testing />} />
                    <Route path="*" element={<Err404 />} />
                </Route>
            </Routes>
        </Suspense>
    );
}

export default App;
