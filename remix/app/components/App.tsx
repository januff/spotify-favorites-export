import type { LoaderFunction } from "remix";
import { useLoaderData, json } from "remix";
import { getSession, commitSession } from "../sessions";

import LoginScreen from './LoginScreen';
import styled from 'styled-components';
import { GlobalStyle } from '../styles';

const AppContainer = styled.div`
  height: 100%;
  min-height: 100vh;
`;

const App = () => {
  return (
    <AppContainer>
      <GlobalStyle />
        <LoginScreen />
    </AppContainer>
  );
};

export default App;
