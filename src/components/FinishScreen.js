function FinishScreen({ points, sumPoints, highestScore, dispatch }) {
  const percentage = (points / sumPoints) * 100
  return (
    <>
      <p className='result'>
        You scored {points} out of {sumPoints} ({percentage.toFixed(2)}%)
      </p>
      <p className='highscore'>(Highscore: {highestScore} points)</p>
      <button class='btn btn-ui' onClick={() => dispatch({ type: 'restart' })}>
        Restart quiz
      </button>
    </>
  )
}

export default FinishScreen
