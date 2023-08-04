function NextButton({ answer, index, dispatch, numQuestions }) {
  if (answer === null) return null

  if (index < numQuestions - 1) {
    return (
      <button
        className='btn btn-ui'
        onClick={() => dispatch({ type: 'nextQuestion' })}
      >
        Next
      </button>
    )
  }

  if (index === numQuestions - 1) {
    return (
      <button class='btn btn-ui' onClick={() => dispatch({ type: 'finished' })}>
        Finish
      </button>
    )
  }
}

export default NextButton
