import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SearchBus from "./pages/SearchBus";
import SelectStart from "./pages/SelectStart";
import SelectDestination from "./pages/SelectDestination";
import ViewMap from "./pages/ViewMap";

//App() component is the root component(App() 컴포넌트는 프로젝트의 최상위 컴포넌트로, 모든 페이지와 UI를 포함한다.)
function App() {
  return (
    <div className="app-container">
      <Router>
        <Routes>
          <Route path="/" element={<SearchBus />} />
          <Route path="/start" element={<SelectStart />} />
          <Route path="/destination" element={<SelectDestination />} />
          <Route path="/map" element={<ViewMap />} />
        </Routes>
      </Router>
    </div>
  );
}


export default App;
