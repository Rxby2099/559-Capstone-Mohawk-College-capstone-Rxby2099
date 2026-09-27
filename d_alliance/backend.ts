import express from 'express';
import cors from 'cors';
import supabase from './supabase-backend';

const PORT = 8000;
const app = express();

app.use(cors({ origin: 'http://localhost:5173' })) 
app.use(express.json()) 

app.post('/signup', async(req, resp) => {
   const {username, email, password} = req.body; 


    const { data: existingUser } = await supabase
        .from('users')
        .select('username')
        .eq('username', username)
        .maybeSingle();

    if(existingUser){
        return resp.status(400).json({message: 'Username taken'});
    }


    const {data, error} = await supabase.auth.signUp({
        email: email,
        password: password
    });


    if(error){
        if (error.message.includes('already registered') || error.code === 'user_already_exists') {
            return resp.status(400).json({message: 'Email already in use'});
        }

        console.error('Erorr registering user:', error);
        return resp.status(400).json({message: 'Registration failed', error: error.message });
    }

    console.log("Auth table user created: ", data.user?.id);


    const {error: insertError} = await supabase
        .from('users')
        .insert({
            id: data.user?.id,
            username: username,
            email: email
        });

    if(insertError) {
        if(insertError.code === '23505'){
            return resp.status(400).json({message: 'Username taken'});
        }

        console.error("Error inserting user data into users table:", insertError);
        return resp.status(400).json({message: 'Registration failed', error: insertError.message});
    }


    console.log("Registration attempt: ", {username, email, password});
    resp.json({message: "Successful registration", session: data.session});

});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
