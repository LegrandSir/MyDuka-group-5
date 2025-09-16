import { useEffect, useState } from "react";
import React from "react";  

export default function Login() {

    const [email, setEmail] = useState('');
    // const [password, setPassword] = useState('');
    // const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const onSetEmail = (e) => {
        setEmail(e.target.value);
    }
    useEffect(() => {
        if (submitting) {
            alert (`Form Submitted: ${email}`)
            setSubmitting(false)
            setEmail('');
        }
    }, [submitting, email])    

    return (
        <div>
            <p>Welcome To</p>
            <h2>My Duka</h2>
            <p>Sign in to manage your inventory and track your business</p>

            <form onSubmit={(e) => {
                e.preventDefault();
                setSubmitting(true);
            }}>
                <div>
                    <label htmlFor="email">Email: </label>
                    <input value={email} onChange={onSetEmail}/> 
                    <button type="button" disabled={submitting}>Submit</button>
                </div>
            </form>
        </div>
    )

}

