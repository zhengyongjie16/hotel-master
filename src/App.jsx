import Router from './routers';
import { BrowserRouter } from 'react-router-dom'
import store ,{ persistor} from './store'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'


function App() {
  return (    
    <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter>
          <Router />
      </BrowserRouter>
    </PersistGate>
  </Provider>
  )
}

export default App
