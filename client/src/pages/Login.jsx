import { useEffect, useState } from "react";

export default function Login() {

    const [email, setEmail] = useState('');
    // const [password, setPassword] = useState('');
    // Error state can be added here if error handling is needed
    const [submitting, setSubmitting] = useState(false);

    const onSetEmail = (e) => {
        setEmail(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitting(true);
    };

    useEffect(() => {
        if (submitting) {
            alert (`Form Submitted: ${email}`);
            setSubmitting(false);
            setEmail('');
        }
    }, [submitting, email]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-primaryBg px-4">
            <div className="w-full max-w-md bg-[#041524] backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-gray-900">
                <img
                    src="./src/assets/my duka logo-01.svg" 
                    alt="Logo"
                    className="mx-auto mb-4 w-20 h-20"
                />
                <p className="text-gray-200 text-sm"> Welcome To</p>
                <h1 className="text-2xl font-bold text-white">MY DUKA</h1>
                <p className="text-gray-300 text-sm">
                    Sign in to manage your inventory and track your business
                </p>

                <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-gray-200 mb-1">Enter Email: </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={onSetEmail}
                            className="w-full px-3 py-2 rounded border border-gray-700 bg-[#0a223a] text-white"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={submitting}
                        className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                    >
                        Submit
                    </button>
                </form>
            </div>
        </div>
    );

}

