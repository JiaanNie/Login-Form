import Register from "./components/Register";
import SignIn from "./components/SignIn";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Unauthorized from "./components/Unauthorized";
import Editor from "./components/Editor";
import Admin from "./components/Admin";
import Home from "./components/Home";
import LinkPage from "./components/LinkPage";
import Lounge from "./components/Lounge";
import Missing from "./components/Missing";
import RequireAuth from "./components/RequireAuth";
import PersistenceLogin from "./components/PersistenceLogin";
function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* public routes */}
        <Route path="login" element={<SignIn />} />
        <Route path="register" element={<Register />} />
        <Route path="linkpage" element={<LinkPage />} />
        <Route path="unauthorized" element={<Unauthorized />} />

        {/* protected routes */}
        <Route element={<PersistenceLogin />}>
          <Route element={<RequireAuth allowRoles={[2000]} />}>
            <Route path="/" element={<Home />} />
          </Route>
          <Route element={<RequireAuth allowRoles={[4000]} />}>
            <Route path="admin" element={<Admin />} />
          </Route>
          <Route element={<RequireAuth allowRoles={[3000]} />}>
            <Route path="editor" element={<Editor />} />
          </Route>
          <Route element={<RequireAuth allowRoles={[4000, 3000]} />}>
            <Route path="lounge" element={<Lounge />} />
          </Route>
        </Route>

        {/* catch all */}
        <Route path="*" element={<Missing />} />
      </Route>
    </Routes>
  );
}

export default App;
