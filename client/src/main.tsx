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
            algorithm: true,
            borderRadius: 0,
            defaultBorderColor: '#d9d9d9',
            defaultColor: 'rgba(0, 0, 0, 0.88)',
            defaultBg: '#ffffff'
          }
        },
        token: {
          borderRadius: 2,
          colorPrimary: '#40513B',
          colorText: 'rgba(0, 0, 0, 0.88)',
          colorTextSecondary: 'rgba(0, 0, 0, 0.65)',
          colorBorder: '#d9d9d9'
        }
      }}>
        <App />
      </ConfigProvider>
      </Provider>,
)
