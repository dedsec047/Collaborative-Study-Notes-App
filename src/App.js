import './App.scss';
import Router from './Pages/Routes';
import ScreenLoader from './components/ScreenLoader';
import { useAuthContext } from './contexts/AuthContext';
import "bootstrap/dist/js/bootstrap.bundle";



function App() {

const {isAppLoading } = useAuthContext()

  return (
    isAppLoading
    ?<ScreenLoader / >
    : <Router />
  );
}

export default App;
