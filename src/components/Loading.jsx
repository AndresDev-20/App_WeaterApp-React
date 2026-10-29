import "./loa.css"

const Loading = () => {
  return (
    <div className='lo' role="status">
      <div className='lo__scene'>
        <div className='lo__sun' />
        <div className='lo__cloud' />
        <span className='lo__drop' />
        <span className='lo__drop' />
        <span className='lo__drop' />
      </div>
      <h1 className='lo__title'>Weather App</h1>
      <p className='lo__text'>
        Buscando el clima de tu ubicación
        <span className='lo__dots'><i>.</i><i>.</i><i>.</i></span>
      </p>
    </div>
  )
}

export default Loading
