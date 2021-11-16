import './App.css';
import { RealDigitalForm } from './features/real-digital-form/RealDigitalForm';
import { RealDigitalTextfield } from './features/real-digital-form/real-digital-textfield/RealDigitalTextfield';
import RealDigitalButton from './features/real-digital-form/real-digital-button/RealDigitalButton';

function App() {
  return (
    <div className="App">
      <RealDigitalForm action="https://httpbin.org/post" method="post">
        <RealDigitalTextfield name="name" validation="[a-z]+" />
        <RealDigitalTextfield name="phone" validation="[0-9]+" />
        <RealDigitalTextfield name="subject" />
        <RealDigitalButton>Send</RealDigitalButton>
      </RealDigitalForm>
    </div>
  );
}

export default App;
