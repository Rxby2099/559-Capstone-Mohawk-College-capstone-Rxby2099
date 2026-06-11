import LoginPage from "./login-page";
import {render, screen} from '@testing-library/react';
import {userEvent} from '@testing-library/user-event';

describe("Login Page Testing", () => {

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
    })
    
})