function Loading(): JSX.Element {
  /* loader spinner tailwinds */
  return (
    <div className="flex justify-center items-center">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-brandBlue-400" />
    </div>
  )
}

export default Loading
