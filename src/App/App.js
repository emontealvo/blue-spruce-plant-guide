import React, { useEffect, useReducer } from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import styles from './App.scss'
import Home from '../Home/Home'
import PlantIndex from '../PlantIndex/PlantIndex'
import Header from '../Header/Header'
import Quiz from '../Quiz/Quiz'
import appReducer from '../Hooks/appReducer'
import getColoradoNativePlants from '../Utils/ApiCalls'

function App() {
  const initialSate = {
    plantCatalog: [],
    imageMode: false,
    currentPlant: {}
  }

  const [state, dispatch] = useReducer(appReducer, initialSate)
  const { plantCatalog, imageMode, currentPlant } = state

  useEffect(() => {
    const getPlantInfo = async () => {
      try {
        const plantInfoRequests = await getColoradoNativePlants()
        dispatch({ type: 'getPlants', payload: plantInfoRequests })
        dispatch({ type: 'setCurrentPlant' })
      } catch (err) {
        dispatch({ type: 'error', payload: { ...err } })
      }
    }
    getPlantInfo()
  }, [])

  function chooseQuizMode(mode) {
    dispatch({ type: 'quizMode', payload: mode })
  }

  return (
    <Router>
      <Header />
      {state.plantCatalog.length
        && (
          <>
            <Route
              path="/plantIndex"
              render={() => <PlantIndex plantCatalog={plantCatalog} />}
            />
            <Route
              path="/quiz"
              render={() => (
                <Quiz
                  currentPlant={currentPlant}
                  mode={imageMode}
                />
              )}
            />
          </>
        )}
      <Route exact path="/">
        <Home chooseQuizMode={chooseQuizMode} />
      </Route>
    </Router>
  )
}

export default App
