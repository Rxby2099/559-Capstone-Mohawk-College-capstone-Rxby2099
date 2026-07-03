import "../background.css"
import "./login-page.css"

import LoginForm from "./forms/login-form"
import RegistrationForm from "./forms/registration-form"
import Header from "../header-&-footer/header"
import Footer from '../header-&-footer/footer'

import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"

/**
 * Provides the HTML for the LoginPage and uses Tabs, TabsList, and TabsTrigger to allow the user to switch between the login and registration
 * forms.
 * 
 * @returns The HTML for the LoginPage, with both forms combined.
 */
export default function LoginPage(){
    
    return(
        <div id="loginPage">
            <Header />
            <div id = "authForm">
                <Tabs defaultValue = "login">
                    <TabsList>
                        <TabsTrigger value = "login">Login</TabsTrigger>
                        <TabsTrigger value = "register">Sign Up</TabsTrigger>
                    </TabsList>

                    <TabsContent value = "login">
                        <LoginForm />
                    </TabsContent>

                    <TabsContent value = "register">
                        <RegistrationForm />
                    </TabsContent>

                </Tabs>
            </div>
            <Footer />
        </div>
    )
}