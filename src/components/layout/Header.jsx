import './Header.scss'
export default (props)=>{

    return (
        <div className="header">
            <div className='title'> { props.title } </div>
            <>
                { props.children }
            </>
        </div>
    )
}//