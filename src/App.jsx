import "./App.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./router.jsx";
import { Container } from "./components/Container.jsx";

function App () {
  return (
    <Container>
      <RouterProvider router={router}/>
    </Container>
  );
}

export default App;
