import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import '../styles/global.css';
import Chatprovider from '../../utils/chat';
function MyApp({ Component, pageProps }) {
  return (
    <Chatprovider>
      <Component {...pageProps} />
    </Chatprovider>
  );
}

export default MyApp;
