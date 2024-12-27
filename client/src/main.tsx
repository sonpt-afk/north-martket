import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { ConfigProvider } from 'antd';
import './index.css'
createRoot(document.getElementById('root')!).render(
  <StrictMode>
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
  </StrictMode>
)
