import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { ConfigProvider } from 'antd';
import './index.css'
import { Provider } from 'react-redux'
import {store} from './redux/store.ts'
createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
      <ConfigProvider theme={{
        components: {
          Button: {
            colorPrimary: '#40513B',
            colorPrimaryHover: '#40513B',
            borderRadius: 0
          }
        },
        token: {
          borderRadius: 2,
          colorPrimary: '#40513B'
        }
      }}>
        <App />
      </ConfigProvider>
      </Provider>,
)
