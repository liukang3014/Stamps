import React from "react";
import { useNavigate } from "react-router-dom";



const Tabbat = () => {
    const navigate = useNavigate();
    return (
        <>
            <div>Tabbat</div>
            <div>
                <button onClick={() => { navigate('/') }}>layout</button>
                <button onClick={() => { navigate('/Layout') }}>layout</button>
                <button onClick={() => { navigate('/Users') }}>users</button>
            </div>
        </>
    )
}
export default Tabbat