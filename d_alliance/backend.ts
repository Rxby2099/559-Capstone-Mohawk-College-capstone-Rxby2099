import express from 'express';
import cors from 'cors';
import supabase from './supabase-backend';

const PORT = 8000;
const app = express();

app.use(cors({ origin: 'http://localhost:5173' })) 
app.use(express.json()) 

app.post('/signup', async(req, resp) => {
   const {username, email, password} = req.body; 

    const {data, error} = await supabase.auth.signUp({
        email: email,
        password: password
    });

    if(error){
        console.error('Erorr registering user:', error);
        return resp.status(400).json({message: 'Registration failed', error: error.message });
    }

    console.log("Auth table user created: ", data.user?.id);

//    console.log("Username: " + username + "\n", "Email: " + email + "\n", "Password: " + password);

    const {error: insertError} = await supabase
        .from('users')
        .insert({
            id: data.user?.id,
            username: username,
            email: email
        });

    if(insertError) {
        console.error("Error inserting user data into users table:", insertError);
        return resp.status(400).json({message: 'Registration failed', error: insertError.message});
    }

    console.log("Registration attempt: ", {username, email, password});
    resp.json({message: "Successful registration"});

});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
