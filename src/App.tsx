import { Provider } from "react-redux";
import { store } from "./store";
import { VoiceMessage } from "./VoiceMessage";
import "./App.css";

function App() {
  return (
    <Provider store={store}>
      <VoiceMessage id={0} />
      <VoiceMessage id={1} />
    </Provider>
  );
}

export default App;
