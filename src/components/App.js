import { useEffect, useReducer, useRef } from 'react'

import Header from './Header'
import Main from './Main'
import StartScreen from './StartScreen'
import Loader from './Loader'
import Error from './Error'
import Question from './Question'
import NextButton from './NextButton'
import FinishScreen from './FinishScreen'
import Progress from './Progress'
import Footer from './Footer'
import Timer from './Timer'

const SECS_PER_QUESTION = 30

const initialState = {
  questions: [],
  status: 'loading',
  index: 0,
  answer: null,
  points: 0,
  secondsRemaining: null
}

function reducer(state, action) {
  switch (action.type) {
    case 'dataReceived':
      return { ...state, status: 'ready', questions: action.payload }
    case 'dataFailed':
      return { ...state, status: 'error' }
    case 'start':
      return {
        ...state,
        status: 'active',
        secondsRemaining: state.questions.length * SECS_PER_QUESTION
      }
    case 'newAnswer':
      const currentQuestion = state.questions.at(state.index)
      return {
        ...state,
        answer: action.payload,
        points:
          action.payload === currentQuestion.correctOption
            ? state.points + currentQuestion.points
            : state.points
      }
    case 'nextQuestion':
      return { ...state, answer: null, index: state.index + 1 }
    case 'finished':
      return { ...state, status: 'finish' }
    case 'restart':
      return { ...initialState, questions: state.questions, status: 'ready' }
    case 'tick':
      return { ...state, secondsRemaining: state.secondsRemaining - 1 }
    default:
      throw new Error('Action unknown')
  }
}

function App() {
  const [
    { questions, status, index, points, answer, secondsRemaining },
    dispatch
  ] = useReducer(reducer, initialState)
  const highestScore = useRef(0)

  const numQuestions = questions.length
  const sumPoints = questions.reduce((acc, curr) => acc + curr.points, 0)

  useEffect(function () {
    async function getQuestions() {
      try {
        const res = await fetch(`http://localhost:9000/questions`)
        const data = await res.json()
        dispatch({ type: 'dataReceived', payload: data })
      } catch (err) {
        dispatch({ type: 'dataFailed' })
      }
    }
    getQuestions()
  }, [])

  useEffect(
    function () {
      if (points > highestScore.current) highestScore.current = points
    },
    [points]
  )

  return (
    <div className='app'>
      <Header />
      <Main>
        {status === 'loading' && <Loader />}
        {status === 'error' && <Error />}
        {status === 'ready' && (
          <StartScreen numQuestions={numQuestions} dispatch={dispatch} />
        )}
        {status === 'active' && (
          <>
            <Progress
              answer={answer}
              numQuestions={numQuestions}
              index={index}
              points={points}
              sumPoints={sumPoints}
            />
            <Question
              question={questions.at(index)}
              answer={answer}
              dispatch={dispatch}
            />
            <Footer>
              <Timer secondsRemaining={secondsRemaining} dispatch={dispatch} />
              <NextButton
                answer={answer}
                index={index}
                dispatch={dispatch}
                numQuestions={numQuestions}
              />
            </Footer>
          </>
        )}
        {status === 'finish' && (
          <FinishScreen
            points={points}
            sumPoints={sumPoints}
            highestScore={highestScore.current}
            dispatch={dispatch}
          />
        )}
      </Main>
    </div>
  )
}

export default App
