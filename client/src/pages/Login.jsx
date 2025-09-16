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
        <div className="min-h-screen flex items-center justify-center bg-primaryBg px-4">
            <div className="w-full max-w-md bg-[#041524] backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-gray-900"></div>
            <p className="text-gray-200 text-sm"> Welcome To</p>
            <h1 className="text-2xl font-bold text-white">MY DUKA</h1>
            <p className="text-gray-300 text-sm">
            Sign in to manage your inventory and track your business
          </p>

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

