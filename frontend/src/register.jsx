import { useState } from 'react';

export default function Register()
 {
    const [status, setStatus] = useState('typing');
    const [error, setError] = useState(null);
    const [input, setInput] = useState({
        username: '',
        email: '',
        password: '',
        role: ''
    })

    function handleTextAreaChange(e) {
        setInput({
            ...input,
            [e.target.name]: e.target.value
            }
        );
    }

    function handleRoleChange(e) {
        setInput({...input, role: e.target.value});
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setStatus('submitting');
        try {
            await submitRegistration(input);
            setStatus('success');
        } catch (err) {
            setStatus('typing');
            setError(err);
        }
    }

    if (status === "success") {
        return <h1>Registration successful :)</h1>
    }

    return (
        <>
            <h1>Registration</h1>
            <form>
                <label>
                    Username: 
                    <input name="username"
                        onChange={handleTextAreaChange}>
                    </input>
                </label>
                <br></br>
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
                <p>
                    <label>
                        <input type="radio" name="role" value="artist" onChange={handleRoleChange}/>
                        Artist
                    </label>
                    <label>
                        <input type="radio" name="role" value="reader" onChange={handleRoleChange}/>
                        Reader
                    </label>
                </p>
                <br></br>
                <button onClick={handleSubmit}>Submit</button>
                {error !== null &&
                    <p className='Error'>
                        {error.message}
                    </p>
                }
            </form>
        </>
    );
}

function submitRegistration(input) {
    return new Promise((resolve, reject) => {
        fetch("http://localhost:5000/auth/register", { method: "POST", body: JSON.stringify(input), headers: { "Content-Type": "application/json" }})
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