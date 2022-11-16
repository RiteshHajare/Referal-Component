import axios from 'axios';
import React, { useEffect, useState } from 'react'

function App() {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [referer, setReferer] = useState("")
    const [arr, setArr] = useState([])
    const [sendname, setSendname] = useState("")
    const [response, setresponse] = useState({});


    useEffect(() => {
        axios.get("http://localhost:4000/getusers")
            .then((res) => {
                // console.log(res.data);
                setArr(res.data);
            })
    }, [])


    function handleClick() {
        const obj = {
            name: name,
            email: email,
            referer: referer,
            isPaymentMade: "false",
            totalEarnings: 0
        }
        setArr((prev) => {
            return [...prev, obj]
        })

        if (name === "" || email === "") return;
        axios.post("http://localhost:4000/postuser", { name, email, referer })
    }

    function mapArr(user) {
        return (
            <div className="user card">
                <p>name : {user.name} </p>
                <p>email : {user.email} </p>
                <p>referer : {user.referer ? user.referer : "NULL"} </p>
                {user.isPaymentMade === "true" ? <p>isPaymentMade : true </p> : <p>isPaymentMade : false </p>}
                <p>totalEarnings : {user.totalEarnings} </p>
            </div>
        )
    }

    function handleClk() {
        if (arr.length < 2) {
            alert("Fill Users first.");
            return;
        }


        const check = arr.filter((user) => {
            return user.name === sendname;
        })
        if (check.length === 0) {
            alert("User not in DB.");
            return;
        }
        const id = check[0]._id;
        axios.post("http://localhost:4000/mkchange", { id })
            .then((res) => {

                setresponse(res.data);
            })


    }

    return (
        <div className="whole">
            <div className='body'>
                <input type="text" onChange={(e) => { setSendname(e.target.value) }} value={sendname} className="form-control" placeholder="Your name" />
                <button onClick={handleClk} type="button" className="pay btn btn-success">Send your id to backend</button>
                {response.referer && <div className="message"> <p>referer : {response.referer}&nbsp;&nbsp; referedto : {response.referedto} </p> </div>}
                {response.message && <div className="message"> <p> message : {response.message} </p> </div>}
                <div className="form">
                    <input type="text" onChange={(e) => { setName(e.target.value) }} value={name} className="form-control" placeholder="Enter name" />
                    <input type="email" onChange={(e) => { setEmail(e.target.value) }} value={email} className="form-control" placeholder="Enter email" />
                    <input type="text" onChange={(e) => { setReferer(e.target.value) }} value={referer} className="form-control" placeholder="referer name" />
                    <button onClick={handleClick} type='button' className='btn btn-large btn-primary'>Submit</button>
                </div>
                {arr.map(mapArr)}
            </div>
        </div>
    )
}

export default App