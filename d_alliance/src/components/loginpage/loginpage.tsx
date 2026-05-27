import "./loginpage.css"
import LoginForm from "../forms/login-form"
import RegistrationForm from "../forms/registration-form"
import Header from "../header-&-footer/header"
import Footer from '../header-&-footer/footer'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"


export default function LoginPage(){
    
    return(
        <>
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
        </>
    )
}