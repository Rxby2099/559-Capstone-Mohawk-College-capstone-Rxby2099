import express from 'express';
import cors from 'cors';
import supabase from './supabase-backend';
import dokkanDb from './lib/dokkan-db';
import cardRouter from './routes/cards';


const PORT = 8000;
const app = express();

app.use(cors({ origin: 'http://localhost:5173' })) 
app.use(express.json()) 
app.use('/api/cards', cardRouter);

/**
 * Handles the signup functionality
 */
app.post('/signup', async(req, resp) => {
   const {username, email, password} = req.body; 

    // Checking for an existing email in the database and send the correct error response if so
    const { data : existingEmail } = await supabase
        .from('users')
        .select('email')
        .eq('email', email)
        .maybeSingle();

    if(existingEmail) {
        return resp.status(400).json({message: 'Email already in use'})
    }

    // Checking for an existing username in the database and send the correct error response if so
    const { data: existingUser } = await supabase
        .from('users')
        .select('username')
        .ilike('username', username)
        .maybeSingle();

    if(existingUser){
        return resp.status(400).json({message: 'Username taken'});
    }

    // Attempts to signup, awaiting the email and password for the signup 
    const {data, error} = await supabase.auth.signUp({
        email: email,
        password: password
    });


    if(error){
        console.error('Erorr registering user:', error);

        if(error.message === 'User already registered' || error.code === 'user_already_exists'){
            return resp.status(400).json({message: 'Email already in use'});
        }
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


    // Checks for an existing user in the table when inserting, and checks if there is an overall error when inserting
    if(insertError) {
        if(data.user?.id){
            const {error: deleteError} = await supabase.auth.admin.deleteUser(data.user.id);
            if(deleteError){
                console.error('Failed to rollback auth user:', deleteError);
            }
        }


        if(insertError.code === '23505'){
            if(insertError.message.includes('email')){
                return resp.status(400).json({message: 'Email already in use'});
            }
            return resp.status(400).json({message: 'Username taken'});
        }

        console.error("Error inserting user data into users table:", insertError);
        return resp.status(400).json({message: 'Registration failed', error: insertError.message});
    }


    // Updates the system with the successful registration message
    console.log("Registration attempt: ", {username, email});
    resp.json({message: "Successful registration", session: data.session});

});

// Announces the server is running on the given port
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
