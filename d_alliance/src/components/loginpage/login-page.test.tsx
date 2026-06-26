import LoginPage from "./login-page";
import {render, screen} from '@testing-library/react';
import {userEvent} from '@testing-library/user-event';
import supabase from "@/supabase-frontend";

vi.mock('@/supabase-frontend', () => ({
    default: {
        auth: {
            signInWithPassword: vi.fn(),
            onAuthStateChange: vi.fn()
        }
    }
}));

/**
 * Tests for the login page, tests if values such as email and password are present on the forms,
 * tests entering valid and invalid credentials in the password, and tests a user properly registering and logging in.
 */
describe("Login Page Testing", () => {

    // Login Form specific tests
    describe("Login Form Testing", () => {
        
        test("Testing to see if the email and password fields are present", () => {
            render(<LoginPage/>);
            expect(screen.getByLabelText("Password:")).toBeInTheDocument();
            expect(screen.getByLabelText("Email:")).toBeInTheDocument();
        })



        test("Testing switching tabs to get to the registration form and back", async ()=> {
            render(<LoginPage/>);

            await userEvent.click(
                screen.getByRole("tab", {
                    name: "Sign Up"
                })
            );

            await userEvent.click(
                screen.getByRole("tab", {
                    name: "Login"
                })
            );
        })
    })



    // Registration Form specific tests
    describe("Registration Form Testing", () => {

        test("Testing to see if the email and password fields are present", async () => {
            render(<LoginPage/>);

            await userEvent.click(
                screen.getByRole("tab", {
                    name: "Sign Up"
                })
            ); 

            expect(screen.getByLabelText("Username:")).toBeInTheDocument();
            expect(screen.getByLabelText("Password:")).toBeInTheDocument();
            expect(screen.getByLabelText("Re-Enter Password:")).toBeInTheDocument();
            expect(screen.getByLabelText("Email:")).toBeInTheDocument();
        })

        

        test("Testing a password that is meant to fail", async () => {
            render(<LoginPage/>);

            await userEvent.click(
                screen.getByRole("tab", {
                    name: "Sign Up"
                })
            ); 

            const input = screen.getByLabelText("Password:");
            await userEvent.type(input, 'Password123');

            const button = screen.getByTitle('subBtn');

            await button.click();

            expect(screen.getByTitle("errorMsg").textContent).toEqual("Password must contain 1: uppercase letter, lowercase letter, number and symbol!");

        });



        test("Testing a password that is valid", async () => {
            render(<LoginPage/>);

            await userEvent.click(
                screen.getByRole("tab", {
                    name: "Sign Up"
                })
            ); 

            const input = screen.getByLabelText("Password:");
            await userEvent.type(input, 'Password_123');

            const button = screen.getByTitle('subBtn');

            await button.click();

            expect(screen.getByTitle("errorMsg").textContent).toEqual("");
        })



        test("Testing a confirmed password that is meant to fail", async () => {
            render(<LoginPage/>);

            await userEvent.click(
                screen.getByRole("tab", {
                    name: "Sign Up"
                })
            ); 

            const input1 = screen.getByLabelText("Password:");
            await userEvent.type(input1, 'Password_123');

            const input2 = screen.getByLabelText("Re-Enter Password:");
            await userEvent.type(input2, 'Password123');

            const button = screen.getByTitle('subBtn');

            await button.click();

            expect(screen.getByTitle("errorMsgPass2").textContent).toEqual("Passwords must match!");
        })



        test("Testing a confirmed password that is valid", async () => {
            render(<LoginPage/>);

            await userEvent.click(
                screen.getByRole("tab", {
                    name: "Sign Up"
                })
            ); 

            const input1 = screen.getByLabelText("Password:");
            await userEvent.type(input1, 'Password_123');

            const input2 = screen.getByLabelText("Re-Enter Password:");
            await userEvent.type(input2, 'Password_123');

            const button = screen.getByTitle('subBtn');

            await button.click();

            expect(screen.getByTitle("errorMsgPass2").textContent).toEqual("");
        })
    })



    // Tests for the Login Page functions itself, both mocking a registration and login.
    describe("Mock user Registration and Login", () => {

        test("Mock a successful user registration", async () => {
            (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
                ok: true,
                json: async () => ({
                    message: "Successful registration", 
                    user:{
                        email: "email@email.com",
                        username: "User123" 
                    }
                })
    
            });

            render(<LoginPage/>);
    
            await userEvent.click(
                screen.getByRole("tab", {
                    name: "Sign Up"
                })
            ); 
    
            await userEvent.type(screen.getByLabelText("Email:"), "email@email.com");
            await userEvent.type(screen.getByLabelText("Username:"), "User123");
            await userEvent.type(screen.getByLabelText("Password:"), "Password_123");
            await userEvent.type(screen.getByLabelText("Re-Enter Password:"), "Password_123");
            await userEvent.click(screen.getByTitle("subBtn"));
    
            expect((globalThis.fetch as ReturnType<typeof vi.fn>)).toHaveBeenCalledWith("http://localhost:8000/signup", expect.objectContaining({
                method: "POST",
                body: JSON.stringify({ 
                    email: "email@email.com",
                    username: "User123",
                    password: "Password_123"
                })
            }));
        });


        
        test("Mock a sucessful user sign in", async () => {
            (supabase.auth.signInWithPassword as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
                data: {
                    user: {
                        email: "email@email.com"
                    },
                    session: {}
                },
                error: null
            });
        
            render(<LoginPage/>);

            await userEvent.type(screen.getByLabelText("Email:"), "email@email.com");
            await userEvent.type(screen.getByLabelText("Password:"), "Password_123");
            await userEvent.click(screen.getByRole("button", { name: "Sign in" }));

            expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
                email: "email@email.com",
                password: "Password_123"
            });
        });
    });
});