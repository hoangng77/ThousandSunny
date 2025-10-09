export default function Register(
    {status = 'empty'}
) {
    if (status === 'success') {
        return <h1>"Registration success!"</h1>
    }
    return (
        <>
            <h1>Registration</h1>
            <form>
                <label>
                    Username: <input name="Username"></input>
                </label>
                <br></br>
                <label>
                    Email Address: <input name="Email"></input>
                </label>
                <br></br>
                <label>
                    Password: <input name="Password"></input>
                </label>
                <p>
                    <label>
                        <input type="radio" name="Artist_Reader" value="Artist"/>
                        Artist
                    </label>
                    <label>
                        <input type="radio" name="Artist_Reader" value="Reader"/>
                        Reader
                    </label>
                </p>
                <br></br>
                <button>Submit</button>
            </form>
        </>
    );
}