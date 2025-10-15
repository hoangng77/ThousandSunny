import { useState } from 'react';

export default function Login()
 {
    const [status, setStatus] = useState('typing');
    const [error, setError] = useState(null);
    const [input, setInput] = useState({
        email: '',
        password: ''
    })

    function handleTextAreaChange(e) {
        setInput({
            ...input,
            [e.target.name]: e.target.value
            }
        );
    }


    async function handleSubmit(e) {
        e.preventDefault();
        setStatus('submitting');
        try {
            await loginToAccount(input);
            setStatus('success');
        } catch (err) {
            setStatus('typing');
            setError(err);
        }
    }

    if (status === "success") {
        return <h1>Login successful :D</h1>
    }

    return (
        <>
            <h1>Login</h1>
            <form>
                <label>
                    Email Address: 
                    <input name="email"
                        onChange={handleTextAreaChange}>
                    </input>
                </label>
                <br></br>
                <label>
                    Password:
                    <input name="password"
                        onChange={handleTextAreaChange}>
                    </input>
                </label>
                <br></br>
                <button onClick={handleSubmit}>Login</button>
                {error !== null &&
                    <p className='Error'>
                        {error.message}
                    </p>
                }
            </form>
        </>
    );
}

function loginToAccount(input) {
    return new Promise((resolve, reject) => {
        fetch("http://localhost:5000/auth/login", { method: "POST", body: JSON.stringify(input), headers: { "Content-Type": "application/json" }})
        .then(async (response) => {
            const data = await response.json();
            if (response.ok) {
                resolve(data);
            }
            reject(new Error(data.message));
        })
        .catch((err) => {
            reject(new Error("Network error"));
        });
    });
}