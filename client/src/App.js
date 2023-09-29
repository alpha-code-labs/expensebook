import {
  Routes,
  Route,
  useNavigationType,
  useLocation,
} from "react-router-dom";
import { useEffect } from "react";
import Login from "./pages/login.js";
import CompanyDetails from "./pages/companyDetails.js";
import Multicurrency from "./pages/multicurrency.js";
import Group from "./pages/groupsSetting.js";
import YourGroups from "./components/YourGroups.js";
import GroupCheck from "./components/groupSetting/groupCheck.js";


function App() {
  const action = useNavigationType();
  const location = useLocation();
  const pathname = location.pathname;

  useEffect(() => {
    if (action !== "POP") {
      window.scrollTo(0, 0);
    }
  }, [action, pathname]);

  useEffect(() => {
    let title = "";
    let metaDescription = "";

    switch (pathname) {
      case "/":
        title = "";
        metaDescription = "";
        break;
    }

    if (title) {
      document.title = title;
    }

    if (metaDescription) {
      const metaDescriptionTag = document.querySelector(
        'head > meta[name="description"]'
      );
      if (metaDescriptionTag) {
        metaDescriptionTag.content = metaDescription;
      }
    }
  }, [pathname]);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/companyInfo" element={<CompanyDetails />} />
      <Route path="/multicurrency" element={<Multicurrency/>} />
      <Route path="/groups" element={<Group/>} />
      <Route path="/yourgroups" element={<YourGroups/>} />
      <Route path="/groupcheck" element={<GroupCheck/>} />
    </Routes>
  )
}
export default App;
